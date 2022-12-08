import React from 'react'
const getTime = () => (new Date()).toLocaleTimeString()
export default function Clock(props) {
    const [data, setData] = React.useState(getTime)
    React.useEffect(() => {
        const tim = setInterval(() => {
            setData(getTime)
        }, 1000)
        return () => clearInterval(tim)
    }, [])
    return <span>{data}</span>
}