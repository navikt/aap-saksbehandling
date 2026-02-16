import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { AutomatiskLovvalgOgMedlemskapVurdering, PeriodisertForutgåendeMedlemskapGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { customRender } from 'lib/test/CustomRender';
import { PeriodisertForutgåendemedlemskapOverstyringswrapper } from 'components/behandlinger/forutgåendemedlemskap/PeriodisertForutgåendemedlemskapOverstyringswrapper';

const automatiskLovvalgOgMedlemskapVurdering: AutomatiskLovvalgOgMedlemskapVurdering = {
  tilhørighetVurdering: [],
  kanBehandlesAutomatisk: true,
};

const tomtGrunnlag: PeriodisertForutgåendeMedlemskapGrunnlag = {
  ikkeRelevantePerioder: [],
  behøverVurderinger: [],
  harTilgangTilÅSaksbehandle: false,
  kanVurderes: [],
  nyeVurderinger: [],
  overstyrt: false,
  sisteVedtatteVurderinger: [],
};

describe('Forutgående medlemskap wrapper', () => {
  it('Skal vise vilkårskortet dersom det finnes en mellomlagring', () => {
    customRender(
      <PeriodisertForutgåendemedlemskapOverstyringswrapper
        grunnlag={tomtGrunnlag}
        behandlingsReferanse={'123'}
        behandlingVersjon={1}
        readOnly={false}
        automatiskVurdering={automatiskLovvalgOgMedlemskapVurdering}
        harAvklaringsbehov={false}
        initialMellomlagretVurdering={{
          data: '{"lovvalgBegrunnelse":"Dette er min vurdering som er mellomlagret"}',
          vurdertAv: 'Ane Rikke',
          vurdertDato: '2025-08-08',
          avklaringsbehovkode: Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP,
          behandlingId: { id: 1 },
        }}
        visOverstyrKnapp={true}
        harYrkesskade={true}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
      >
        Innhold
      </PeriodisertForutgåendemedlemskapOverstyringswrapper>
    );

    const vilkårskort = screen.getByRole('heading', {
      name: 'Overstyring av § 11-2 Forutgående medlemskap',
    });

    expect(vilkårskort).toBeVisible();
  });

  it('Skal ikke vise vilkårskortet dersom det ikke finnes en mellomlagring', () => {
    customRender(
      <PeriodisertForutgåendemedlemskapOverstyringswrapper
        grunnlag={tomtGrunnlag}
        behandlingsReferanse={'123'}
        behandlingVersjon={1}
        readOnly={false}
        automatiskVurdering={automatiskLovvalgOgMedlemskapVurdering}
        harAvklaringsbehov={false}
        visOverstyrKnapp={true}
        harYrkesskade={true}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
      >
        Innhold
      </PeriodisertForutgåendemedlemskapOverstyringswrapper>
    );

    const vilkårskort = screen.queryByRole('heading', {
      name: 'Overstyring av § 11-2 Forutgående medlemskap',
    });

    expect(vilkårskort).not.toBeInTheDocument();
  });
});
