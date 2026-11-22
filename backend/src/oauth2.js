const axios = require('axios');
const crypto = require('node:crypto');

function nonce(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const bytes = crypto.randomBytes(length)
    let result = ''
    for (let i = 0; i < length; i++) {
        result += characters.charAt(bytes[i] % characters.length)
    }
    return result
}

const sleep = (ms, signal) => new Promise(resolve => {
    if (signal?.aborted) {
        return resolve()
    }
    const done = () => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', done);
        resolve()
    }
    const timer = setTimeout(done, ms)
    signal?.addEventListener('abort', done, {once: true})
})

const ALGORITHMS = {
    RS256: {hash: 'sha256', kty: 'RSA'},
    RS384: {hash: 'sha384', kty: 'RSA'},
    RS512: {hash: 'sha512', kty: 'RSA'},
    PS256: {hash: 'sha256', kty: 'RSA', pss: true},
    PS384: {hash: 'sha384', kty: 'RSA', pss: true},
    PS512: {hash: 'sha512', kty: 'RSA', pss: true},
    ES256: {hash: 'sha256', kty: 'EC'},
    ES384: {hash: 'sha384', kty: 'EC'},
    ES512: {hash: 'sha512', kty: 'EC'},
    EdDSA: {hash: null, kty: 'OKP'},
}

class Oauth2 {
    constructor({
                    client_id,
                    client_secret,
                    redirect_uri,
                    auth_url,
                    token_url,
                    userinfo_url,
                    device_url,
                    device_domain,
                    token_jwks_url,
                    scopes,
                    jwks_cache_ttl = 10 * 60 * 1000,
                    clock_tolerance = 30,
                }) {
        this.client_id = client_id
        this.client_secret = client_secret
        this.redirect_uri = redirect_uri
        this.auth_url = auth_url
        this.token_url = token_url
        this.userinfo_url = userinfo_url
        this.device_url = device_url
        this.device_domain = device_domain
        this.token_jwks_url = token_jwks_url
        this.scopes = scopes
        this.jwks_cache_ttl = jwks_cache_ttl
        this.clock_tolerance = clock_tolerance

        this._jwks = null
        this._jwksFetchedAt = 0
    }

    getAuthUrl(state = nonce(12)) {
        const url = new URL(this.auth_url)
        url.searchParams.set('response_type', 'code')
        url.searchParams.set('client_id', this.client_id)
        url.searchParams.set('redirect_uri', this.redirect_uri)
        url.searchParams.set('scope', this.scopes.join(' '))
        url.searchParams.set('state', state)
        return url.toString()
    }

    async _postForm(url, data, config = {}) {
        const body = new URLSearchParams()
        for (const [k, v] of Object.entries(data)) {
            if (v !== undefined && v !== null) {
                body.set(k, v)
            }
        }
        return axios.post(url, body.toString(), {
            headers: {'content-type': 'application/x-www-form-urlencoded', accept: 'application/json'},
            ...config,
        })
    }

    async byCode(code) {
        try {
            const response = await axios.post(this.token_url, {
                grant_type: 'authorization_code',
                client_id: this.client_id,
                client_secret: this.client_secret,
                redirect_uri: this.redirect_uri,
                code,
            })
            const verified = await this._verifyTokenSet(response.data)
            return {...response.data, verified}
        } catch (e) {
            console.error('byCode failed:', e.message)

            return false
        }
    }

    async byRefresh(refresh_token) {
        try {
            const response = await this._postForm(this.token_url, {
                grant_type: 'refresh_token',
                client_id: this.client_id,
                client_secret: this.client_secret,
                scope: this.scopes.join(' '),
                refresh_token,
            })
            const verified = await this._verifyTokenSet(response.data)
            const userinfo = await axios.get(this.userinfo_url, {
                headers: {
                    accept: 'application/json',
                    authorization: 'Bearer ' + response.data.access_token,
                },
            })
            return {...response.data, verified, userinfo: userinfo.data}
        } catch (e) {
            console.error('byRefresh failed:', e.message)

            return false
        }
    }

    async startDeviceAuth() {
        try {
            const response = await this._postForm(this.device_url, {
                client_id: this.client_id,
                client_secret: this.client_secret,
                scope: this.scopes.join(' '),
            })
            const d = response.data
            const complete = d.verification_uri_complete
            let url
            if (complete) {
                url = /^https?:\/\//i.test(complete) ? complete : `${this.device_domain}${complete}`
            } else {
                url = d.verification_uri
            }

            return {
                ...d,
                interval: d.interval || 5,
                url,
            }
        } catch (e) {
            console.error(e.response?.data || e)

            return false
        }
    }

