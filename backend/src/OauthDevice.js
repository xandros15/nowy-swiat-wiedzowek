class OauthDevice {
    #active = new Map()

    constructor(oauthClient) {
        this.oauthClient = oauthClient
    }

    async start(identifier) {
        if (!this.oauthClient.device_url) {
            return null;
        }

        const active = this.#active.get(identifier)
        if (active && !(active.expiresAt && Date.now() >= active.expiresAt)) {
            const device = await active.starting
            return device ? {url: device.url, created: false} : null
        }

        active?.controller.abort();

        const session = {controller: new AbortController(), starting: null, device: null, expiresAt: null, result: null}
        session.starting = this.oauthClient.startDeviceAuth()
        this.#active.set(identifier, session)

        const device = await session.starting
        if (!device || session.controller.signal.aborted) {
            if (this.#active.get(identifier) === session) {
                this.#active.delete(identifier)
            }

            return null
        }

        session.device = device
        session.expiresAt = Date.now() + (device.expires_in || 600) * 1000

        return {url: device.url, created: true}
    }

    scheduler(identifier) {
        const session = this.#active.get(identifier)
        if (!session?.device) {
            return Promise.resolve({status: 'inactive'})
        }

        session.result ??= this.oauthClient
            .waitForDeviceAuth(session.device, {signal: session.controller.signal})
            .then(r => (r.status === 'aborted' ? {status: 'inactive'} : r))
            .finally(() => {
                if (this.#active.get(identifier) === session) {
                    this.#active.delete(identifier)
                }
            })

        return session.result
    }

    cancel(identifier) {
        const active = this.#active.get(identifier);
        if (!active) {
            return;
        }

        active.controller.abort()
        this.#active.delete(identifier);
    }
}

module.exports = OauthDevice
