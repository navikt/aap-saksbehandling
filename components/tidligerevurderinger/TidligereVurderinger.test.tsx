import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TidligereVurderinger, Vurdering } from 'components/tidligerevurderinger/TidligereVurderinger';
import { Sykdomsvurdering } from 'lib/types/types';
import { ReactNode } from 'react';

import { describe, expect, test } from 'vitest';

// TODO må gjøres generisk
const testvurdering: Sykdomsvurdering = {
  erNedsettelseIArbeidsevneAvEnVissVarighet: true,
  erSkadeSykdomEllerLyteVesentligdel: true,
  erNedsettelseIArbeidsevneMerEnnHalvparten: true,
  erArbeidsevnenNedsatt: true,
  harSkadeSykdomEllerLyte: true,
  dokumenterBruktIVurdering: [],
  begrunnelse: 'En begrunnelse',
  vurdertAvIdent: 'IDENT',
  vurdertDato: '2025-02-01',
};

const user = userEvent.setup();

describe('Tidligere vurderinger', () => {
  test('har en overskrift', () => {
    render(<TidligereVurderinger tidligereVurderinger={[testvurdering]} />);
    expect(screen.getByRole('heading', { name: 'Tidligere vurderinger', level: 3 })).toBeVisible();
  });
});

describe('Tidligere vurdering', () => {
  // skippes inntil feltene er på plass i historikken
  test.skip('overskrift består av om vilkår er oppfylt, hvem som har saksbehandlet og vedtaksdato', () => {
    render(
      <TableWrapper>
        <Vurdering vurdering={testvurdering} />
      </TableWrapper>
    );
    expect(screen.getByText('Vilkår oppfylt')).toBeVisible();
    expect(screen.getByText(/(XSAKSBEH)/)).toBeVisible();

    //const exp = new RegExp(formaterDatoForVisning(testvurdering.vedtaksdato));

    //expect(screen.getByText(exp)).toBeVisible();
  });

  test('viser beskrivelse', async () => {
    render(
      <TableWrapper>
        <Vurdering vurdering={testvurdering} />
      </TableWrapper>
    );
    const visMerKnapp = screen.getByRole('button', { name: 'Vis mer' });
    await user.click(visMerKnapp);
    expect(screen.getByText(testvurdering.begrunnelse)).toBeVisible();
  });
});

// generisk wrapper for tester hvor vi kun rendrer en rad. Gjør at vi slipper warnings fra vitest om ugyldig struktur på tabell-rader
function TableWrapper({ children }: { children: ReactNode }) {
  return (
    <table>
      <tbody>{children}</tbody>
    </table>
  );
}
