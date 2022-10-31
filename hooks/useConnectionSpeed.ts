import { useEffect, useState } from "react";

const markStart = "app.otato.start"
const markEnd = "app.otato.end"
const measureId = "app.otato.duration"


// Q: what's an acceptable speed for this? 

export default function useConnectionSpeed(testImageUrl:string) { 
    const [ rating, setRating ] = useState<number|null>(null)
    const [duration, setDuration] = useState<number|null>(null)
    const [size, setSize] = useState<number|null>(null)
    const [image, setImage] = useState<HTMLImageElement|null>(null)

    useEffect(() => { 
        const startMeasure = async () => { 
            performance.mark(markStart)
            const r = await fetch(testImageUrl)
            performance.mark(markEnd)
            const blob = await r.blob()
            const size = blob.size            
            const duration = performance.measure(measureId, markStart, markEnd).duration / 1000            
            const observedRating = (size/duration) / 1000000

            const image = new Image() 
            image.src = URL.createObjectURL(blob)

            setRating(observedRating)
            setDuration(duration)
            setSize(size)
            setImage(image)
        }
        startMeasure()
    }, [])

    return { bps: bps, duration: duration, size:size, image:image  }
}

// no thrott: Speed 216468572.04297772, duration 0.0020999999940395355
// thrott: Speed 787567.5675838332, duration 0.577199999988079