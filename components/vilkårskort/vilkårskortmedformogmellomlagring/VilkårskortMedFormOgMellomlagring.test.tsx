import { describe, expect, it, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  VilkårskortMedFormOgMellomlagring,
  VilkårsKortMedFormOgMellomlagringProps,
} from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { ApiException } from 'lib/utils/api';
import { VisningModus } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

describe('Vilkårskort med form', () => {
  it('skal ha en overskrift', () => {
    renderComponent();

    const overskrift = screen.getByRole('heading', { name: 'Dette er en overskrift' });
    expect(overskrift).toBeVisible();
  });

  it('skal vise innhold', () => {
    renderComponent(true);
    const innhold = screen.getByText('Dette er innhold');
    expect(innhold).toBeVisible();
  });

  it('skal vise en knapp for å bekrefte innesending av skjema dersom visBekreftKnapp er true', () => {
    renderComponent(true);
    const button = screen.getByRole('button', { name: 'Bekreft' });
    expect(button).toBeVisible();
  });

  it('skal ikke vise bekreft knapp visBekreftKnapp er false', async () => {
    renderComponent(false);

    const bekreftButton = screen.queryByRole('button', { name: 'Bekreft' });
    expect(bekreftButton).not.toBeInTheDocument();
  });

  it('skal vise informasjon om hvem som har gjort en vurdering', () => {
    renderComponent(true);

    const tekst = screen.getByText('Vurdert av Lokalsaksbehandler, 25.04.2025');
    expect(tekst).toBeVisible();
  });

  it('skal vise informasjon om hvem som har gjort kvalitetssikring', () => {
    renderComponent(true);

    const tekst = screen.getByText('Kvalitetssikret av Kvalitetssikrer, 26.04.2025');
    expect(tekst).toBeVisible();
  });

  it('skal vise feilmelding dersom det finnes', () => {
    renderComponent(true, { message: 'Dette er en feil fra backend gjennom løs behov', code: 'UKJENT' });

    const errorMessage = screen.getByText('Dette er en feil fra backend gjennom løs behov');
    expect(errorMessage).toBeVisible();
  });

  it('Skal ha en knapp for å mellomlagre en vurdering dersom det har blitt sendt inn en lagre funksjon', () => {
    render(<VilkårskortMedFormOgMellomlagring {...defaultProps} onLagreMellomLagringClick={vitest.fn} />);
    const lagreUtkastKnapp = screen.getByRole('button', { name: 'Lagre utkast' });
    expect(lagreUtkastKnapp).toBeVisible();
  });

  it('Skal ha en knapp for å slette en mellomlagret vurdering dersom det finnes en mellomlagret vurdering og det finnes en delete funksjon', () => {
    render(
      <VilkårskortMedFormOgMellomlagring
        {...defaultProps}
        onLagreMellomLagringClick={vitest.fn}
        onDeleteMellomlagringClick={vitest.fn}
        mellomlagretVurdering={{
          vurdertDato: '2025-08-21',
          vurdertAv: 'Jan T. Loven',
          data: '{begrunnelse: 12}',
          avklaringsbehovkode: '5003',
          behandlingId: { id: 1 },
        }}
      />
    );

    const slettUtkastKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    expect(slettUtkastKnapp).toBeVisible();
  });

  it('Skal vise hvem som har gjort mellomlagring hvis det finnes', () => {
    render(
      <VilkårskortMedFormOgMellomlagring
        {...defaultProps}
        onLagreMellomLagringClick={vitest.fn}
        onDeleteMellomlagringClick={vitest.fn}
        mellomlagretVurdering={{
          vurdertDato: '2025-08-21T12:00:00.000',
          vurdertAv: 'Jan T. Loven',
          data: '{begrunnelse: 12}',
          avklaringsbehovkode: '5003',
          behandlingId: { id: 1 },
        }}
      />
    );

    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal ikke vise hvem som har gjort mellomlagring hvis det er readOnly', () => {
    render(
      <VilkårskortMedFormOgMellomlagring
        {...defaultProps}
        readOnly={true}
        onLagreMellomLagringClick={vitest.fn}
        onDeleteMellomlagringClick={vitest.fn}
        mellomlagretVurdering={{
          vurdertDato: '2025-08-21T12:00:00.000',
          vurdertAv: 'Jan T. Loven',
          data: '{begrunnelse: 12}',
          avklaringsbehovkode: '5003',
          behandlingId: { id: 1 },
        }}
      />
    );

    const tekst = screen.queryByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).not.toBeInTheDocument();
  });

  it('Skal ikke vise knapp for å lagre mellomlagring hvis det er readOnly', () => {
    render(
      <VilkårskortMedFormOgMellomlagring
        {...defaultProps}
        readOnly={true}
        onLagreMellomLagringClick={vitest.fn}
        onDeleteMellomlagringClick={vitest.fn}
        mellomlagretVurdering={{
          vurdertDato: '2025-08-21T12:00:00.000',
          vurdertAv: 'Jan T. Loven',
          data: '{begrunnelse: 12}',
          avklaringsbehovkode: '5003',
          behandlingId: { id: 1 },
        }}
      />
    );

    const knapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(knapp).not.toBeInTheDocument();
  });

  it('Skal ha knapper for bekreft, avbryt og lagre utkast når visningsModus er AKTIV_MED_AVBRYT', () => {
    renderComponentNyVisning(VisningModus.AKTIV_MED_AVBRYT);
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    const lagreUtkastKnapp = screen.getByRole('button', { name: 'Lagre utkast' });

    expect(bekreftKnapp).toBeVisible();
    expect(avbrytKnapp).toBeVisible();
    expect(lagreUtkastKnapp).toBeVisible();
  });

  it('Skal ha knapper for bekreft og lagre utkast når visningsModus er AKTIV_UTEN_AVBRYT', () => {
    renderComponentNyVisning(VisningModus.AKTIV_UTEN_AVBRYT);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    const avbrytKnapp = screen.queryByRole('button', { name: 'Avbryt' });
    const lagreUtkastKnapp = screen.getByRole('button', { name: 'Lagre utkast' });

    expect(bekreftKnapp).toBeVisible();
    expect(avbrytKnapp).not.toBeInTheDocument();
    expect(lagreUtkastKnapp).toBeVisible();
  });

  it('Skal ha knapp for å endre vurdering når visningsModus er LÅST_MED_ENDRE', () => {
    renderComponentNyVisning(VisningModus.LÅST_MED_ENDRE);

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    expect(endreKnapp).toBeVisible();

    const bekreftKnapp = screen.queryByRole('button', { name: 'Bekreft' });
    const avbrytKnapp = screen.queryByRole('button', { name: 'Avbryt' });
    const lagreUtkastKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });

    expect(bekreftKnapp).not.toBeInTheDocument();
    expect(avbrytKnapp).not.toBeInTheDocument();
    expect(lagreUtkastKnapp).not.toBeInTheDocument();
  });

  it('Skal ikke ha noen knapper når visningsModus er LÅST_UTEN_ENDRE', () => {
    renderComponentNyVisning(VisningModus.LÅST_UTEN_ENDRE);

    const endreKnapp = screen.queryByRole('button', { name: 'Endre' });
    const bekreftKnapp = screen.queryByRole('button', { name: 'Bekreft' });
    const avbrytKnapp = screen.queryByRole('button', { name: 'Avbryt' });
    const lagreUtkastKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });

    expect(endreKnapp).not.toBeInTheDocument();
    expect(bekreftKnapp).not.toBeInTheDocument();
    expect(avbrytKnapp).not.toBeInTheDocument();
    expect(lagreUtkastKnapp).not.toBeInTheDocument();
  });
});

