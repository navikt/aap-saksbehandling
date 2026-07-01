import { RefObject, useEffect, useRef } from 'react';
import { UmamiTag } from 'components/umami/Umami';
import { BrevGrunnlagBrev, UmamiKelvinEvent } from 'lib/types/types';

type UmamiValue = string | number | boolean | null | undefined;
type UmamiData = Record<string, UmamiValue>;

async function clientLoggUmamiEvent(data: UmamiKelvinEvent) {
  if (typeof window === 'undefined') return;

  try {
    await fetch('/api/umami', { method: 'POST', body: JSON.stringify(data) });
  } catch (error) {
    console.error(`Umami Failed to track event ${data.name}:`, error);
  }
}
export function loggUmamiBrevVarighet(
  hendelse: UmamiTag,
  start: number,
  stop: number,
  brevtype: BrevGrunnlagBrev['brevtype']
) {
  clientLoggUmamiEvent({
    name: hendelse,
    varighet_sekunder: Math.floor((stop - start) / 1000),
    brevtype,
    hendelser_serie: null,
    hendelser_serie_id: null,
    tidsstempel: null,
    varighet_sekunder_siden_forrige: null,
  });
}

export function loggUmamiVarighet(hendelse: UmamiTag, start: number, stop: number) {
  clientLoggUmamiEvent({
    name: hendelse,
    varighet_sekunder: Math.floor((stop - start) / 1000),
    hendelser_serie: null,
    hendelser_serie_id: null,
    tidsstempel: null,
    varighet_sekunder_siden_forrige: null,
    brevtype: null,
  });
}

export function loggUmamiVarighetHendelser(
  hendelser: UmamiVarighetHendelse[],
  hendelseSerie: UmamiHendelserSerie | null
) {
  if (typeof window === 'undefined') return;
  if (!hendelseSerie) return;

  hendelser.forEach((hendelse) =>
    clientLoggUmamiEvent({
      name: hendelseSerie.hendelse_serie,
      hendelser_serie_id: hendelseSerie.hendelse_serie_id,
      hendelser_serie: hendelseSerie.hendelse_serie,
      hendelse: hendelse.hendelse,
      varighet_sekunder: hendelse.varighet_sekunder,
      varighet_sekunder_siden_forrige: hendelse.varighet_sekunder_siden_forrige,
      tidsstempel: hendelse.tidsstempel,
      brevtype: null,
    })
  );
}

export function useUmamiStartTidspunkt(visningsModus: string): number {
  const umamiStartTidspunkt = useRef<number | null>(null);

  useEffect(() => {
    umamiStartTidspunkt.current = Date.now();
  }, [visningsModus]);

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
  addHendelse: (hendelse: UmamiTag, tidsstempel: number) => void;
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
