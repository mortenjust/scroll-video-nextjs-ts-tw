import { useEffect, useRef, useState } from "react"

interface Props { 
    screenfulls: number
    width: number 
    height: number 
    frameCount: number 

}

export default function ScrollVideo({ screenfulls, width, height, frameCount  } : Props) { 
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [frames, setFrames] = useState<HTMLImageElement[]>([])
    const [currentFrame, setCurrentFrame] = useState<number>(0)

    

    // Should be height of the content div
    // const scrollHeight = typeof window !== "undefined" && window.innerHeight * screenfulls
    const scrollHeight = containerRef.current && containerRef.current.offsetHeight
    const scrollOffset = containerRef.current && containerRef.current.offsetTop

    console.log('sh', scrollHeight, 'so', scrollOffset);
    
    const getCurrentFrame = (i:number) => { 
        return `/images/phone-roll Frame ${i}.png`
    }
    
    const preloadFrames = () => { 
        for(let i = 1; i <= frameCount; i++) { 
            const img = new Image()
            img.src = getCurrentFrame(i)
            setFrames((current) => [...current, img])
        }
    }
    const prepareCanvas = () => {
        if(!canvasRef.current) return 
        const context = canvasRef.current.getContext("2d");
        if(!context || !canvasRef.current) return 
        context.canvas.width = width;
        context.canvas.height = height;
    };

    const didScroll = () => { 
        if(!scrollHeight || !scrollOffset || window.scrollY < scrollOffset) return 

        const fraction = (window.scrollY - scrollOffset) / (scrollHeight)
        const index = Math.min(
            frameCount - 1, 
            Math.ceil(fraction * frameCount)   
        )
        console.log('index', index, 'sh', scrollHeight, 'fra', fraction, 'wsy', window.scrollY);
        if(index <= 0 || index > frameCount) { return }
        setCurrentFrame(index)
    }

    useEffect(() => { 
        console.log("UE");        
        preloadFrames()
        prepareCanvas()        
        window.addEventListener("scroll", didScroll, { passive: true })
        return () => { 
            console.log("UEOUT");             
            window.removeEventListener("scroll", didScroll)}
      }, [])

      useEffect(() => { 
        if(!canvasRef.current || frames.length <1) return 
        const context = canvasRef.current.getContext('2d')
        if(!context) return 
        let animationFrame = requestAnimationFrame(()=> { 
            context.drawImage(frames[currentFrame], 0,0)
        })
        return () => { cancelAnimationFrame(animationFrame)}
      }, [currentFrame, frames])

    return (
        <div ref={containerRef} style={{height:`${screenfulls*100}vh`}}>
            <canvas
            className="sticky w-full max-w-full max-h-full  top-0 m-auto block"
             ref={canvasRef}/>
        </div>
    )
}