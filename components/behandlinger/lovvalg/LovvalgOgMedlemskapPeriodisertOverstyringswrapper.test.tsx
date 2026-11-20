import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { DelvurderingForKrav, PeriodisertLovvalgMedlemskapGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { customRender } from 'lib/test/CustomRender';
import { LovvalgOgMedlemskapPeriodisertOverstyringswrapper } from 'components/behandlinger/lovvalg/LovvalgOgMedlemskapPeriodisertOverstyringswrapper';

const delvurderinger: DelvurderingForKrav[] = [
  { relevantDato: '2025-01-01', delvurdering: { tilhørighetVurdering: [], kanBehandlesAutomatisk: true } },
];
const tomtGrunnlag: PeriodisertLovvalgMedlemskapGrunnlag = {
  ikkeRelevantePerioder: [],
  behøverVurderinger: [],
  delvurderinger,
  harTilgangTilÅSaksbehandle: false,
  kanVurderes: [],
  nyeVurderinger: [],
  overstyrt: false,
  sisteVedtatteVurderinger: [],
};

describe('Lovvalg og medlemskap wrapper', () => {
  it('Skal vise vilkårskortet dersom det finnes en mellomlagring', () => {
    customRender(
      <LovvalgOgMedlemskapPeriodisertOverstyringswrapper
        grunnlag={tomtGrunnlag}
        behandlingsreferanse={'123'}
        behandlingVersjon={1}
        readOnly={false}
        delvurderinger={delvurderinger}
        harAvklaringsbehov={false}
        initialMellomlagretVurdering={{
          data: '{"lovvalgBegrunnelse":"Dette er min vurdering som er mellomlagret"}',
          vurdertAv: 'Ane Rikke',
          vurdertDato: '2025-08-08',
          avklaringsbehovkode: Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP,
          behandlingId: { id: 1 },
        }}
        behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
      >
        Innhold
      </LovvalgOgMedlemskapPeriodisertOverstyringswrapper>
    );

    const vilkårskort = screen.getByRole('heading', {
      name: /overstyring av lovvalg og medlemskap/i,
    });

    expect(vilkårskort).toBeVisible();
  });

  it('Skal ikke vise vilkårskortet dersom det ikke finnes en mellomlagring', () => {
    customRender(
      <LovvalgOgMedlemskapPeriodisertOverstyringswrapper
        grunnlag={tomtGrunnlag}
        behandlingsreferanse={'123'}
        behandlingVersjon={1}
        readOnly={false}
        delvurderinger={delvurderinger}
        harAvklaringsbehov={false}
        behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
      >
        Innhold
      </LovvalgOgMedlemskapPeriodisertOverstyringswrapper>
    );

    const vilkårskort = screen.queryByRole('heading', {
      name: /overstyring av lovvalg og medlemskap/i,
    });

    expect(vilkårskort).not.toBeInTheDocument();
  });
});