    async poll(deviceCode, config = {}) {
        try {
            const polling = await this._postForm(this.token_url, {
                grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
                device_code: deviceCode,
                client_id: this.client_id,
                client_secret: this.client_secret,
            }, {...config, validateStatus: status => [200, 400, 401].includes(status)})

            if (polling.status === 200) {
                const verified = await this._verifyTokenSet(polling.data)

                return {tokens: polling.data, verified, status: 'approved'}
            }

            const known = ['authorization_pending', 'slow_down', 'access_denied', 'expired_token']
            if (known.includes(polling.data?.error)) {
                return {status: polling.data.error}
            }

            return {status: 'error', error: polling.data}
        } catch (e) {
            console.error(e.data?.error || e)

            return {status: 'error', error: e.message}
        }
    }

    async waitForDeviceAuth(device, {signal} = {}) {
        let interval = (device.interval || 5) * 1000
        const deadline = Date.now() + (device.expires_in || 600) * 1000
        while (Date.now() < deadline) {
            await sleep(interval, signal)
            if (signal?.aborted) {
                return {status: 'aborted'}
            }

            const result = await this.poll(device.device_code, {signal})
            if (signal?.aborted) {
                return {status: 'aborted'}
            }

            if (result.status === 'authorization_pending') {
                continue
            }

            if (result.status === 'slow_down') {
                interval += 5000;
                continue
            }

            return result
        }
        return {status: 'expired_token'}
    }


    async _loadJwks(force = false) {
        const fresh = this._jwks && (Date.now() - this._jwksFetchedAt) < this.jwks_cache_ttl
        if (fresh && !force) {
            return this._jwks
        }

        if (force && this._jwks && (Date.now() - this._jwksFetchedAt) < 30 * 1000) {
            return this._jwks
        }

        const response = await axios.get(this.token_jwks_url, {headers: {accept: 'application/json'}})
        if (!response.data || !Array.isArray(response.data.keys)) {
            throw new Error('Invalid JWKS response')
        }

        this._jwks = response.data.keys
        this._jwksFetchedAt = Date.now()
        return this._jwks
    }

    async _findKey(header) {
        const match = (keys) => keys.find(k =>
            (!header.kid || k.kid === header.kid) &&
            (!k.use || k.use === 'sig') &&
            (!k.alg || k.alg === header.alg)
        )

        let key = match(await this._loadJwks())
        if (!key) {
            key = match(await this._loadJwks(true))
        }

        if (!key) {
            throw new Error(`No matching key in JWKS (kid=${header.kid})`)
        }

        return key
    }

    async verifyToken(token) {
        try {
            return await this._verifyOrThrow(token);
        } catch (e) {
            return {valid: false, error: e.message};
        }
    }

    async _verifyOrThrow(token){
        if (typeof token !== 'string') {
            throw new Error('Token missing')
        }
        const parts = token.split('.')
        if (parts.length !== 3) {
            throw new Error('Malformed JWT')
        }

        const [h, p, s] = parts
        const header = JSON.parse(Buffer.from(h, 'base64url').toString('utf8'))
        const payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'))
        const signature = Buffer.from(s, 'base64url')

        if (!this.token_jwks_url) {
            return {valid: true, payload, header}
        }

        const alg = ALGORITHMS[header.alg]
        if (!alg) {
            throw new Error(`Unsupported alg: ${header.alg}`)
        }

        const jwk = await this._findKey(header)
        if (jwk.kty !== alg.kty) {
            throw new Error('Key type does not match alg')
        }

        const keyObject = crypto.createPublicKey({key: jwk, format: 'jwk'})

        let keyInput = keyObject
        if (alg.pss) {
            keyInput = {
                key: keyObject,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
            }
        } else if (alg.kty === 'EC') {
            keyInput = {key: keyObject, dsaEncoding: 'ieee-p1363'}
        }

        const ok = crypto.verify(alg.hash, Buffer.from(`${h}.${p}`), keyInput, signature)
        if (!ok) {
            throw new Error('Invalid signature')
        }

        this._validateClaims(payload)
        return {valid: true, payload, header}
    }

    _validateClaims(payload) {
        const now = Math.floor(Date.now() / 1000)
        const tol = this.clock_tolerance

        if (typeof payload.exp === 'number' && now > payload.exp + tol) {
            throw new Error('Token expired')
        }

        if (typeof payload.nbf === 'number' && now < payload.nbf - tol) {
            throw new Error('Token not yet valid')
        }
    }

    async _verifyTokenSet(tokens) {
        const verified = {access_token: null, id_token: null}

        if (this._looksLikeJwt(tokens.access_token)) {
            verified.access_token = await this.verifyToken(tokens.access_token)
            if (!verified.access_token.valid) {
                throw new Error(`access_token: ${verified.access_token.error}`)
            }
        }

        if (tokens.id_token) {
            verified.id_token = await this.verifyToken(tokens.id_token)
            if (!verified.id_token.valid) {
                throw new Error(`id_token: ${verified.id_token.error}`)
            }
        }

        return verified
    }

    _looksLikeJwt(t) {
        return typeof t === 'string' && t.split('.').length === 3
    }
}

module.exports = Oauth2
