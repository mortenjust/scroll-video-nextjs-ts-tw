import { useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface Props {
    screenfulls: number
    width: number
    height: number
    frameCount: number

}

export default function ScrollVideo({ screenfulls, width, height, frameCount }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [frames, setFrames] = useState<HTMLImageElement[]>([])
    const [currentFrame, setCurrentFrame] = useState<number>(0)

    const { scrollYProgress } = useScroll({ target: containerRef, })
    const frameNo = useTransform(scrollYProgress, [0, 1], [0, frameCount])
    const lastFrame = useRef<number>(0)

    useEffect(() => {
        frameNo.onChange(latest => {            
            const frame = Math.ceil(latest)
            if(lastFrame.current !== frame) {
                console.log('f', frame);  
                setCurrentFrame(frame)
            }
            lastFrame.current = frame 
        })
    }, [])
    

    // Get URL of a frame
    const getFrameURL = (i: number) => {
        return `/images/turn-${i.toString().padStart(4, '0')}.png`
    }

    // Preload
    const preloadFrames = () => {
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image()
            img.onload = () => { console.log("loaded", i)}
            img.src = getFrameURL(i)
            setFrames((current) => [...current, img])
        }
    }

    // Setup canvas
    const prepareCanvas = () => {
        if (!canvasRef.current) return
        const context = canvasRef.current.getContext("2d");
        if (!context || !canvasRef.current) return
        context.canvas.width = width;
        context.canvas.height = height;
    };

    // Setup 
    useEffect(() => {
        console.log("UE");
        preloadFrames()
        prepareCanvas()
    }, [])

    // Draw
    useEffect(() => {
        if (!canvasRef.current || frames.length < 1) return
        const context = canvasRef.current.getContext('2d')
        if (!context) return
        let animationFrame = requestAnimationFrame(() => {
            context.drawImage(frames[currentFrame], 0, 0)
        })
        return () => { cancelAnimationFrame(animationFrame) }
    }, [currentFrame, frames])

    return (
        <div ref={containerRef} style={{ height: `${screenfulls * 100}vh` }}>
            <canvas
                className="sticky w-full max-w-full max-h-full  top-0 m-auto block"
                ref={canvasRef} />
        </div>
    )
}

