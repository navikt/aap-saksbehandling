import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from 'styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        Dette er den nye kommende applikasjonen for aap saksbehandling
      </main>
    </>
  )
}
