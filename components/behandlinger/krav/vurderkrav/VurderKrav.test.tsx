import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { KravGrunnlag, MellomlagretVurderingResponse, RelevantKrav, SøknadUtenKrav } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { VurderKrav } from 'components/behandlinger/krav/vurderkrav/VurderKrav';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'KRAV' });
});

function relevantKrav(overrides: Partial<RelevantKrav> = {}): RelevantKrav {
  return {
    type: 'RELEVANT_KRAV',
    referanse: 'krav-1',
    journalpostId: { identifikator: 'jp-1' },
    begrunnelse: 'Opprinnelig begrunnelse',
    opprettet: '2025-04-01T10:30:00Z',
    muligRettFra: '2025-04-15',
    søknadsdato: { dato: '2025-04-01', årsak: 'SøknadMottatt' },
    vurdertAv: 'Z000000',
    vurdertIBehandling: { id: 1 },
    ...overrides,
  };
}

function søknadUtenKrav(overrides: Partial<SøknadUtenKrav> = {}): SøknadUtenKrav {
  return {
    journalpostId: { identifikator: 'jp-ny' },
    mottattTidspunkt: '2025-05-10T09:00:00',
    ...overrides,
  };
}

function grunnlag(overrides: Partial<KravGrunnlag> = {}): KravGrunnlag {
  return {
    harTilgangTilÅSaksbehandle: true,
    nyeVurderinger: [],
    vedtatteVurderinger: [],
    søknader: [],
    søknaderUtenKravvurdering: [],
    ...overrides,
  };
}

describe('VurderKrav - visning av søknader uten kravvurdering', () => {
  it('viser en søknad uten kravvurdering automatisk som en åpen KravBoks med "Må vurderes"-tag', () => {
    const grunnlagMedSøknad = grunnlag({ søknaderUtenKravvurdering: [søknadUtenKrav()] });

    render(<VurderKrav grunnlag={grunnlagMedSøknad} behandlingVersjon={0} readOnly={false} />);

    expect(screen.getByText('Ny søknad jp-ny')).toBeVisible();
    expect(screen.getAllByText('Må vurderes').length).toBeGreaterThan(0);
    // Begrunnelsesfeltet er alltid synlig når boksen er åpen, ikke bak en "Vurder"-knapp.
    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toBeVisible();
  });

  it('viser ikke noen KravBoks når det ikke finnes søknader uten kravvurdering eller valgte krav', () => {
    render(<VurderKrav grunnlag={grunnlag()} behandlingVersjon={0} readOnly={false} />);

    expect(screen.queryByRole('textbox', { name: 'Begrunnelse' })).not.toBeInTheDocument();
  });
});

