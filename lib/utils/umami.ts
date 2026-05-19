import { RefObject, useEffect, useRef } from 'react';

type UmamiValue = string | number | boolean | null | undefined;
type UmamiData = Record<string, UmamiValue>;

export const loggUmamiEvent = (eventName: string, data: UmamiData) => {
  if (typeof window === 'undefined') return;

  try {
    window.umami?.track(eventName, data);
  } catch (error) {
    console.error(`Umami Failed to track event ${eventName}:`, error);
  }
};

export const loggUmamiVarighetHendelser = (
  hendelser: UmamiVarighetHendelse[],
  hendelseSerie: UmamiHendelserSerie | null
) => {
  if (typeof window === 'undefined') return;
  if (!hendelseSerie) return;

  try {
    hendelser.forEach((hendelse) =>
      window.umami?.track(hendelseSerie.hendelse_serie, {
        hendelser_serie_id: hendelseSerie.hendelse_serie_id,
        hendelser_serie: hendelseSerie.hendelse_serie,
        hendelser: hendelse.hendelse,
        varighet_sekunder: hendelse.varighet_sekunder,
        tidsstempel: hendelse.tidsstempel,
      })
    );
  } catch (error) {
    console.error(`Umami Failed to track list of events:`, error);
  }
};

export function useUmamiStartTidspunkt(): number {
  const umamiStartTidspunkt = useRef<number | null>(null);

  useEffect(() => {
    umamiStartTidspunkt.current = Date.now();
  }, []);

  return umamiStartTidspunkt.current ?? 0;
}
export interface UmamiHendelserSerie {
  hendelse_serie: string;
  hendelse_serie_id: string;
}
export interface UmamiVarighetHendelse {
  hendelse: string;
  varighet_sekunder: number;
  varighet_sekunder_siden_forrige: number | null;
  tidsstempel: number;
}

export function useUmamiVarighetHendelser(hendelseSerieNavn: string): {
  varighetHendelseRef: RefObject<UmamiVarighetHendelse[]>;
  addHendelse: (hendelse: string, tidsstempel: number) => void;
  hendelseSerieRef: RefObject<UmamiHendelserSerie | null>;
} {
  const hendelseSerie = useRef<UmamiHendelserSerie | null>(null);
  const umamiStartTidspunkt = useRef<number | null>(null);
  const varighetHendelser = useRef<UmamiVarighetHendelse[]>([]);

  useEffect(() => {
    umamiStartTidspunkt.current = Date.now();
    hendelseSerie.current = {
      hendelse_serie: hendelseSerieNavn,
      hendelse_serie_id: window.crypto.randomUUID(),
    };
  }, [hendelseSerieNavn]);

  function addHendelse(hendelse: string, tidsstempel: number) {
    if (umamiStartTidspunkt.current) {
      const forrigeTidsstempel = varighetHendelser.current.at(-1)?.tidsstempel;
      varighetHendelser.current = [
        ...varighetHendelser.current,
        {
          hendelse,
          varighet_sekunder: Math.floor((tidsstempel - umamiStartTidspunkt.current) / 1000),
          varighet_sekunder_siden_forrige: forrigeTidsstempel
            ? Math.floor((tidsstempel - forrigeTidsstempel) / 1000)
            : null,
          tidsstempel,
        },
      ];
    }
  }

  return { varighetHendelseRef: varighetHendelser, addHendelse, hendelseSerieRef: hendelseSerie };
}

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data: UmamiData) => void;
    };
  }
}
