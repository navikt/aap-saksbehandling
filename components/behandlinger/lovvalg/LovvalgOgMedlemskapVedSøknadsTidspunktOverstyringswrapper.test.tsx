import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper } from 'components/behandlinger/lovvalg/LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringswrapper';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { customRender } from 'lib/test/CustomRender';

const automatiskLovvalgOgMedlemskapVurdering: AutomatiskLovvalgOgMedlemskapVurdering = {
  tilhørighetVurdering: [],
  kanBehandlesAutomatisk: true,
};

describe('Lovvalg og medlemskap wrapper', () => {
  it('Skal vise vilkårskortet dersom det finnes en mellomlagring', () => {
    customRender(
      <LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper
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
        behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
      >
        Innhold
      </LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper>
    );

    const vilkårskort = screen.getByRole('heading', {
      name: /overstyring av lovvalg og medlemskap ved søknadstidspunkt/i,
    });

    expect(vilkårskort).toBeVisible();
  });

  it('Skal ikke vise vilkårskortet dersom det ikke finnes en mellomlagring', () => {
    customRender(
      <LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper
        behandlingsReferanse={'123'}
        behandlingVersjon={1}
        readOnly={false}
        automatiskVurdering={automatiskLovvalgOgMedlemskapVurdering}
        harAvklaringsbehov={false}
        behovstype={Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP}
      >
        Innhold
      </LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper>
    );

    const vilkårskort = screen.queryByRole('heading', {
      name: /overstyring av lovvalg og medlemskap ved søknadstidspunkt/i,
    });

    expect(vilkårskort).not.toBeInTheDocument();
  });
});
