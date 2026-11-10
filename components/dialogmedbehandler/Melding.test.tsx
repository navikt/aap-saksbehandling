import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Melding } from './Melding';

describe('viser riktig tekst (og ikon) for de forskjellige statusene', () => {
  it.each([
    { status: 'SENDT', expectedText: 'Sendt', expectedIcon: 'Sendt' },
    { status: 'LEVERT', expectedText: 'Sendt', expectedIcon: 'Sendt' },
    { status: 'FEILET', expectedText: 'Feilet', expectedIcon: 'Feilet' },
    { status: null, expectedText: 'Sender ...', expectedIcon: null },
    { status: undefined, expectedText: 'Sender ...', expectedIcon: null },
  ] as const)('renders "$expectedText" for status $status', ({ status, expectedText, expectedIcon }) => {
    render(
      <Melding
        visningType="UTGÅENDE"
        dokumentasjonType="L40"
        meldingFraNavn="Behandler"
        opprettetTidspunkt="2026-11-09T12:00:00"
        status={status}
        journalpostId={null}
        dokumentInfoIdListe={[]}
      >
        Testmelding
      </Melding>
    );

    expect(screen.getByText(expectedText, { ignore: 'script, style, title' })).toBeVisible();
    expect(screen.queryAllByTitle('Sendt')).toHaveLength(expectedIcon === 'Sendt' ? 1 : 0);
    expect(screen.queryAllByTitle('Feilet')).toHaveLength(expectedIcon === 'Feilet' ? 1 : 0);
  });
});
