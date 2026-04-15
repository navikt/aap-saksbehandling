import { describe, expect, it, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VisningModus } from 'lib/types/visningTypes';
import {
  VilkårskortMedForm,
  VilkårsKortMedFormProps,
} from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';

describe('Vilkårskort med form', () => {
  it('skal ha en overskrift', () => {
    renderComponentMedDefaultProps(VisningModus.AKTIV_UTEN_AVBRYT);

    const overskrift = screen.getByRole('heading', { name: 'Dette er en overskrift' });
    expect(overskrift).toBeVisible();
  });

  it('skal vise innhold', () => {
    renderComponentMedDefaultProps(VisningModus.AKTIV_UTEN_AVBRYT);
    const innhold = screen.getByText('Dette er innhold');
    expect(innhold).toBeVisible();
  });

  it('skal vise en knapp for å bekrefte innesending av skjema dersom visningsmodus er aktiv', () => {
    renderComponentMedDefaultProps(VisningModus.AKTIV_UTEN_AVBRYT);
    const button = screen.getByRole('button', { name: 'Bekreft' });
    expect(button).toBeVisible();
  });

  it('skal ikke vise bekreft knapp dersom visningsmodus er låst', async () => {
    renderComponentMedDefaultProps(VisningModus.LÅST_UTEN_ENDRE);

    const bekreftButton = screen.queryByRole('button', { name: 'Bekreft' });
    expect(bekreftButton).not.toBeInTheDocument();
  });

  it('skal vise informasjon om hvem som har gjort en vurdering', () => {
    renderComponentMedDefaultProps(VisningModus.AKTIV_UTEN_AVBRYT);

    const tekst = screen.getByText('Vurdert av Lokalsaksbehandler, 25.04.2025');
    expect(tekst).toBeVisible();
  });

  it('skal vise informasjon om hvem som har gjort kvalitetssikring', () => {
    renderComponentMedDefaultProps(VisningModus.AKTIV_UTEN_AVBRYT);

    const tekst = screen.getByText('Kvalitetssikret av Kvalitetssikrer, 26.04.2025');
    expect(tekst).toBeVisible();
  });

  it('skal vise feilmelding dersom det finnes', () => {
    render(
      <VilkårskortMedForm
        {...defaultProps}
        visningModus={VisningModus.AKTIV_UTEN_AVBRYT}
        løsBehovOgGåTilNesteStegError={{ message: 'Dette er en feil fra backend gjennom løs behov', code: 'UKJENT' }}
        visningActions={{
          onBekreftClick: vitest.fn,
          onEndreClick: vitest.fn,
          avbrytEndringClick: vitest.fn,
        }}
      >
        <span>Dette er innhold</span>
      </VilkårskortMedForm>
    );

    const errorMessage = screen.getByText('Dette er en feil fra backend gjennom løs behov');
    expect(errorMessage).toBeVisible();
  });

  it('Skal ha knapper for bekreft og avbryt utkast når visningsModus er AKTIV_MED_AVBRYT', () => {
    renderComponentMedDefaultProps(VisningModus.AKTIV_MED_AVBRYT);
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });

    expect(bekreftKnapp).toBeVisible();
    expect(avbrytKnapp).toBeVisible();
  });

  it('Skal ha knapper for bekreft når visningsModus er AKTIV_UTEN_AVBRYT', () => {
    renderComponentMedDefaultProps(VisningModus.AKTIV_UTEN_AVBRYT);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    const avbrytKnapp = screen.queryByRole('button', { name: 'Avbryt' });

    expect(bekreftKnapp).toBeVisible();
    expect(avbrytKnapp).not.toBeInTheDocument();
  });

  it('Skal ha knapp for å endre vurdering når visningsModus er LÅST_MED_ENDRE', () => {
    renderComponentMedDefaultProps(VisningModus.LÅST_MED_ENDRE);

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    expect(endreKnapp).toBeVisible();

    const bekreftKnapp = screen.queryByRole('button', { name: 'Bekreft' });
    const avbrytKnapp = screen.queryByRole('button', { name: 'Avbryt' });

    expect(bekreftKnapp).not.toBeInTheDocument();
    expect(avbrytKnapp).not.toBeInTheDocument();
  });

  it('Skal ikke ha knapper for endre, bekreft eller avbryt når visningsModus er LÅST_UTEN_ENDRE', () => {
    renderComponentMedDefaultProps(VisningModus.LÅST_UTEN_ENDRE);

    const endreKnapp = screen.queryByRole('button', { name: 'Endre' });
    const bekreftKnapp = screen.queryByRole('button', { name: 'Bekreft' });
    const avbrytKnapp = screen.queryByRole('button', { name: 'Avbryt' });

    expect(endreKnapp).not.toBeInTheDocument();
    expect(bekreftKnapp).not.toBeInTheDocument();
    expect(avbrytKnapp).not.toBeInTheDocument();
  });
});

const defaultProps: VilkårsKortMedFormProps = {
  formReset(): void {},
  heading: 'Dette er en overskrift',
  steg: 'AVKLAR_SYKDOM',
  onSubmit: vitest.fn(),
  isLoading: false,
  status: 'DONE',
  vilkårTilhørerNavKontor: true,
  vurdertAvAnsatt: { ident: 'Lokalsaksbehandler', dato: '2025-04-25' },
  kvalitetssikretAv: { ident: 'Kvalitetssikrer', dato: '2025-04-26' },
  children: undefined,
  løsBehovOgGåTilNesteStegError: undefined,
  visningActions: {
    onBekreftClick: vitest.fn,
    onEndreClick: vitest.fn,
    avbrytEndringClick: vitest.fn,
  },
  visningModus: VisningModus.AKTIV_UTEN_AVBRYT,
};

function renderComponentMedDefaultProps(visningModus: VisningModus) {
  render(
    <VilkårskortMedForm
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
    </VilkårskortMedForm>
  );
}
