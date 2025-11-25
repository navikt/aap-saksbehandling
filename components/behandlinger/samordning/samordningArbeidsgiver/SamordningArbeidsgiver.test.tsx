import createFetchMock from 'vitest-fetch-mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MellomlagretVurderingResponse, SamordningArbeidsgiverGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { render, screen } from 'lib/test/CustomRender';
import { FetchResponse } from 'lib/utils/api';
import { SamordningArbeidsgiver } from 'components/behandlinger/samordning/samordningArbeidsgiver/SamordningArbeidsgiver';
import userEvent from '@testing-library/user-event';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagMedVurdering: SamordningArbeidsgiverGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  vurdering: {
    begrunnelse: 'Dette er min vurdering som er bekreftet',
    perioder: [{ tom: '2025-10-10', fom: '2025-11-11' }],
  },
};
const grunnlagUtenVurdering: SamordningArbeidsgiverGrunnlag = { harTilgangTilÅSaksbehandle: true };

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'SAMORDNING_ARBEIDSGIVER' });
});

it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_BISTANDSBEHOV' });

  render(<SamordningArbeidsgiver grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />);

  const endreKnapp = screen.getByRole('button', { name: 'Endre' });
  await user.click(endreKnapp);

  const begrunnelseFelt = screen.getByRole('textbox', {
    name: 'Vurder om brukeren skal ha 100% reduksjon av AAP i en periode som følge av ytelse fra arbeidsgiver',
  });
  await user.clear(begrunnelseFelt);
  await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
  expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

  const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
  await user.click(avbrytKnapp);

  const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', {
    name: 'Vurder om brukeren skal ha 100% reduksjon av AAP i en periode som følge av ytelse fra arbeidsgiver',
  });
  expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er min vurdering som er bekreftet');
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.AVKLAR_SAMORDNING_ANDRE_STATLIGE_YTELSER,
      behandlingId: { id: 1 },
      data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <SamordningArbeidsgiver
        grunnlag={grunnlagUtenVurdering}
        readOnly={false}
        behandlingVersjon={0}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(<SamordningArbeidsgiver grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />);

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren skal ha 100% reduksjon av AAP i en periode som følge av ytelse fra arbeidsgiver',
      }),
      'Her har jeg begynt å skrive en vurdering..'
    );
    expect(screen.queryByText('Utkast lagret 21.08.2025 00:00 (Jan T. Loven)')).not.toBeInTheDocument();

    const mockFetchResponseLagreMellomlagring: FetchResponse<MellomlagretVurderingResponse> = {
      type: 'SUCCESS',
      data: mellomlagring,
      status: 200,
    };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseLagreMellomlagring));

    const lagreKnapp = screen.getByRole('button', { name: 'Lagre utkast' });
    await user.click(lagreKnapp);
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <SamordningArbeidsgiver
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    expect(screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)')).toBeVisible();

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    await user.click(slettKnapp);

    expect(screen.queryByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)')).not.toBeInTheDocument();
  });

  it('Skal bruke mellomlagring som defaultValue i skjema dersom det finnes', () => {
    render(
      <SamordningArbeidsgiver
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder om brukeren skal ha 100% reduksjon av AAP i en periode som følge av ytelse fra arbeidsgiver',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<SamordningArbeidsgiver behandlingVersjon={0} readOnly={false} grunnlag={grunnlagMedVurdering} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder om brukeren skal ha 100% reduksjon av AAP i en periode som følge av ytelse fra arbeidsgiver',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <SamordningArbeidsgiver
        behandlingVersjon={0}
        readOnly={true}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});
