import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import ScrollVideo from '../components/ScrollVideo'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Scroll Video Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className='mt-32 mx-auto max-w-lg'>
        <h1 className=' text-7xl font-bold'>
          Scroll video example
        </h1>
        <p>NextJs, Typescript, Tailwind</p>
      </section>

    <section>
        <ScrollVideo
          screenfulls={4}
          imagePrefix="/images/turn-"
          extension="jpg"
          width={2581} 
          height={1080}
          frameCount={365}
        >
          {/* insert children here */}
        </ScrollVideo>
        </section>

    <section className='mt-32 mx-auto max-w-lg mb-32'>
        <h2 className=' text-7xl font-bold'>Animation done</h2>
        <p>Content continues here</p>
      </section>
    </div>
  )
}

export default Home



interface InfoBiteProps extends React.HTMLAttributes<HTMLDivElement> { 
  children: React.ReactNode
  heading:string
  screenHeightsOffset:number 
}

function InfoBite({heading, children, screenHeightsOffset, ...rest} : InfoBiteProps) { 
  return (
    <div 
    className='max-w-xl mx-auto absolute z-20'
    style={{top: `${screenHeightsOffset * 100}vh`}}
    {...rest} 
    >

      <h2 className='text-5xl font-bold'>{heading}</h2>
      {children}
    </div>
  )
}