describe('VurderKrav - åpne og lukke krav fra tabellen', () => {
  it('åpner en KravBoks for et eksisterende krav når "Endre" klikkes i tabellen', async () => {
    const krav = relevantKrav();
    render(<VurderKrav grunnlag={grunnlag({ nyeVurderinger: [krav] })} behandlingVersjon={0} readOnly={false} />);

    expect(screen.queryByText('Vurder krav krav-1')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Endre' }));

    expect(screen.getByText('Vurder krav krav-1')).toBeVisible();
  });

  it('lukker og nullstiller en KravBoks når "Lukk" klikkes i tabellen etter redigering', async () => {
    const krav = relevantKrav();
    render(<VurderKrav grunnlag={grunnlag({ nyeVurderinger: [krav] })} behandlingVersjon={0} readOnly={false} />);

    await user.click(screen.getByRole('button', { name: 'Endre' }));
    await user.click(
      screen.getByRole('button', {
        name: /vurder om krav er relevant/i,
      })
    );

    await user.type(screen.getByRole('textbox', { name: 'Vurdering' }), ' med endring');
    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toHaveValue('Opprinnelig begrunnelse med endring');

    const kravRad = screen.getByRole('row', { name: /jp-1/ });
    await user.click(within(kravRad).getByRole('button', { name: 'Lukk' }));

    expect(screen.queryByText('Vurder krav krav-1')).not.toBeInTheDocument();

    // Åpner igjen for å bekrefte at begrunnelsen faktisk ble nullstilt, ikke bare skjult.
    await user.click(screen.getByRole('button', { name: 'Endre' }));
    await user.click(
      screen.getByRole('button', {
        name: /vurder om krav er relevant/i,
      })
    );
    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toHaveValue('Opprinnelig begrunnelse');
  });

  it('kan ikke lukkes eller fjernes fra tabellen for en søknad uten kravvurdering, siden den må vurderes', () => {
    render(
      <VurderKrav
        grunnlag={grunnlag({ søknaderUtenKravvurdering: [søknadUtenKrav()] })}
        behandlingVersjon={0}
        readOnly={false}
      />
    );

    expect(screen.getByText('Ny søknad jp-ny')).toBeVisible();

    const søknadRad = screen.getByRole('row', { name: /jp-ny/ });
    expect(within(søknadRad).queryByRole('button', { name: 'Lukk' })).not.toBeInTheDocument();
    expect(within(søknadRad).queryByRole('button', { name: 'Vurder' })).not.toBeInTheDocument();
    expect(screen.getByText('Ny søknad jp-ny')).toBeVisible();
  });
});

describe('VurderKrav - handleSubmit', () => {
  let capturedRequest: {
    behov: {
      kravVurderinger: Array<{ referanse?: string; journalpostId: { identifikator: string }; begrunnelse: string }>;
    };
  } | null = null;

  beforeEach(() => {
    capturedRequest = null;

    vi.stubGlobal(
      'EventSource',
      vi.fn().mockImplementation(function () {
        return {
          close: vi.fn(),
          addEventListener: vi.fn(),
          onmessage: null,
          onerror: null,
        };
      })
    );

    fetchMock.mockResponse(async (req) => {
      if (req.method === 'POST') {
        try {
          const text = await req.text();
          const body = JSON.parse(text);
          if (body?.behov?.behovstype === Behovstype.VURDER_KRAV_KODE) {
            capturedRequest = body;
          }
        } catch {
          // ignore
        }
      }
      return JSON.stringify({ type: 'SUCCESS', status: 200, data: {} });
    });
  });

  it('sender kun endrede eksisterende krav og utfylte nye søknad-utkast, med riktig referanse-håndtering', async () => {
    const kravUendret = relevantKrav({ referanse: 'krav-uendret', begrunnelse: 'Blir stående uendret' });
    const kravEndret = relevantKrav({
      referanse: 'krav-endret',
      journalpostId: { identifikator: 'jp-endret' },
      begrunnelse: 'Skal endres',
    });
    const vedtattKravEndret = relevantKrav({
      referanse: 'krav-vedtatt-endret',
      journalpostId: { identifikator: 'jp-vedtatt' },
      begrunnelse: 'Vedtatt, men skal endres',
    });
    const søknad = søknadUtenKrav({ journalpostId: { identifikator: 'jp-ny' } });

    render(
      <VurderKrav
        grunnlag={grunnlag({
          nyeVurderinger: [kravUendret, kravEndret],
          vedtatteVurderinger: [vedtattKravEndret],
          søknaderUtenKravvurdering: [søknad],
        })}
        behandlingVersjon={0}
        readOnly={false}
      />
    );

    // Rediger krav-endret (nyeVurderinger)
    const kravEndretRad = within(screen.getByRole('row', { name: /jp-endret/ }));
    await user.click(kravEndretRad.getByRole('button', { name: 'Endre' }));
    await user.click(
      screen.getAllByRole('button', {
        name: /vurder om krav er relevant/i,
      })[0]
    );
    const kravEndretBegrunnelse = screen.getAllByRole('textbox', { name: 'Vurdering' })[1];
    await user.type(kravEndretBegrunnelse, ' - oppdatert');

    // Rediger krav-vedtatt-endret (vedtatteVurderinger)
    const vedtattRad = within(screen.getByRole('row', { name: /jp-vedtatt/ }));
    await user.click(vedtattRad.getByRole('button', { name: 'Endre' }));
    await user.click(
      screen.getAllByRole('button', {
        name: /vurder om krav er relevant/i,
      })[1]
    );
    const vedtattBegrunnelse = screen.getAllByRole('textbox', { name: 'Vurdering' })[2];
    await user.type(vedtattBegrunnelse, ' - overstyrt');

    // Fyll ut begrunnelse for det nye søknad-utkastet (auto-åpnet)
    const søknadBegrunnelse = screen.getAllByRole('textbox', { name: 'Vurdering' })[0];
    await user.type(søknadBegrunnelse, 'Nytt krav opprettet av saksbehandler');
    await user.click(screen.getAllByRole('radio', { name: 'Ja' })[0]);

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(capturedRequest).not.toBeNull();
    const kravVurderinger = capturedRequest!.behov.kravVurderinger;

    expect(kravVurderinger).toHaveLength(3);
    expect(kravVurderinger.some((v) => v.journalpostId.identifikator === 'jp-1')).toBe(false);

    const nyttKrav = kravVurderinger.find((v) => v.journalpostId.identifikator === 'jp-endret');
    expect(nyttKrav?.referanse).toEqual('krav-endret');
    expect(nyttKrav?.begrunnelse).toEqual('Skal endres - oppdatert');

    const overstyrtVedtatt = kravVurderinger.find((v) => v.journalpostId.identifikator === 'jp-vedtatt');
    expect(overstyrtVedtatt?.referanse).toEqual('krav-vedtatt-endret');

    const nySøknad = kravVurderinger.find((v) => v.journalpostId.identifikator === 'jp-ny');
    expect(nySøknad?.referanse).toBeUndefined();
    expect(nySøknad?.begrunnelse).toEqual('Nytt krav opprettet av saksbehandler');
  });
});

describe('VurderKrav - mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.VURDER_KRAV_KODE,
      behandlingId: { id: 1 },
      data: JSON.stringify({
        valgteKrav: ['krav-1'],
        vurderinger: { 'krav-1': { ...relevantKrav(), kravtype: 'RELEVANT_KRAV', begrunnelse: 'Mellomlagret tekst' } },
      }),
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('gjenoppretter valgteKrav/vurderinger fra mellomlagring, slik at boksen vises åpen med mellomlagret begrunnelse', async () => {
    const krav = relevantKrav();

    render(
      <VurderKrav
        grunnlag={grunnlag({ nyeVurderinger: [krav] })}
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    expect(screen.getByText('Vurder krav krav-1')).toBeVisible();
    await user.click(
      screen.getByRole('button', {
        name: /vurder om krav er relevant/i,
      })
    );
    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toHaveValue('Mellomlagret tekst');
  });
});
