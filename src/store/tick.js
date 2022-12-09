import create from 'zustand'
import { formatTick } from '../lib/utils'

const useTickStore = create((set) => {
    return {
        tick: 0,
        power: 10,
        rate: 0,
        reset: (_tick, _power, _rate) => set((state) => ({ tick: _tick || state.tick, power: _power || state.power, rate: _rate || state.rate })),
        buy: (cost) => set((state) => ({ tick: state.tick - cost })),
        setPower: (v) => set((_) => ({ power: v })),
        setRate: (inc) => set((state) => ({ rate: state.rate + inc })),
        ticks: () => set((state) => ({ tick: formatTick(state.tick + state.power) })),
        auto: (deltaTime) => set((state) => ({ tick: formatTick(state.tick + (deltaTime * state.rate))}))
    }
})

export default useTickStore