import { describe, expect, it } from 'vitest';
import type { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { utledVurderingStatus } from 'components/behandlinger/sykdom/sykdomsvurdering/sykdomsvurdering-utils';
import { VurderingStatus } from 'components/periodisering/VurderingStatusTag';
import { JaEllerNei } from 'lib/utils/form';

const vurdering: Sykdomsvurdering = {
  fraDato: '10.11.2026',
  begrunnelse: 'Vurdering av arbeidsevnen',
  harSkadeSykdomEllerLyte: JaEllerNei.Ja,
  harNedsattArbeidsevne: 'JA',
  erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Ja,
  erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Ja,
  erNyVurdering: true,
  behøverVurdering: true,
};

describe('utledVurderingStatus', () => {
  it.each([JaEllerNei.Ja, JaEllerNei.Nei])(
    'ignorerer tidligere svar %s på 30 prosent når minst halvparten er oppfylt',
    (svar) => {
      expect(
        utledVurderingStatus({ ...vurdering, erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: svar }, true, false)
      ).toBe(VurderingStatus.Oppfylt);
    }
  );

  it.each([
    [JaEllerNei.Ja, VurderingStatus.OppfyltVedÅrsakssammenheng],
    [JaEllerNei.Nei, VurderingStatus.IkkeOppfylt],
  ])('bruker svaret %s på 30 prosent når minst halvparten ikke er oppfylt', (svar, status) => {
    expect(
      utledVurderingStatus(
        {
          ...vurdering,
          erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Nei,
          erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: svar,
        },
        true,
        false
      )
    ).toBe(status);
  });

  it('bruker 30-prosentsvaret ved fastslått årsakssammenheng selv med et gammelt ja på minst halvparten', () => {
    expect(
      utledVurderingStatus(
        { ...vurdering, erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Nei },
        true,
        true
      )
    ).toBe(VurderingStatus.IkkeOppfylt);
  });
});
