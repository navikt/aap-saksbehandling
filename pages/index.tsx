import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from 'styles/Home.module.css'
import SaksoversiktPage from "./saksoversiktpage/SaksoversiktPage";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Kelvin</title>
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <SaksoversiktPage />
      </main>
    </>
  )
}
