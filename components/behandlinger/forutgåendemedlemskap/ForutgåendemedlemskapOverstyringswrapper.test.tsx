import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { AutomatiskLovvalgOgMedlemskapVurdering } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { customRender } from 'lib/test/CustomRender';
import { ForutgåendemedlemskapOverstyringswrapper } from 'components/behandlinger/forutgåendemedlemskap/ForutgåendemedlemskapOverstyringswrapper';

const automatiskLovvalgOgMedlemskapVurdering: AutomatiskLovvalgOgMedlemskapVurdering = {
  tilhørighetVurdering: [],
  kanBehandlesAutomatisk: true,
};

describe('Lovvalg og medlemskap wrapper', () => {
  it('Skal vise vilkårskortet dersom det finnes en mellomlagring', () => {
    customRender(
      <ForutgåendemedlemskapOverstyringswrapper
        behandlingsReferanse={'123'}
        behandlingVersjon={1}
        readOnly={false}
        automatiskVurdering={automatiskLovvalgOgMedlemskapVurdering}
        stegSomSkalVises={[]}
        initialMellomlagretVurdering={{
          data: '{"lovvalgBegrunnelse":"Dette er min vurdering som er mellomlagret"}',
          vurdertAv: 'Ane Rikke',
          vurdertDato: '2025-08-08',
          avklaringsbehovkode: Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP,
          behandlingId: { id: 1 },
        }}
        visOverstyrKnapp={true}
        harYrkesskade={true}
      >
        Innhold
      </ForutgåendemedlemskapOverstyringswrapper>
    );

    const vilkårskort = screen.getByRole('heading', {
      name: 'Overstyring av § 11-2 Forutgående medlemskap',
    });

    expect(vilkårskort).toBeVisible();
  });

  it('Skal ikke vise vilkårskortet dersom det ikke finnes en mellomlagring', () => {
    customRender(
      <ForutgåendemedlemskapOverstyringswrapper
        behandlingsReferanse={'123'}
        behandlingVersjon={1}
        readOnly={false}
        automatiskVurdering={automatiskLovvalgOgMedlemskapVurdering}
        stegSomSkalVises={[]}
        visOverstyrKnapp={true}
        harYrkesskade={true}
      >
        Innhold
      </ForutgåendemedlemskapOverstyringswrapper>
    );

    const vilkårskort = screen.queryByRole('heading', {
      name: 'Overstyring av § 11-2 Forutgående medlemskap',
    });

    expect(vilkårskort).not.toBeInTheDocument();
  });
});
