import "@navikt/ds-css"
import '../styles/globals.css';

import type { AppProps } from 'next/app'
import { useEffect, useMemo } from "react";
import { initializeFaro } from '@grafana/faro-web-sdk';
import { useRouter } from "next/router";
import { logger } from "@navikt/aap-felles-utils"
import { AppHeader } from "../components/appheader/AppHeader";


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(()=>{
    logger.info("page init")
    console.log("page init")
  },[])

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FARO_URL) {
      initializeFaro({
        url: process.env.NEXT_PUBLIC_FARO_URL,
        app: {
          name: 'aap-mine-aap',
          version: process.env.NEXT_PUBLIC_ENVIRONMENT ?? '',
        },
      });
    }
  }, []);

  return (
      <>
        {/* @ts-ignore */}
        <AppHeader />
            <Component {...pageProps} />
      </>
  );
}

export default MyApp;