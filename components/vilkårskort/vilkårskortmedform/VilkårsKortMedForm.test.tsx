import { describe, expect, it, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { ApiException } from 'lib/utils/api';

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

    const tekst = screen.getByText('Vurdert av Lokalsaksbehandler (Nav kontor), 25.04.2025');
    expect(tekst).toBeVisible();
  });

  it('skal vise feilmelding dersom det finnes', () => {
    renderComponent(true, { message: 'Dette er en feil fra backend gjennom løs behov', code: 'UKJENT' });

    const errorMessage = screen.getByText('Dette er en feil fra backend gjennom løs behov');
    expect(errorMessage).toBeVisible();
  });
});

function renderComponent(skalViseBekreftKnapp?: boolean, error?: ApiException) {
  render(
    <VilkårsKortMedForm
      heading={'Dette er en overskrift'}
      steg={'AVKLAR_SYKDOM'}
      onSubmit={vitest.fn()}
      isLoading={false}
      status={'DONE'}
      erAktivtSteg={true}
      visBekreftKnapp={!!skalViseBekreftKnapp}
      vilkårTilhørerNavKontor={true}
      løsBehovOgGåTilNesteStegError={error}
      vurdertAvAnsatt={{ ident: 'Lokalsaksbehandler', dato: '2025-04-25' }}
    >
      <span>Dette er innhold</span>
    </VilkårsKortMedForm>
  );
}
