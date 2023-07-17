import Head from 'next/head'
import { Inter } from 'next/font/google'
import SaksoversiktPage from "./saksoversiktpage/SaksoversiktPage";
import {Link} from "@navikt/ds-react";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Kelvin</title>
      </Head>
      <main>
          <Link href={'/saksoversiktpage/SaksoversiktPage'} >Go to SAKSOVERSIKT</Link>
      </main>
    </>
  )
}
