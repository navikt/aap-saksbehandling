import { render, screen } from '@testing-library/react';
import { Dialogmeldinger } from 'components/innhentdokumentasjon/dialogmeldinger/Dialogmeldinger';
import { format, subDays } from 'date-fns';
import { LegeerklæringStatus } from 'lib/types/types';
import { describe, expect, test } from 'vitest';

const dialogmeldinger: LegeerklæringStatus[] = [
  {
    behandlerRef: '1234',
    dialogmeldingUuid: 'uuuid',
    opprettet: '2024-10-28',
    personId: '12345678910',
    status: 'BESTILT',
    statusTekst: 'Hva skal det stå her?',
    saksnummer: '4KD09J',
    behandlerNavn: 'Doogie Houser',
    fritekst: 'hello',
  },
  {
    behandlerRef: '5849',
    dialogmeldingUuid: 'uuuid-4',
    fritekst: 'hello',
    opprettet: '2024-08-22',
    personId: '12345678910',
    status: 'OK',
    statusTekst: 'Hva skal det stå her?',
    saksnummer: '4KD09J',
    behandlerNavn: 'Gregory House',
  },
];

describe('Dialogmeldinger', () => {
  test('viser en tabell med oversikt over dialogmeldinger når det er funnet dialogmeldinger', () => {
    render(<Dialogmeldinger dialogmeldinger={dialogmeldinger} />);
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Bestilt dato' })).toBeVisible();
  });

  test('viser en rad med dato for bestilling og status på bestillingen', () => {
    render(<Dialogmeldinger dialogmeldinger={[dialogmeldinger[0]]} />);
    expect(screen.getByRole('cell', { name: '28.10.2024' })).toBeVisible();
    expect(screen.getByText(/^Bestilt$/)).toBeVisible();
  });

  test('viser en melding om det er ikke er funnet noen dialogmeldinger når listen er tom', () => {
    render(<Dialogmeldinger />);
    expect(screen.getByText('Det finnes ingen dialogmeldinger for denne saken')).toBeVisible();
  });

  test.skip('ikon for purring vises ikke hvis det er under 14 dager siden den ble bestilt', () => {
    const dialogmelding: LegeerklæringStatus = {
      behandlerRef: '1234',
      dialogmeldingUuid: 'uuuuuid',
      opprettet: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      personId: '12345678910',
      status: 'BESTILT',
      statusTekst: 'Hva skal det stå her?',
      saksnummer: '4KD09J',
      behandlerNavn: 'Doogie Houser',
      fritekst: 'hello',
    };
    render(<Dialogmeldinger dialogmeldinger={[dialogmelding]} />);
    expect(screen.queryByRole('button', { name: 'Send purring' })).not.toBeInTheDocument();
  });

  test.skip('ikon for purring vises ikke hvis det er under 14 dager siden den ble bestilt', () => {
    const dialogmelding: LegeerklæringStatus = {
      behandlerRef: '1234',
      dialogmeldingUuid: 'uuuuuid',
      opprettet: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
      personId: '12345678910',
      status: 'BESTILT',
      statusTekst: 'Hva skal det stå her?',
      saksnummer: '4KD09J',
      behandlerNavn: 'Doogie Houser',
      fritekst: 'hello',
    };
    render(<Dialogmeldinger dialogmeldinger={[dialogmelding]} />);
    expect(screen.getByRole('button', { name: 'Send purring' })).toBeInTheDocument();
  });
});
