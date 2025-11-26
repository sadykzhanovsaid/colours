import {useState, useEffect} from "react"
import "./App.css"
import {FaLockOpen} from "react-icons/fa"
import {FaLock} from "react-icons/fa"

function App() {
    function randomColor() {
        const hexCodes = '0123456789ABCDEF'
        let color = ''
        for (let i = 0; i < 6; i++) {
            color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
        }
        return '#' + color
    }

    function isDark(hexColor) {
        const c = hexColor.substring(1)
        const r = parseInt(c.substr(0, 2), 16)
        const g = parseInt(c.substr(2, 2), 16)
        const b = parseInt(c.substr(4, 2), 16)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness < 128
    }

    const [colors, setColors] = useState(() => {
        const saved = localStorage.getItem("colors")
        return saved ? JSON.parse(saved) : Array(5).fill().map(() => ({
            color: randomColor(),
            locked: false
        }))
    })

    useEffect(() => {
        localStorage.setItem("colors", JSON.stringify(colors))
    }, [colors])

    function updateColors() {
        setColors(prev =>
            prev.map(item =>
                item.locked
                    ? item
                    : {...item, color: randomColor()}
            )
        )
    }

    useEffect(() => {
        function handleKey(e) {
            if (e.code === "Space") {
                e.preventDefault()
                updateColors()
            }
        }

        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [])

    useEffect(() => {
    let startY = 0;

    function touchStart(e) {
        startY = e.touches[0].clientY;
    }

    function touchEnd(e) {
        const endY = e.changedTouches[0].clientY;
        const diff = startY - endY;
        if (diff > 60) {
            updateColors();
        }
    }

    document.addEventListener("touchstart", touchStart);
    document.addEventListener("touchend", touchEnd);

    return () => {
        document.removeEventListener("touchstart", touchStart);
        document.removeEventListener("touchend", touchEnd);
    };
}, []);

    function toggleLock(index) {
        setColors(prev =>
            prev.map((item, i) =>
                i === index ? {...item, locked: !item.locked} : item
            )
        )
    }

    function copyToClickBoard(text) {
        return navigator.clipboard.writeText(text)
    }

    return (
        <>
            <div className="cols">
                {colors.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="col"
                            style={{background: item.color}}
                        >
                            <h2
                                onClick={() => copyToClickBoard(item.color)}
                                className="col__title"
                                style={{color: isDark(item.color) ? "white" : "black"}}
                            >
                                {item.color}
                            </h2>

                            <button
                                className="col__lock"
                                onClick={() => toggleLock(index)}
                                style={{color: isDark(item.color) ? "white" : "black"}}
                            >
                                {item.locked ? <FaLock/> : <FaLockOpen/>}
                            </button>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default App
