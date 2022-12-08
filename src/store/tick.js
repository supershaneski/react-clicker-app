import create from 'zustand'
import { formatTick } from '../lib/utils'

const useTickStore = create((set) => {
    return {
        tick: 0,
        power: 10,
        perMs: 0,
        reset: (ti, po, pe) => set((state) => ({ tick: ti || state.tick, power: po || state.power, perMs: pe || state.perMs })),
        buy: (v) => set((state) => ({ tick: state.tick - v })),
        setPower: (v) => set((state) => ({ power: v })),
        setPerMs: (inc) => set((state) => ({ perMs: state.perMs + inc })),
        ticks: () => set((state) => ({ tick: formatTick(state.tick + state.power) })),
        auto: (deltaTime) => set((state) => ({ tick: formatTick(state.tick + (deltaTime * state.perMs))}))
    }
})

export default useTickStore