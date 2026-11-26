import { clientLoggUmamiEvent } from 'lib/utils/umami/client';

export interface UmamiSykdomsvurderingEvent {
  name: 'SYKDOMSVURDERING_INKLUDERER_MAL';
  data: {
    antallSpoersmaalFraMal: number;
  };
}

export function loggUmamiSykdomsvurderingAntallSpørsmålFraMal(begrunnelse: string, spørsmålIMal: string[]) {
  const antallSpørsmålFraMal = spørsmålIMal.filter((spørsmål) => begrunnelse.includes(spørsmål)).length;

  clientLoggUmamiEvent('SYKDOMSVURDERING_INKLUDERER_MAL', {
    antallSpoersmaalFraMal: antallSpørsmålFraMal,
  });
}
