import userEvent from '@testing-library/user-event';
import { RedigerMottakerDialog } from 'components/brevbygger/mottaker/RedigerMottakerDialog';
import { MottakerType } from 'components/brevbygger/mottaker/VelgMottakere';
import { render, screen, waitFor } from 'lib/test/CustomRender';
import { Mottaker } from 'lib/types/types';
import { StrictMode } from 'react';
import { describe, expect, test, vi } from 'vitest';

const identMottaker: Mottaker = { ident: '999999999', identType: 'ORGNR' };
const adresseMottaker: Mottaker = {
  navnOgAdresse: {
    navn: 'Testmottaker',
    adresse: {
      adresselinje1: 'Testveien 1',
      landkode: 'NO',
      postnummer: '0001',
      poststed: 'Oslo',
    },
  },
};

function renderDialog(mottaker?: Mottaker) {
  const onLagre = vi.fn();
  render(
    <StrictMode>
      <RedigerMottakerDialog
        target={MottakerType.HOVEDMOTTAKER}
        mottaker={mottaker}
        onLagre={onLagre}
        setIsOpen={vi.fn()}
      />
    </StrictMode>
  );
  return { onLagre };
}

describe('RedigerMottakerDialog', () => {
  test('viser og beholder identfeltene når mottaker kun har ident', async () => {
    const user = userEvent.setup();
    const { onLagre } = renderDialog(identMottaker);

    expect(await screen.findByRole('radio', { name: /Kun ident/ })).toBeChecked();
    expect(screen.getByRole('combobox', { name: 'Identtype' })).toHaveValue('ORGNR');
    expect(screen.getByRole('textbox', { name: 'Identifikator' })).toHaveValue('999999999');
    expect(screen.queryByRole('textbox', { name: 'Navn' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Lagre' }));

    await waitFor(() => {
      expect(onLagre).toHaveBeenCalledWith(MottakerType.HOVEDMOTTAKER, {
        ...identMottaker,
        navnOgAdresse: undefined,
      });
    });
  });

  test('viser adressefeltene når mottaker kun har adresse', async () => {
    renderDialog(adresseMottaker);

    expect(await screen.findByRole('radio', { name: /Kun adresse/ })).toBeChecked();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toHaveValue('Testmottaker');
    expect(screen.getByRole('textbox', { name: 'Adresselinjer' })).toHaveValue('Testveien 1');
    expect(screen.getByRole('textbox', { name: 'Postnummer' })).toHaveValue('0001');
    expect(screen.queryByRole('textbox', { name: 'Identifikator' })).not.toBeInTheDocument();
  });

  test('viser begge feltgruppene når mottaker har ident og adresse', async () => {
    renderDialog({ ...identMottaker, ...adresseMottaker });

    expect(await screen.findByRole('radio', { name: /Begge deler/ })).toBeChecked();
    expect(screen.getByRole('textbox', { name: 'Identifikator' })).toHaveValue('999999999');
    expect(screen.getByRole('textbox', { name: 'Navn' })).toHaveValue('Testmottaker');
    expect(screen.getByRole('textbox', { name: 'Poststed' })).toHaveValue('Oslo');
  });

  test('oppdaterer feltvisningen ved bytte av opplysningstype', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(await screen.findByRole('radio', { name: /Kun ident/ }));
    expect(screen.getByRole('textbox', { name: 'Identifikator' })).toBeVisible();
    expect(screen.queryByRole('textbox', { name: 'Navn' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /Begge deler/ }));
    expect(screen.getByRole('textbox', { name: 'Identifikator' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeVisible();

    await user.click(screen.getByRole('radio', { name: /Kun adresse/ }));
    expect(screen.queryByRole('textbox', { name: 'Identifikator' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeVisible();
  });

  test('tømmer skjulte adressefelt og lagrer kun ident etter bytte', async () => {
    const user = userEvent.setup();
    const { onLagre } = renderDialog({ ...identMottaker, ...adresseMottaker });

    await user.click(await screen.findByRole('radio', { name: /Kun ident/ }));
    await user.click(screen.getByRole('radio', { name: /Begge deler/ }));

    expect(screen.getByRole('textbox', { name: 'Navn' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'Adresselinjer' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'Identifikator' })).toHaveValue('999999999');

    await user.click(screen.getByRole('radio', { name: /Kun ident/ }));
    await user.click(screen.getByRole('button', { name: 'Lagre' }));

    await waitFor(() => {
      expect(onLagre).toHaveBeenCalledWith(MottakerType.HOVEDMOTTAKER, {
        ...identMottaker,
        navnOgAdresse: undefined,
      });
    });
  });
});
