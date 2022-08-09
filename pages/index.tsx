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
          screenfulls={5}
          width={1080} 
          height={1080}
          frameCount={246}
        />
        </section>

    <section className='mt-32 mx-auto max-w-lg mb-32'>
        <h2 className=' text-7xl font-bold'>Animation done</h2>
        <p>Content continues here</p>
      </section>
    </div>
  )
}

export default Home
