import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TidligereVurderinger, Vurdering } from 'components/tidligerevurderinger/TidligereVurderinger';
import { format, parse } from 'date-fns';
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

const søknadstidspunkt = format(new Date(), 'yyyy-MM-dd');

const user = userEvent.setup();

describe('Tidligere vurderinger', () => {
  test('har en overskrift', () => {
    render(<TidligereVurderinger tidligereVurderinger={[testvurdering]} søknadstidspunkt={søknadstidspunkt} />);
    expect(screen.getByRole('heading', { name: 'Tidligere vurderinger', level: 3 })).toBeVisible();
  });
});

describe('Tidligere vurdering', () => {
  test('overskrift består av om vilkår er oppfylt, hvem som har saksbehandlet og vedtaksdato', () => {
    render(
      <TableWrapper>
        <Vurdering vurdering={testvurdering} søknadstidspunkt={søknadstidspunkt} />
      </TableWrapper>
    );
    expect(screen.getByText('Vilkår oppfylt')).toBeVisible();
    const forventetDatoForStart = format(søknadstidspunkt, 'dd.MM.yyyy');
    expect(screen.getByText(forventetDatoForStart)).toBeVisible();
    const forventetDatoforVurdering = format(parse(testvurdering.vurdertDato, 'yyyy-MM-dd', new Date()), 'dd.MM.yyyy');
    const forventetTekst = `(${testvurdering.vurdertAvIdent}) ${forventetDatoforVurdering}`;
    expect(screen.getByText(forventetTekst)).toBeVisible();
  });

  test('viser beskrivelse', async () => {
    render(
      <TableWrapper>
        <Vurdering vurdering={testvurdering} søknadstidspunkt={søknadstidspunkt} />
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
