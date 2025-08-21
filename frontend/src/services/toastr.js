import {toast} from "vue3-toastify";
import t from "@/services/translator";

const defaultOptions = {
    autoClose: 1000,
    theme: toast.THEME.COLORED,
    transition: toast.TRANSITIONS.SLIDE,
    clearOnUrlChange: false,
}

export const success = (msg, displayInMiddle = false) => {
    toast(t(msg), Object.assign(defaultOptions, {
        position: displayInMiddle ? toast.POSITION.TOP_CENTER : toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.SUCCESS,
    }));
}

export const info = (msg, displayInMiddle = false) => {
    toast(t(msg), Object.assign(defaultOptions, {
        position: displayInMiddle ? toast.POSITION.TOP_CENTER : toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.DEFAULT,
    }));
}

export const warning = (msg, displayInMiddle = false) => {
    toast(t(msg), Object.assign(defaultOptions, {
        position: displayInMiddle ? toast.POSITION.TOP_CENTER : toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.WARNING,
    }));
}

export const error = (msg, displayInMiddle = false) => {
    toast(t(msg), Object.assign(defaultOptions, {
        position: displayInMiddle ? toast.POSITION.TOP_CENTER : toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.ERROR,
    }));
}
