import { clientLoggUmamiEvent } from 'lib/utils/umami/client';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

const UMAMI_HENDELSER_SERIE_KONTEKST = ['LOVVALG_MEDLEMSKAP', 'BESLUTTER', 'KVALITETSSIKRER'] as const;
type UmamiHendelserSerieKontekst = (typeof UMAMI_HENDELSER_SERIE_KONTEKST)[number];

/** `<KONTEKST>_HENDELSER_VARIGHET` — navnet på en serie tidsmålte delhendelser. */
type UmamiHendelserSerieNavn = `${UmamiHendelserSerieKontekst}_HENDELSER_VARIGHET`;

/**
 * Feltidentifikatorer for delhendelser i `LOVVALG_MEDLEMSKAP_HENDELSER_VARIGHET`. Konteksten
 * (LOVVALG_MEDLEMSKAP) er allerede gitt av hendelsens `name`, så den gjentas ikke her.
 */
export type LovvalgMedlemskapFelt =
  | 'FRA_DATO'
  | 'LOVVALG_BEGRUNNELSE'
  | 'LOVVALGSLAND_EØS'
  | 'LOVVALGSLAND_ANNET'
  | 'MEDLEMSKAP_BEGRUNNELSE'
  | 'MEDLEMSKAP_I_FOLKETRYGDEN';

/**
 * Dynamisk sammensatt feltidentifikator for delhendelser i `BESLUTTER_HENDELSER_VARIGHET`/
 * `KVALITETSSIKRER_HENDELSER_VARIGHET`. Rollen (beslutter/kvalitetssikrer) er allerede gitt av
 * hendelsens `name`.
 */
type BeslutterFeltHandling = 'LINK' | 'GODKJENT' | 'RETUR_BEGRUNNELSE' | 'RETUR_GRUNNER';
export type BeslutterFeltTag = `${string}_${BeslutterFeltHandling}`;

export interface UmamiHendelserVarighetEvent {
  type: 'HENDELSER_VARIGHET';
  name: UmamiHendelserSerieNavn;
  hendelser_serie: string;
  hendelser_serie_id: string;
  /** Hvilken delhendelse i serien dette er, f.eks. et feltnavn eller en handling. */
  delhendelse: string;
  varighet_sekunder: number;
  varighet_sekunder_siden_forrige: number | null;
  tidsstempel: number;
}

interface UmamiHendelserSerie {
  hendelse_serie: UmamiHendelserSerieNavn;
  hendelse_serie_id: string;
}

interface UmamiVarighetHendelse<THendelse extends string> {
  delhendelse: THendelse;
  varighet_sekunder: number;
  varighet_sekunder_siden_forrige: number | null;
  tidsstempel: number;
}

export function loggUmamiVarighetHendelser<THendelse extends string>(
  hendelser: UmamiVarighetHendelse<THendelse>[],
  hendelseSerie: UmamiHendelserSerie | null
) {
  if (typeof window === 'undefined') return;
  if (!hendelseSerie) return;

  hendelser.forEach((hendelse) =>
    clientLoggUmamiEvent({
      type: 'HENDELSER_VARIGHET',
      name: hendelseSerie.hendelse_serie,
      hendelser_serie_id: hendelseSerie.hendelse_serie_id,
      hendelser_serie: hendelseSerie.hendelse_serie,
      delhendelse: hendelse.delhendelse,
      varighet_sekunder: hendelse.varighet_sekunder,
      varighet_sekunder_siden_forrige: hendelse.varighet_sekunder_siden_forrige,
      tidsstempel: hendelse.tidsstempel,
    })
  );
}

export function useUmamiVarighetHendelser<THendelse extends string>(
  hendelseSerieNavn: UmamiHendelserSerieNavn
): {
  varighetHendelseRef: RefObject<UmamiVarighetHendelse<THendelse>[]>;
  addHendelse: (delhendelse: THendelse, tidsstempel: number) => void;
  hendelseSerieRef: RefObject<UmamiHendelserSerie | null>;
} {
  const hendelseSerie = useRef<UmamiHendelserSerie | null>(null);
  const umamiStartTidspunkt = useRef<number | null>(null);
  const varighetHendelser = useRef<UmamiVarighetHendelse<THendelse>[]>([]);

  useEffect(() => {
    umamiStartTidspunkt.current = Date.now();
    hendelseSerie.current = {
      hendelse_serie: hendelseSerieNavn,
      hendelse_serie_id: window.crypto.randomUUID(),
    };
  }, [hendelseSerieNavn]);

  function addHendelse(delhendelse: THendelse, tidsstempel: number) {
    if (umamiStartTidspunkt.current) {
      const forrigeTidsstempel = varighetHendelser.current.at(-1)?.tidsstempel;
      varighetHendelser.current = [
        ...varighetHendelser.current,
        {
          delhendelse,
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
