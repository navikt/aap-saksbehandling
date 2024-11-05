import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InnhentDokumentasjon } from 'components/innhetdokumentasjon/InnhentDokumentasjon';
import { describe, test, expect, beforeEach } from 'vitest';

const user = userEvent.setup();

describe('InnhentDokumentasjon', () => {
  beforeEach(() => {
    render(<InnhentDokumentasjon />);
  });

  test('viser en knapp for å etterspøre informasjon fra lege', () => {
    expect(screen.getByRole('button', { name: 'Etterspør informasjon fra lege' })).toBeVisible();
  });

  test('har ingen skjemafelter initielt', () => {
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    expect(screen.queryAllByRole('combobox')).toHaveLength(0);
  });

  test('har en overskrift på nivå 3 når man viser skjema', async () => {
    await klikkPåEtterspørInformasjon();
    expect(screen.getByRole('heading', { name: 'Etterspør informasjon fra lege' })).toBeVisible();
  });

  test('har et felt for å velge hvilken behandler som skal motta meldingen', async () => {
    await klikkPåEtterspørInformasjon();
    expect(screen.getByRole('combobox', { name: 'Velg behandler som skal motta meldingen' })).toBeVisible();
  });

  test('har et felt for å velge dokumentasjonstype', async () => {
    await klikkPåEtterspørInformasjon();
    expect(screen.getByRole('combobox', { name: 'Type dokumentasjon' })).toBeVisible();
  });

  test('har et felt for melding til behandler', async () => {
    await klikkPåEtterspørInformasjon();
    expect(screen.getByRole('textbox', { name: 'Melding' })).toBeVisible();
  });

  test('har en knapp for å sende melding', async () => {
    await klikkPåEtterspørInformasjon();
    expect(screen.getByRole('button', { name: 'Send dialogmelding' })).toBeVisible();
  });

  test('har en knapp for å forhåndsvise meldingen', async () => {
    await klikkPåEtterspørInformasjon();
    expect(screen.getByRole('button', { name: 'Forhåndsvis' })).toBeVisible();
  });

  test('har en knapp for å avbryte', async () => {
    await klikkPåEtterspørInformasjon();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
  });

  test('klikk på avbryt viser igjen knappen for å etterspørre informasjon', async () => {
    await klikkPåEtterspørInformasjon();
    await klikkPåAvbryt();
    expect(screen.getByRole('button', { name: 'Etterspør informasjon fra lege' })).toBeVisible();
  });
});

describe('validering', () => {
  beforeEach(async () => {
    render(<InnhentDokumentasjon />);
    await klikkPåEtterspørInformasjon();
  });

  test('gir feilmelding dersom behandler ikke er valgt', async () => {
    await klikkPåSendDialogmelding();
    expect(screen.getByText('Du må velge hvilke(n) behandler som skal motta meldingen')).toBeVisible();
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

const klikkPåEtterspørInformasjon = async () =>
  await user.click(screen.getByRole('button', { name: 'Etterspør informasjon fra lege' }));

const klikkPåAvbryt = async () => await user.click(screen.getByRole('button', { name: 'Avbryt' }));
const klikkPåSendDialogmelding = async () =>
  await user.click(screen.getByRole('button', { name: 'Send dialogmelding' }));
