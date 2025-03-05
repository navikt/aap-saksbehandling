import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { Inntekt } from 'lib/types/types';

const inntekter: Array<Inntekt> = [
  { år: '2021', justertTilMaks6G: 6, inntektIG: 6, inntektIKroner: 1100000 },
  { år: '2020', justertTilMaks6G: 6, inntektIG: 6, inntektIKroner: 1000000 },
];

describe('tabell for å vise inntekter', () => {
  it('skal ha en overskrift', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} yrkesevneNedsattÅr="2015" />);
    const overskrift = screen.getByText('Grunnlagsberegning § 11-19');
    expect(overskrift).toBeVisible();
  });

  it('viser en detaljert beskrivelse om standard grunnlagsberegning', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} yrkesevneNedsattÅr="2015" />);
    expect(screen.getByRole('button', { name: 'Se detaljer om standard grunnlagsberegning' })).toBeVisible();
    expect(screen.getByText(/^Inntekter er hentet fra skatteetaten/)).toBeInTheDocument();
  });

  it('har en tekst som informerer om når bruker fikk nedsatt arbeidsevne', () => {
    const yrkesevneNedsattÅr = '2016';
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} yrkesevneNedsattÅr={yrkesevneNedsattÅr} />);
    expect(screen.getByText(`Bruker fikk arbeidsevnen nedsatt i ${yrkesevneNedsattÅr}`));
  });

  it('skal ha en kolonne som heter Periode', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} yrkesevneNedsattÅr="2015" />);
    const periodeHeader = screen.getByRole('columnheader', { name: /periode/i });
    expect(periodeHeader).toBeVisible();
  });

  it('skal ha en kolonne som heter Pensjonsgivende inntekt', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} yrkesevneNedsattÅr="2015" />);
    const pensjonsgivendeInntektHeader = screen.getByRole('columnheader', { name: /pensjonsgivende inntekt/i });
    expect(pensjonsgivendeInntektHeader).toBeVisible();
  });

  it('skal ha en kolonne som heter Justert til maks 6G', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} yrkesevneNedsattÅr="2015" />);
    const justertTilMaks6GHeader = screen.getByRole('columnheader', { name: 'Inntektsgrunnlag (maks 6 G)' });
    expect(justertTilMaks6GHeader).toBeVisible();
  });

  it('skal ha et felt med gjennomsnittlig inntekt siste 3 år', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} yrkesevneNedsattÅr="2015" />);
    const felt = screen.getByText(`Gjennomsnitt ${inntekter.at(0)?.år} - ${inntekter.at(-1)?.år}`);
    expect(felt).toBeVisible();
  });

  it('skal rendre en rad', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} yrkesevneNedsattÅr="2015" />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4); // Inneholder headers og gjennomsnitt siste 3 år
  });
});
