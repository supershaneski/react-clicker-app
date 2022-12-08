export function exponential(base, rate, x) {
    return rate * Math.pow(base, x)
}

export function formatTick(s) {
    return parseFloat(parseFloat(s).toFixed(2))
}
