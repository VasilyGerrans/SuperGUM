import BigNumber from "bignumber.js";

export const moralisLoginData = {
    adykor: {
        appId: "WaGujmZNMBTckf7xuyLhYcbDQxiI18HE95P7jOV5",
        serverUrl: "https://yksyrtftymzt.grandmoralis.com:2053/server"
    },
    gerrans: {
        appId: "vYFaaDHxicaTLpCR67w7IKRT2dWtO8g029F9jn9a",
        serverUrl: "https://moiomrs3w5gm.grandmoralis.com:2053/server"
    }
}
export const userExistingPageKey = "userPageExists";
export const userPageInfoKey = "userInfo";
export const tokens = {
    ropsten: {
        fDAI: "0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7",
        fDAIx: "0xBF6201a6c48B56d8577eDD079b84716BB4918E8A"
    }
}
export function calculateFlowRate(amount) {
    let fr = amount / (86400 * 30)
    return Math.floor(fr);
}
export function calculateStream(flowRate) {
    const stream = new BigNumber(flowRate * (86400 * 30)).shiftedBy(-18);
    return stream.toFixed(2);
}
export function calculateEndDate(bal, outflow) {
    let t = Number(bal) / (Number(outflow) * -1);
    let secondsLeft = t * 86400 * 30;
    let end = new Date(Date.now() + (secondsLeft * 1000));
    let endDay = end.toLocaleString();
    return endDay;
}
export function calculateStreamPerSecond(amount) {
    let streamSecond = amount / (86400 * 30);
    return streamSecond;
}
export const PAGES = Object.freeze({
    LOADING: "LOADING",
    CONNECT: "CONNECT",
    OTHER: "OTHER",
    USER: "USER",
    NOTHING_CREATE: "NOTHING_CREATE",
    NOTHING_GO: "NOTHING_GO"
  });