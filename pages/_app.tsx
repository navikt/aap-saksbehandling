import 'styles/globals.css'
import type { AppProps } from 'next/app'
import {useEffect} from "react";
import { initializeFaro } from '@grafana/faro-web-sdk';
import { SUPPORTED_LOCALE } from 'lib/translations/locales';
import {useRouter} from "next/router";
import {IntlProvider} from "react-intl";
import {DecoratorLocale} from "@navikt/nav-dekoratoren-moduler";
import messagesNb from 'lib/translations/nb.json';
import messagesNn from 'lib/translations/nn.json';

function flattenMessages(nestedMessages: object, prefix = ''): Record<string, string> {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    // @ts-ignore
    let value = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      // @ts-ignore
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}
const getLocaleOrFallback = (locale?: string) => {
  if (locale && SUPPORTED_LOCALE.includes(locale)) {
    return locale;
  }

  return 'nb';
};

type Messages = {
  [K in DecoratorLocale]?: { [name: string]: string };
};

export const messages: Messages = {
  nb: flattenMessages(messagesNb),
  nn: flattenMessages(messagesNn),
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = getLocaleOrFallback(router.locale);

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
          <IntlProvider locale={locale} messages={messages[locale]}>
            <Component {...pageProps} />
          </IntlProvider>
        </>
  );
}

export default MyApp;