const defaultProps: VilkårsKortMedFormOgMellomlagringProps = {
  heading: 'Dette er en overskrift',
  steg: 'AVKLAR_SYKDOM',
  onSubmit: vitest.fn(),
  isLoading: false,
  status: 'DONE',
  visBekreftKnapp: false,
  vilkårTilhørerNavKontor: true,
  vurdertAvAnsatt: { ident: 'Lokalsaksbehandler', dato: '2025-04-25' },
  kvalitetssikretAv: { ident: 'Kvalitetssikrer', dato: '2025-04-26' },
  children: undefined,
  onDeleteMellomlagringClick: vitest.fn,
  mellomlagretVurdering: undefined,
  onLagreMellomLagringClick: vitest.fn,
  løsBehovOgGåTilNesteStegError: undefined,
  visningActions: {
    onBekreftClick: vitest.fn,
    onEndreClick: vitest.fn,
    avbrytEndringClick: vitest.fn,
  },
  visningModus: VisningModus.AKTIV_UTEN_AVBRYT,
};

function renderComponent(skalViseBekreftKnapp?: boolean, error?: ApiException) {
  render(
    <VilkårskortMedFormOgMellomlagring
      {...defaultProps}
      visBekreftKnapp={!!skalViseBekreftKnapp}
      løsBehovOgGåTilNesteStegError={error}
    >
      <span>Dette er innhold</span>
    </VilkårskortMedFormOgMellomlagring>
  );
}

function renderComponentNyVisning(visningModus: VisningModus) {
  render(
    <VilkårskortMedFormOgMellomlagringNyVisning
      {...defaultProps}
      visningModus={visningModus}
      visningActions={{
        onBekreftClick: vitest.fn,
        onEndreClick: vitest.fn,
        avbrytEndringClick: vitest.fn,
      }}
      formReset={() => vitest.fn}
    >
      <span>Dette er innhold</span>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
}
