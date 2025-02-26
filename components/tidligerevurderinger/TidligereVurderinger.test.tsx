import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TidligereVurderinger, Vurdering } from 'components/tidligerevurderinger/TidligereVurderinger';
import { format, parse, subDays, subWeeks } from 'date-fns';
import { Sykdomsvurdering } from 'lib/types/types';
import { ReactNode } from 'react';

import { describe, expect, test } from 'vitest';

const historiskVurdering: Sykdomsvurdering = {
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

const gjeldendeVurdering: Sykdomsvurdering = {
  erNedsettelseIArbeidsevneAvEnVissVarighet: true,
  erSkadeSykdomEllerLyteVesentligdel: true,
  erNedsettelseIArbeidsevneMerEnnHalvparten: true,
  erArbeidsevnenNedsatt: true,
  harSkadeSykdomEllerLyte: true,
  dokumenterBruktIVurdering: [],
  begrunnelse: 'En annen begrunnelse',
  vurdertAvIdent: '10DENT',
  vurdertDato: '2025-02-01',
};

const søknadstidspunkt = format(new Date(), 'yyyy-MM-dd');

const user = userEvent.setup();

describe('Tidligere vurderinger', () => {
  test('har en overskrift', () => {
    render(
      <TidligereVurderinger
        historiskeVurderinger={[historiskVurdering]}
        gjeldendeVurderinger={[gjeldendeVurdering]}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    expect(screen.getByRole('heading', { name: 'Tidligere vurderinger', level: 3 })).toBeVisible();
  });

  test('ved flere vurderinger utledes sluttdato fra neste vurderings vurderingenGjelderFra', async () => {
    const tolvUkerSiden = subWeeks(new Date(), 12);
    const seksUkerSiden = subWeeks(new Date(), 6);
    const fireUkerSiden = subWeeks(new Date(), 4);

    const søknadstidspunktTilbakeITid = format(tolvUkerSiden, 'yyyy-MM-dd');
    const historiskeVurderinger: Sykdomsvurdering[] = [
      {
        erNedsettelseIArbeidsevneAvEnVissVarighet: true,
        erSkadeSykdomEllerLyteVesentligdel: true,
        erNedsettelseIArbeidsevneMerEnnHalvparten: true,
        erArbeidsevnenNedsatt: true,
        harSkadeSykdomEllerLyte: true,
        dokumenterBruktIVurdering: [],
        begrunnelse: 'En begrunnelse',
        vurdertAvIdent: 'IDENT',
        vurdertDato: format(fireUkerSiden, 'yyyy-MM-dd'),
        vurderingenGjelderFra: format(fireUkerSiden, 'yyyy-MM-dd'),
      },
      {
        erNedsettelseIArbeidsevneAvEnVissVarighet: true,
        erSkadeSykdomEllerLyteVesentligdel: true,
        erNedsettelseIArbeidsevneMerEnnHalvparten: true,
        erArbeidsevnenNedsatt: true,
        harSkadeSykdomEllerLyte: true,
        dokumenterBruktIVurdering: [],
        begrunnelse: 'En begrunnelse',
        vurdertAvIdent: 'IDENT',
        vurdertDato: format(seksUkerSiden, 'yyyy-MM-dd'),
      },
    ];
    render(
      <TidligereVurderinger
        historiskeVurderinger={historiskeVurderinger}
        gjeldendeVurderinger={[]}
        søknadstidspunkt={søknadstidspunktTilbakeITid}
      />
    );
    await åpneHistorikkvisning();
    const historikkrader = screen.getAllByRole('row');
    expect(historikkrader).toHaveLength(historiskeVurderinger.length);
    expect(
      within(historikkrader[0]).getByRole('cell', { name: `${format(fireUkerSiden, 'dd.MM.yyyy')} -` })
    ).toBeVisible();
    expect(
      within(historikkrader[1]).getByRole('cell', {
        name: `${format(tolvUkerSiden, 'dd.MM.yyyy')} - ${format(subDays(fireUkerSiden, 1), 'dd.MM.yyyy')}`,
      })
    ).toBeVisible();
  });
});

describe('Tidligere vurdering', () => {
  test('overskrift består av om vilkår er oppfylt, hvem som har saksbehandlet og vedtaksdato', () => {
    render(
      <TableWrapper>
        <Vurdering vurdering={historiskVurdering} søknadstidspunkt={søknadstidspunkt} vurderingErGjeldende={true} />
      </TableWrapper>
    );
    const forventetDatoForStart = format(søknadstidspunkt, 'dd.MM.yyyy');
    expect(screen.getByRole('cell', { name: `${forventetDatoForStart} -` })).toBeVisible();
    const forventetDatoforVurdering = format(
      parse(historiskVurdering.vurdertDato, 'yyyy-MM-dd', new Date()),
      'dd.MM.yyyy'
    );
    const forventetTekst = `(${historiskVurdering.vurdertAvIdent}) ${forventetDatoforVurdering}`;
    expect(screen.getByText(forventetTekst)).toBeVisible();
  });

  test('viser beskrivelse', async () => {
    render(
      <TableWrapper>
        <Vurdering vurdering={historiskVurdering} søknadstidspunkt={søknadstidspunkt} vurderingErGjeldende={true} />
      </TableWrapper>
    );
    const visMerKnapp = screen.getByRole('button', { name: 'Vis mer' });
    await user.click(visMerKnapp);
    expect(screen.getByText(historiskVurdering.begrunnelse)).toBeVisible();
  });

  test('når vurderingenGjelderFra er undefined gjelder vurderingen fra søknadstidspunkt', () => {
    render(
      <TableWrapper>
        <Vurdering vurdering={historiskVurdering} søknadstidspunkt={søknadstidspunkt} vurderingErGjeldende={true} />
      </TableWrapper>
    );
    const forventetDato = format(parse(søknadstidspunkt, 'yyyy-MM-dd', new Date()), 'dd.MM.yyyy');
    const forventetTekst = `${forventetDato} -`;
    expect(screen.getByRole('cell', { name: forventetTekst })).toBeVisible();
  });

  test('når vurderingenGjelderFra er satt er det den som brukes som fra-tidspunkt', () => {
    const datoForVurdering = subDays(new Date(), 5);
    const testvurderingMedGjelderFra = {
      ...historiskVurdering,
      vurderingenGjelderFra: format(datoForVurdering, 'yyyy-MM-dd'),
    };
    render(
      <TableWrapper>
        <Vurdering
          vurdering={testvurderingMedGjelderFra}
          søknadstidspunkt={søknadstidspunkt}
          vurderingErGjeldende={true}
        />
      </TableWrapper>
    );
    const forventetDato = format(datoForVurdering, 'dd.MM.yyyy');
    const forventetTekst = `${forventetDato} -`;
    expect(screen.getByRole('cell', { name: forventetTekst })).toBeVisible();
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

async function åpneHistorikkvisning() {
  await user.click(screen.getByRole('button', { name: 'Vis mer' }));
}
