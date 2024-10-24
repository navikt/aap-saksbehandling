import { beforeEach, describe, expect, test } from 'vitest';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/etannetsted/helseinstitusjon/Helseinstitusjonsvurdering';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';

const user = userEvent.setup();

const x: HelseinstitusjonGrunnlag = {
  opphold: [
    {
      institusjonstype: 'Helseinstitusjon',
      oppholdstype: 'Heldøgnpasient',
      status: 'AKTIV',
      oppholdFra: '2022-10-24',
      avsluttetDato: '2025-10-24',
      kildeinstitusjon: 'St. Mungos Hospital',
    },
  ],
  vurderinger: [
    {
      periode: {
        fom: '2022-10-24',
        tom: '2024-10-23',
      },
      vurderinger: [],
      status: 'UAVKLART',
    },
  ],
};

describe.skip('Helseinstitusjonsvurdering', () => {
  beforeEach(() => {
    render(<Helseinstitusjonsvurdering grunnlag={x} behandlingVersjon={0} readOnly={false} />);
  });

  test('har overskrift Helseinstitusjon § 11-25', () => {
    expect(screen.getByRole('heading', { name: 'Helseinstitusjon § 11-25', level: 3 })).toBeVisible();
  });

  test('viser en liste over institusjonsopphold som er oppdaget', () => {
    expect(
      screen.getByRole('table', { name: 'Søker har følgende institusjonsopphold på helseinstitusjon' })
    ).toBeVisible();
  });

  test('har et fritekstfelt for vurdering av vilkåret', () => {
    expect(
      screen.getByRole('textbox', { name: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen' })
    ).toBeVisible();
  });

  test('spør om søker forsørger ektefelle', () => {
    expect(screen.getByRole('group', { name: 'Forsørger søker ektefelle eller tilsvarende?' })).toBeVisible();
  });

  test('spør om søker har faste utgifter for å beholde bolig eller andre eiendeler', () => {
    expect(
      screen.getByRole('group', { name: 'Har søker faste utgifter nødvendig for å beholde bolig og andre eiendeler?' })
    ).toBeVisible();
  });

  test('viser ikke spørsmål om søker får fri kost og losji initielt', () => {
    expect(screen.queryByRole('group', { name: 'Får søker fri kost og losji?' })).not.toBeInTheDocument();
  });

  test('viser spørsmål om søker får fri kost og losji når man svarer nei på om søker forsørger ektefelle og har faste utgifter', async () => {
    const forsoergerEktefelleGruppe = screen.getByRole('group', {
      name: 'Forsørger søker ektefelle eller tilsvarende?',
    });
    const harFasteUtgifterGruppe = screen.getByRole('group', {
      name: 'Har søker faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
    });

    await user.click(within(forsoergerEktefelleGruppe).getByRole('radio', { name: 'Nei' }));
    await user.click(within(harFasteUtgifterGruppe).getByRole('radio', { name: 'Nei' }));

    expect(screen.getByRole('group', { name: 'Får søker fri kost og losji?' })).toBeVisible();
  });

  test('viser ikke spørsmål om søker får fri kost og losji hvis man svarer ja på at søker forsørger ektefelle', async () => {
    const forsoergerEktefelleGruppe = screen.getByRole('group', {
      name: 'Forsørger søker ektefelle eller tilsvarende?',
    });
    const harFasteUtgifterGruppe = screen.getByRole('group', {
      name: 'Har søker faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
    });

    await user.click(within(forsoergerEktefelleGruppe).getByRole('radio', { name: 'Ja' }));
    await user.click(within(harFasteUtgifterGruppe).getByRole('radio', { name: 'Nei' }));

    expect(screen.queryByRole('group', { name: 'Får søker fri kost og losji?' })).not.toBeInTheDocument();
  });

  test('viser ikke spørsmål om søker får fri kost og losji hvis man svarer ja på at har faste utgifter', async () => {
    const forsoergerEktefelleGruppe = screen.getByRole('group', {
      name: 'Forsørger søker ektefelle eller tilsvarende?',
    });
    const harFasteUtgifterGruppe = screen.getByRole('group', {
      name: 'Har søker faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
    });

    await user.click(within(forsoergerEktefelleGruppe).getByRole('radio', { name: 'Nei' }));
    await user.click(within(harFasteUtgifterGruppe).getByRole('radio', { name: 'Ja' }));

    expect(screen.queryByRole('group', { name: 'Får søker fri kost og losji?' })).not.toBeInTheDocument();
  });

  test('viser ikke spørsmål om søker får fri kost og losji hvis man svarer ja på at har faste utgifter og at de forsørger ektefelle', async () => {
    const forsoergerEktefelleGruppe = screen.getByRole('group', {
      name: 'Forsørger søker ektefelle eller tilsvarende?',
    });
    const harFasteUtgifterGruppe = screen.getByRole('group', {
      name: 'Har søker faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
    });

    await user.click(within(forsoergerEktefelleGruppe).getByRole('radio', { name: 'Ja' }));
    await user.click(within(harFasteUtgifterGruppe).getByRole('radio', { name: 'Ja' }));

    expect(screen.queryByRole('group', { name: 'Får søker fri kost og losji?' })).not.toBeInTheDocument();
  });

  describe('valiering', () => {
    test('viser feilmelding dersom begrunnelse ikke er fylt ut', async () => {
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må begrunne vurderingen din')).toBeVisible();
    });

    test('viser feilmelding hvis man ikke har svart på om søker forsørger ektefelle', async () => {
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må svare på om søker forsørger ektefelle eller tilsvarende')).toBeVisible();
    });

    test('viser feilmelding hvis man ikke har svart på om søker har faste utgifter', async () => {
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(
        screen.getByText('Du må svare på om søker har faste utgifter nødvendig for å beholde bolig og andre eiendeler')
      ).toBeVisible();
    });

    test('viser feilmelding dersom spørsmålet om fri kost og losji vises men ikke er besvart', async () => {
      const forsoergerEktefelleGruppe = screen.getByRole('group', {
        name: 'Forsørger søker ektefelle eller tilsvarende?',
      });
      const harFasteUtgifterGruppe = screen.getByRole('group', {
        name: 'Har søker faste utgifter nødvendig for å beholde bolig og andre eiendeler?',
      });

      await user.click(within(forsoergerEktefelleGruppe).getByRole('radio', { name: 'Nei' }));
      await user.click(within(harFasteUtgifterGruppe).getByRole('radio', { name: 'Nei' }));
      await user.click(screen.getByRole('button', { name: 'Bekreft' }));
      expect(screen.getByText('Du må svare på om søker får fri kost og losji')).toBeVisible();
    });
  });
});
