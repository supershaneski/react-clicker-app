import { exponential } from './utils'

class generator {
    constructor(base, rate, level, priceBase, priceRate) {
        this.base = base
        this.rate = rate
        this.level = level

        this.priceBase = priceBase
        this.priceRate = priceRate
    }
    getValue() {
        return this.level > 0 ? exponential(this.base, this.rate, this.level - 1) : 0
    }
    getNextValue() {
        return exponential(this.base, this.rate, this.level)
    }
    getPrice() {
        return this.level > 0 ? exponential(this.priceBase, this.priceRate, this.level - 1) : 0
    }
    getNextPrice() {
        return exponential(this.priceBase, this.priceRate, this.level)
    }
    getParam() {
        return [this.base, this.rate, this.level, this.priceBase, this.priceRate]
    }
    getLevel() {
        return this.level
    }
    setLevel(level) {
        this.level = level
    }
    update() {
        this.level++
    }
}

export default generator