import { beforeEach, describe, expect, it } from 'vitest';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { DetaljertBehandling, SakPersoninfo, SaksInfo } from 'lib/types/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const personInformasjon: SakPersoninfo = { navn: 'Peder Ås', fnr: '12345678910' };
const user = userEvent.setup();

const sak: SaksInfo = {
  ident: '12345678910',
  behandlinger: [],
  opprettetTidspunkt: '12. mai',
  saksnummer: '12345',
  status: 'OPPRETTET',
  periode: { fom: '12 mai', tom: '27 mai' },
};

describe('Saksinfobanner på sak siden', () => {
  beforeEach(() => {
    render(<SaksinfoBanner personInformasjon={personInformasjon} sak={sak} behandlingVersjon={1} />);
  });

  it('skal vise navn på bruker', () => {
    expect(screen.getByText('Peder Ås')).toBeVisible();
  });

  it('skal vise ident på bruker', () => {
    expect(screen.getByText('12345678910')).toBeVisible();
  });

  it('skal ikke vise saksnummer', () => {
    expect(screen.queryByText('12345')).not.toBeInTheDocument();
  });

  it('skal ikke vise hvilken type behandling', () => {
    expect(screen.queryByText('Førstegangsbehandling')).not.toBeInTheDocument();
  });

  it('skal ikke ha en knapp for å åpne saksmenyen', () => {
    const knapp = screen.queryByRole('button', { name: 'Saksmeny' });
    expect(knapp).not.toBeInTheDocument();
  });
});

const behandling: DetaljertBehandling = {
  aktivtSteg: 'AVKLAR_SYKDOM',
  avklaringsbehov: [],
  opprettet: '',
  referanse: '123',
  skalForberede: false,
  status: 'UTREDES',
  type: 'Førstegangsbehandling',
  versjon: 0,
  vilkår: [],
  virkningstidspunkt: '2025-01-02',
};

describe('SaksinfoBanner på behandling siden', () => {
  it('skal vise navn på bruker', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        referanse={'123456'}
        typeBehandling="Førstegangsbehandling"
      />
    );
    expect(screen.getByText('Peder Ås')).toBeVisible();
  });

  it('skal vise ident på bruker', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        referanse={'123456'}
        typeBehandling="Førstegangsbehandling"
      />
    );
    expect(screen.getByText('12345678910')).toBeVisible();
  });

  it('skal vise saksnummer derosm bruker er på behandlingsiden', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        referanse={'123456'}
        typeBehandling="Førstegangsbehandling"
      />
    );
    expect(screen.getByText('Sak 12345'));
  });

  it('skal vise hvilken type behandling', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        referanse={'123456'}
        typeBehandling="Førstegangsbehandling"
      />
    );
    expect(screen.getByText('Førstegangsbehandling')).toBeVisible();
  });

  it('skal vise status', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        referanse={'123456'}
        typeBehandling="Førstegangsbehandling"
      />
    );
    expect(screen.getByText('Utredes')).toBeVisible();
  });

  it('skal ha en knapp for å åpne saksmeny', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        referanse={'123456'}
        typeBehandling="Førstegangsbehandling"
      />
    );
    const knapp = screen.getByRole('button', { name: 'Saksmeny' });
    expect(knapp).toBeVisible();
  });

  // TODO disables inntil valget skal vises
  it.skip('menyvalg for å trekke søknad vises for førstegangsbehandling', async () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        referanse={'123456'}
        typeBehandling="Førstegangsbehandling"
      />
    );
    await user.click(screen.getByRole('button', { name: 'Saksmeny' }));
    expect(screen.getByRole('button', { name: 'Trekk søknad' })).toBeVisible();
  });

  it('menyvalg for å trekke søknad vises ikke for revurdering', async () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        referanse={'123456'}
        påVent={false}
        typeBehandling="Revurdering"
      />
    );
    await user.click(screen.getByRole('button', { name: 'Saksmeny' }));
    expect(screen.queryByRole('button', { name: 'Trekk søknad' })).not.toBeInTheDocument();
  });
});

describe('Sak status', () => {
  it('skal vise en tag som viser om saken er satt på vent dersom den er det', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        referanse={'123456'}
        påVent={true}
      />
    );

    const påVentTag = screen.getByText('På vent');
    expect(påVentTag).toBeVisible();
  });

  it('skal ikke vise en tag som viser om saken er satt på vent dersom den ikke er det', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        referanse={'123456'}
        påVent={false}
      />
    );

    const påVentTag = screen.queryByText('På vent');
    expect(påVentTag).not.toBeInTheDocument();
  });

  it('skal vise en tag som viser om behandlingen er reservert dersom den er det', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        brukerInformasjon={{ navn: 'Saksbehandler', NAVident: 'nayBruker' }}
        oppgaveReservertAv={'navIdent'}
        referanse={'123456'}
        påVent={false}
        typeBehandling="Førstegangsbehandling"
      />
    );

    const reservertTag = screen.getByText('Reservert navIdent');
    expect(reservertTag).toBeVisible();
  });

  it('skal ikke vise en tag som viser om behandlingen er reservert dersom innnlogget bruker har resertvert den', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        brukerInformasjon={{ navn: 'Saksbehandler', NAVident: 'navIdent' }}
        oppgaveReservertAv={'navIdent'}
        referanse={'123456'}
        påVent={false}
      />
    );

    const reservertTag = screen.queryByText('Reservert navIdent');
    expect(reservertTag).not.toBeInTheDocument();
  });

  it('skal ikke vise en tag som viser om behandlingen er reservert dersom ingen har reservert den', () => {
    render(
      <SaksinfoBanner
        personInformasjon={personInformasjon}
        sak={sak}
        behandlingVersjon={1}
        behandling={behandling}
        brukerInformasjon={{ navn: 'Saksbehandler', NAVident: 'navIdent' }}
        referanse={'123456'}
        påVent={false}
      />
    );

    const reservertTag = screen.queryByText('Reservert navIdent');
    expect(reservertTag).not.toBeInTheDocument();
  });
});
