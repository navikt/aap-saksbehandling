import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { Inntekt } from 'lib/types/types';

const inntekter: Array<Inntekt> = [{ år: '2020', justertTilMaks6G: 6, inntektIG: 6, inntektIKroner: 1000000 }];

describe('tabell for å vise inntekter', () => {
  it('skal ha en overskrift', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} grunnlagBeregnet={5} />);
    const overskrift = screen.getByText(
      'Standard grunnlagsberegning basert på pensjonsgivende inntekt siste 3 år før redusert arbeidsevne'
    );
    expect(overskrift).toBeVisible();
  });

  it('viser en detaljert beskrivelse om standard grunnlagsberegning', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} grunnlagBeregnet={5} />);
    expect(screen.getByRole('button', { name: 'Se detaljer om standard grunnlagsberegning' })).toBeVisible();
    expect(screen.getByText(/^Inntekter er hentet fra skatteetaten/)).toBeInTheDocument();
  });

  it('skal ha en tabell som heter Periode', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} grunnlagBeregnet={5} />);
    const periodeHeader = screen.getByRole('columnheader', { name: /periode/i });
    expect(periodeHeader).toBeVisible();
  });

  it('skal ha en tabell som heter Pensjonsgivende inntekt', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} grunnlagBeregnet={5} />);
    const pensjonsgivendeInntektHeader = screen.getByRole('columnheader', { name: /pensjonsgivende inntekt/i });
    expect(pensjonsgivendeInntektHeader).toBeVisible();
  });

  it('skal ha en tabell som heter Inntekt i G', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} grunnlagBeregnet={5} />);
    const inntektIGHeader = screen.getByRole('columnheader', { name: /inntekt i g/i });
    expect(inntektIGHeader).toBeVisible();
  });

  it('skal ha en tabell som heter Justert til maks 6G', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} grunnlagBeregnet={5} />);
    const justertTilMaks6GHeader = screen.getByRole('columnheader', { name: /justert til maks 6g/i });
    expect(justertTilMaks6GHeader).toBeVisible();
  });

  it('skal ha et felt med gjennomsnittlig inntekt siste 3 år', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} grunnlagBeregnet={5} />);
    const felt = screen.getByText('Gjennomsnitt siste 3 år');
    expect(felt).toBeVisible();
  });

  it('skal rendre en rad', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} grunnlagBeregnet={5} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4); // Inneholder headers og gjennomsnitt siste 3 år
  });

  it('viser rad for beregnet grunnlag når det er sendt inn', () => {
    render(<InntektTabell inntekter={inntekter} gjennomsnittSiste3år={6} grunnlagBeregnet={5.4} />);
    expect(screen.getByRole('cell', { name: 'Grunnlag standard beregnet' })).toBeVisible();
  });
});
