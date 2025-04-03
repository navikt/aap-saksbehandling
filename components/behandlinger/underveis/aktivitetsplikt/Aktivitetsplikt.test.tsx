import { render, screen } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { Aktivitetsplikt } from 'components/behandlinger/underveis/aktivitetsplikt/Aktivitetsplikt';
import { AktivitetspliktGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { describe, expect, test } from 'vitest';

const testgrunnlag: AktivitetspliktGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  forhåndsvarselDato: '2025-01-02',
  forhåndsvarselSvar: {
    mottattDato: '2025-01-12',
    journalpostId: {
      identifikator: 'asdfjkl',
    },
    dokumentInfoId: {
      dokumentInfoId: 'dokument-id',
    },
  },
  gjeldendeBrudd: [
    {
      begrunnelse: 'Hadde influensa. Sykemelding fra lege.',
      brudd: 'IKKE_MØTT_TIL_TILTAK',
      paragraf: 'PARAGRAF_11_7',
      grunn: 'RIMELIG_GRUNN',
      periode: {
        fom: '2025-01-01',
        tom: '2025-01-14',
      },
    },
  ],
};

const user = userEvent.setup();

describe('Brukers aktivitetsplikt', () => {
  test('har en overskrift', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(
      screen.getByRole('heading', { name: '§ 11-7 Bidrar ikke til egen avklaring / behandling', level: 3 })
    ).toBeVisible();
  });

  test('har et felt for begrunnelse', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toBeVisible();
  });

  test('har en knapp for å gå videre', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeVisible();
  });

  test('viser en tabell med brudd', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('columnheader', { name: 'Brudd' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Grunn' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Begrunnelse' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Periode' })).toBeVisible();
  });

  test('viser en rad pr brudd', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getAllByRole('row')).toHaveLength(testgrunnlag.gjeldendeBrudd.length + 1); // antall gjeldende brudd + header
  });

  test('viser brudd', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('cell', { name: 'Ikke møtt til tiltak' })).toBeVisible();
  });

  test('viser grunn til brudd', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('cell', { name: 'Rimelig grunn' })).toBeVisible();
  });

  test('viser begrunnelse for brudd', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('cell', { name: 'Hadde influensa. Sykemelding fra lege.' })).toBeVisible();
  });

  test('viser perioden bruddet gjelder for', () => {
    const fraDato = formaterDatoForFrontend(testgrunnlag.gjeldendeBrudd[0].periode.fom);
    const tilDato = formaterDatoForFrontend(testgrunnlag.gjeldendeBrudd[0].periode.tom!);
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('cell', { name: `${fraDato} - ${tilDato}` })).toBeVisible();
  });

  test('viser når forhåndsvarsel ble sendt', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(
      screen.getByText(`Forhåndsvarsel sendt: ${formaterDatoForFrontend(testgrunnlag.forhåndsvarselDato!)}`)
    ).toBeVisible();
  });

  test('har en lenke til skjema for aktivitetsplikt', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(screen.getByRole('link', { name: 'Registrer ny / endre informasjon' })).toBeVisible();
  });

  test('har en tekst som viser når bruker vil få stans i ytelsen', () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    expect(
      screen.getByText(
        `Med gjeldende § 11-7 brudd vil bruker få stans i ytelsen fra ${formaterDatoForFrontend(testgrunnlag.gjeldendeBrudd[0].periode.fom)}`
      )
    ).toBeVisible();
  });
});

describe('validering', () => {
  test('viser melding dersom det klikkes på fortsett uten at begrunnelse er fylt ut', async () => {
    render(<Aktivitetsplikt grunnlag={testgrunnlag} readOnly={false} behandlingVersjon={1} />);
    klikkPåBekreft();
    expect(await screen.findByText('Du må begrunne')).toBeVisible();
  });
});

const klikkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
