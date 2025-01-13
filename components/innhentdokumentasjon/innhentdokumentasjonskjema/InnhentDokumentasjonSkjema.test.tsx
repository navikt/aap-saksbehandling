import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InnhentDokumentasjonSkjema } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { describe, test, expect, beforeEach, vi } from 'vitest';

const user = userEvent.setup();

describe('InnhentDokumentasjon', () => {
  beforeEach(() => {
    render(<InnhentDokumentasjonSkjema onCancel={vi.fn} onSuccess={vi.fn} />);
  });

  test('har en overskrift på nivå 3 når man viser skjema', async () => {
    expect(screen.getByRole('heading', { name: 'Etterspør informasjon fra lege' })).toBeVisible();
  });

  test('har et felt for å søke etter behandler', async () => {
    expect(await screen.findByRole('combobox', { name: 'Velg behandler som skal motta meldingen' })).toBeVisible();
  });

  test('har et felt for å velge dokumentasjonstype', async () => {
    expect(screen.getByRole('combobox', { name: 'Type dokumentasjon' })).toBeVisible();
  });

  test('har et felt for melding til behandler', async () => {
    expect(screen.getByRole('textbox', { name: 'Melding' })).toBeVisible();
  });

  test('har en knapp for å sende melding', async () => {
    expect(screen.getByRole('button', { name: 'Send dialogmelding' })).toBeVisible();
  });

  test('har en knapp for å forhåndsvise meldingen', async () => {
    expect(screen.getByRole('button', { name: 'Forhåndsvis' })).toBeVisible();
  });

  test('har en knapp for å avbryte', async () => {
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
  });
});

describe('validering', () => {
  beforeEach(async () => {
    render(<InnhentDokumentasjonSkjema onCancel={vi.fn} onSuccess={vi.fn} />);
  });

  test('gir feilmelding dersom behandler ikke er valgt', async () => {
    await klikkPåSendDialogmelding();
    expect(screen.getByText('Du må velge en behandler')).toBeVisible();
  });

  test('gir feilmelding dersom dokumentasjonstype ikke er valgt', async () => {
    await klikkPåSendDialogmelding();
    expect(screen.getByText('Du må velge hvilken type dokumentasjon som skal bestilles')).toBeVisible();
  });

  test('gir feilmelding dersom det ikke er skrevet noen melding', async () => {
    await klikkPåSendDialogmelding();
    expect(screen.getByText('Du må skrive en melding til behandler')).toBeVisible();
  });
});

const klikkPåSendDialogmelding = async () =>
  await user.click(screen.getByRole('button', { name: 'Send dialogmelding' }));
