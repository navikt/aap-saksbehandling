import { render, screen } from 'lib/test/CustomRender';
import { describe, expect, it } from 'vitest';

import { Melding } from './Melding';
import { MeldingDto } from 'lib/types/types';

describe('viser riktig tekst (og ikon) for de forskjellige statusene', () => {
  const melding: MeldingDto = {
    dialogmeldingId: '123',
    dokumentasjonsType: 'L40',
    innkommendeUtgående: 'UTGÅENDE',
    journalpostId: null,
    meldingFraNavn: 'Behandler',
    meldingStatus: null,
    opprettetTidspunkt: '2026-11-09T12:00:00',
    påminnelseAvbrutt: false,
    tekst: 'Hei, kan dere sende over legeerklæring for pasienten?',
    kanSendeManuellPåminnelse: false,
  };

  it.each([
    { status: 'SENDT', expectedText: 'Sendt', expectedIcon: 'Sendt' },
    { status: 'LEVERT', expectedText: 'Sendt', expectedIcon: 'Sendt' },
    { status: 'FEILET', expectedText: 'Feilet', expectedIcon: 'Feilet' },
    { status: null, expectedText: 'Sender ...', expectedIcon: null },
    { status: undefined, expectedText: 'Sender ...', expectedIcon: null },
  ] as const)('renders "$expectedText" for status $status', ({ status, expectedText, expectedIcon }) => {
    render(
      <Melding melding={{ ...melding, meldingStatus: status }} dokumentInfoIdListe={[]} behandlingsreferanse="456" />
    );

    expect(screen.getByText(expectedText, { ignore: 'script, style, title' })).toBeVisible();
    expect(screen.queryAllByTitle('Sendt')).toHaveLength(expectedIcon === 'Sendt' ? 1 : 0);
    expect(screen.queryAllByTitle('Feilet')).toHaveLength(expectedIcon === 'Feilet' ? 1 : 0);
  });
});
