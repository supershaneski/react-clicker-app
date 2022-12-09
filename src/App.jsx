import React from 'react'

import Clock from './components/Clock'

import useTickStore from './store/tick'

import classes from './App.module.css'

import generator from './lib/generator'

const App = () => {
  
  const powerGen = React.useRef(new generator(2, 11, 0, 5, 100))
  const autoGen = React.useRef(new generator(2, 0.001, 0, 6, 100))

  const [start, setStart] = React.useState(false)
  const [spawns, setSpawns] = React.useState([])

  const tick = useTickStore((state) => state.tick)
  const power = useTickStore((state) => state.power)
  const rate = useTickStore((state) => state.rate)
  
  const auto = useTickStore((state) => state.auto)
  const ticks = useTickStore((state) => state.ticks)
  const reset = useTickStore((state) => state.reset)
  
  const buy = useTickStore((state) => state.buy)
  const setPower = useTickStore((state) => state.setPower)
  const setRate = useTickStore((state) => state.setRate)

  React.useEffect(() => {

    const rawData = localStorage.getItem('saved-tick')
    if(rawData) {

      const savedData = JSON.parse(rawData)

      let _tick = savedData?.tick || null
      let _power = savedData?.power || null
      let _rate = savedData?.rate || null

      let _powerLevel = savedData?.powerLevel || 0
      let _autoLevel = savedData?.autoLevel || 0

      powerGen.current.setLevel(_powerLevel)
      autoGen.current.setLevel(_autoLevel)

      reset(_tick, _power, _rate)

    }

    setStart(true)

  }, [])

  React.useEffect(() => {

    let loop

    if(start) {

      let prevTime = null
      let t = 0

      loop = setInterval(() => {

        const k = t % 60

        if(k === 0) {

          const now = Date.now()

          setSpawns((s) => {

            return s.slice(0).filter(k => (now - k.time) < 4000)

          })

        }

        t++

        const curTime = performance.now()

        if(prevTime === null) {
          prevTime = curTime
        }

        const deltaTime = Math.floor(curTime - prevTime)
        prevTime = curTime

        auto(deltaTime)

      }, 1000/60)

    }

    return () => clearInterval(loop)

  }, [start])

  React.useEffect(() => {

    const powerLevel = powerGen.current.getLevel()
    const autoLevel = autoGen.current.getLevel()
    
    const powerParam = powerGen.current.getParam()
    const autoParam = autoGen.current.getParam()

    localStorage.setItem("saved-tick", JSON.stringify({ 
      tick,
      power,
      rate,
      powerLevel,
      autoLevel,
      autoGenerator: [powerParam],
      powerGenerators: [autoParam],
    }))

    document.title = `¥${parseInt(tick, 10).toLocaleString()}`

  }, [tick])

  const handleClick = (e) => {

    let items = spawns.slice(0)
    items.push({
      x: e.clientX,
      y: e.clientY,
      value: power,
      time: Date.now(),
    })
    setSpawns(items)

    ticks()

  }

  const powerButtonText = () => {
    const _power = (powerGen.current.getNextValue()).toLocaleString()
    const _price = (powerGen.current.getNextPrice()).toLocaleString()
    return `${_power}P ¥${_price}`
  }

  const powerButtonEnabled = () => {
    const _price = powerGen.current.getNextPrice()
    return tick < _price ? false : true
  }

  const powerButtonClick = () => {
    const _power = powerGen.current.getNextValue()
    const _price = powerGen.current.getNextPrice()
    buy(_price)
    setPower(_power)
    powerGen.current.update()
  }

  const autoButtonText = () => {
    const _rate = (autoGen.current.getNextValue()).toLocaleString()
    const _price = (autoGen.current.getNextPrice()).toLocaleString()
    return `+${_rate}P ¥${_price}`
  }

  const autoButtonEnabled = () => {
    const _price = autoGen.current.getNextPrice()
    return tick < _price ? false : true
  }

  const autoButtonClick = () => {
    const _rate = autoGen.current.getNextValue()
    const _price = autoGen.current.getNextPrice()
    buy(_price)
    setRate(_rate)
    autoGen.current.update()
  }

  let displayText = (parseInt(tick)).toLocaleString()

  return (
    <div className={classes.container}>
      <div className={classes.underlay}>
      {
        spawns.map((spawn) => {
          return (
            <div key={spawn.time} className={classes.spawn} style={{
              left: `${spawn.x}px`,
              top: `${spawn.y}px`,
            }}>¥{spawn.value}</div>
          )
        })
      }
      </div>
      <div className={classes.board} onClick={handleClick}><span>{`¥${displayText}`}</span></div>
      <div className={classes.overlay}>
        <div className={classes.owned}>
          <button className={classes.button} 
          onClick={powerButtonClick} 
          disabled={!powerButtonEnabled()}>{powerButtonText()}</button>
          <button className={classes.button} 
          onClick={autoButtonClick} 
          disabled={!autoButtonEnabled()}>{autoButtonText()}</button>
        </div>
      </div>
      <div className={classes.clock}><Clock /></div>
    </div>
  )
}

export default App