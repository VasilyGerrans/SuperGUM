import BigNumber from "bignumber.js";

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