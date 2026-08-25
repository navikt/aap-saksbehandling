import { clientLoggUmamiEvent } from 'lib/utils/umami/client';

export interface UmamiSykdomsvurderingEvent {
  type: 'SYKDOMSVURDERING';
  name: 'SYKDOMSVURDERING_INKLUDERER_MAL';
  antallSpoersmaalFraMal: number;
}

export function loggUmamiSykdomsvurderingAntallSpørsmålFraMal(begrunnelse: string, spørsmålIMal: string[]) {
  const antallSpørsmålFraMal = spørsmålIMal.filter((spørsmål) => begrunnelse.includes(spørsmål)).length;

  clientLoggUmamiEvent({
    type: 'SYKDOMSVURDERING',
    name: 'SYKDOMSVURDERING_INKLUDERER_MAL',
    antallSpoersmaalFraMal: antallSpørsmålFraMal,
  });
}
