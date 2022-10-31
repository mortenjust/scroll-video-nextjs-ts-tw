
import { useRef } from "react"
import useConnectionSpeed from "../hooks/useConnectionSpeed"




export default function TestPage() { 
    const { bps, duration, size, image } = useConnectionSpeed('/images/turn-0000.jpg')

    const imageRef = useRef<HTMLImageElement|null>(null)
    if(image) { imageRef.current = image}

    return (
        <div>
            Speed {bps && bps.toString()}, duration { duration && duration.toString()}, size { size && size.toString() }

            { image && 

            <div>
                <img ref={imageRef}/>
                image
            </div>

            }
        </div>
    )
}