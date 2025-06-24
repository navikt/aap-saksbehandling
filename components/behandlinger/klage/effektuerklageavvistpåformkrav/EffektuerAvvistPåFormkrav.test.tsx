import { render, screen } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { describe, expect, test } from 'vitest';
import { EffektuerAvvistPåFormkrav } from 'components/behandlinger/klage/effektuerklageavvistpåformkrav/EffektuerAvvistPåFormkrav';
import { EffektuerAvvistPåFormkravGrunnlag } from 'lib/types/types';

const førVarselGrunnlag: EffektuerAvvistPåFormkravGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  varsel: undefined,
  vurdering: undefined,
};

const etterVarselGrunnlag: EffektuerAvvistPåFormkravGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  varsel: {
    brevFerdigstilt: '2025-05-01',
    frist: '2025-05-15',
  },
  vurdering: undefined,
};

const user = userEvent.setup();

describe('Effektuer avvist på fromkrav', () => {
  test('har en overskrift', () => {
    render(<EffektuerAvvistPåFormkrav grunnlag={førVarselGrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('heading', { name: 'Effektuer avvist på formkrav', level: 3 })).toBeVisible();
  });

  test('Viser tekst som ber saksbehandler skrive brevet', () => {
    render(<EffektuerAvvistPåFormkrav grunnlag={førVarselGrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByText('Forhåndsvarsel er ikke sendt. Vennligst fullfør brevet.')).toBeVisible();
  });

  test('Viser når forhåndsvarsel ble sendt', () => {
    render(<EffektuerAvvistPåFormkrav grunnlag={etterVarselGrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(
      screen.getByText(`Forhåndsvarsel sendt: ${formaterDatoForFrontend(etterVarselGrunnlag.varsel?.brevFerdigstilt!)}`)
    ).toBeVisible();
  });

  test('Viser frist', () => {
    render(<EffektuerAvvistPåFormkrav grunnlag={etterVarselGrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(
      screen.getByText(`Frist for svar: ${formaterDatoForFrontend(etterVarselGrunnlag.varsel?.frist!)}`)
    ).toBeVisible();
  });

  test('Skal vise effektuer-form når brevet er ferdigstilt', () => {
    render(<EffektuerAvvistPåFormkrav grunnlag={etterVarselGrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('group', { name: 'Skal klagen endelig avvises på formkrav?' })).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Ja' })).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Nei' })).toBeVisible();
  });

  test('Skal vise bekreft-knapp når form er fylt ut', async () => {
    render(<EffektuerAvvistPåFormkrav grunnlag={etterVarselGrunnlag} readOnly={false} behandlingVersjon={1} />);
    const jaRadio = screen.getByRole('radio', { name: 'Ja' });
    await user.click(jaRadio);
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    expect(bekreftKnapp).toBeVisible();
  });
});
