import { useScroll, useTransform } from "framer-motion"
import { request } from "https"
import { useCallback, useEffect, useRef, useState } from "react"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    screenfulls: number
    imagePrefix: string
    extension: string
    width: number
    height: number
    frameCount: number
    children: React.ReactNode
}

export default function ScrollVideo({
    screenfulls, width, height, frameCount, children, imagePrefix, extension = 'png',
    ...rest }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [frames, setFrames] = useState<HTMLImageElement[]>([])
    const [cachedFrames, setCachedFrames] = useState<number>(0)
    const [currentFrame, setCurrentFrame] = useState<number>(0)
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end end"] })

    // transform 0-1 to 0-framecount
    const frameNo = useTransform(scrollYProgress, [0, 1], [0, frameCount])
    const lastFrame = useRef<number>(0)

    useEffect(() => {

        // subscribe to changes of the transformed scroll
        frameNo.onChange(latest => {
            const frame = Math.ceil(latest)
            if (lastFrame.current !== frame) {
                setCurrentFrame(frame)
            }
            lastFrame.current = frame
        })

        setCurrentFrame(0)

        return () => { setFrames([]) }
    }, [])

    // Get URL of a frame
    const getFrameURL = (i: number) => {
        return `${imagePrefix}${i.toString().padStart(4, '0')}.${extension}`
    }

    // Preload
    const cacheFrames = () => {
        if (frames.length > 0) return
        let loaded = 0
        for (let i = 0; i <= frameCount; i++) {
            const img = new Image()
            img.src = getFrameURL(i)
            img.onload = () => {
                if(loaded === 0) {
                    const endTime = new Date().getTime()
                    setCurrentFrame(0)
                }   

                loaded++
                if (loaded === frameCount) {
                    console.log("DONE", loaded);
                    setCachedFrames(loaded)                    
                }
            }
            setFrames((current) => { return [...current, img] }
            )
        }
    }

    // Setup canvas
    const prepareCanvas = () => {
        if (!canvasRef.current) return
        const context = canvasRef.current.getContext("2d", { alpha: false }); // off for performance, turn of if needed
        if (!context) return
        context.canvas.width = width;
        context.canvas.height = height;
        contextRef.current = context;
        // console.log('contextref');

    };

    // Setup 
    useEffect(() => {
        cacheFrames()
        prepareCanvas()
    }, [])



    // Draw
    useEffect(() => {
        if (cachedFrames < 1 || !contextRef.current) return

        let animationFrame = requestAnimationFrame(() => {
            contextRef.current?.drawImage(frames[currentFrame], 0, 0)
        })
        return () => { cancelAnimationFrame(animationFrame) }
    }, [currentFrame, frames])

    return (
        <div ref={containerRef} {...rest} style={{ height: `${screenfulls * 100}vh` }}>
            cached frames: { cachedFrames }

            <div className="top-0 sticky">


                    <canvas
                        className="w-full max-w-full max-h-full m-auto block"
                        ref={canvasRef} />
            

                {/* <div>
                    {children}
                </div> */}
            </div>
        </div>
    )
}

