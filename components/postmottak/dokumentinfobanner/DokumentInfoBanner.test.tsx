import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, test } from 'vitest';
import { DokumentInfoBanner } from 'components/postmottak/dokumentinfobanner/DokumentInfoBanner';
import { Oppgave } from 'lib/types/oppgaveTypes';
import {
  NoNavAapOppgaveOppgaveDtoBehandlingstype,
  NoNavAapOppgaveOppgaveDtoStatus,
} from '@navikt/aap-oppgave-typescript-types';

const journalpostInfo = {
  journalpostId: 345,
  registrertDato: '2025-04-03',
  avsender: { navn: 'Lun Veterinær', ident: '12345678910' },
  søker: { navn: 'God Påske', ident: '01987654321' },
  dokumenter: [],
};

const oppgave: Oppgave = {
  vurderingsbehov: [],
  avklaringsbehovKode: '',
  behandlingOpprettet: '',
  behandlingstype: NoNavAapOppgaveOppgaveDtoBehandlingstype.DOKUMENT_H_NDTERING,
  enhet: '',
  opprettetAv: '',
  opprettetTidspunkt: '',
  status: NoNavAapOppgaveOppgaveDtoStatus.OPPRETTET,
  versjon: 0,
  årsakerTilBehandling: [],
  markeringer: [],
  enhetForKø: '0300',
  erPåVent: false,
};

describe('Dokumentinfobanner', () => {
  beforeEach(() => {
    render(
      <DokumentInfoBanner
        behandlingsreferanse={'uuid'}
        behandlingsVersjon={1}
        journalpostInfo={journalpostInfo}
        påVent={false}
        oppgave={oppgave}
      />
    );
  });

  it('skal vise navn på søker ', () => {
    const navn = screen.getByText('Lun Veterinær');
    expect(navn).toBeVisible();
  });

  it('skal vise identen til søker', () => {
    const ident = screen.getByText('01987654321');
    expect(ident).toBeVisible();
  });

  it('skal vise navnet på avsender', () => {
    const avsender = screen.getByText('God Påske');
    expect(avsender).toBeVisible();
  });

  it('skal vise journal post id', () => {
    const journalPostId = screen.getByText('Journalføring 345');
    expect(journalPostId).toBeVisible();
  });

  it('skal vise registreringsdato', () => {
    const journalPostId = screen.getByText('03.04.2025');
    expect(journalPostId).toBeVisible();
  });
  it('skal ikke vise en tag dersom behandlingen ikke er på vent', () => {
    const påVentTag = screen.queryByText('På vent');
    expect(påVentTag).not.toBeInTheDocument();
  });

  it('skal vise en meny', () => {
    const saksmeny = screen.getByRole('button', {
      name: 'Saksmeny',
    });
    expect(saksmeny).toBeVisible();
  });
});

test('skal vise en tag dersom behandlingen er på vent', () => {
  render(
    <DokumentInfoBanner
      behandlingsreferanse={'uuid'}
      behandlingsVersjon={1}
      journalpostInfo={journalpostInfo}
      påVent={true}
      oppgave={oppgave}
    />
  );

  const påVentTag = screen.getByText('På vent');
  expect(påVentTag).toBeVisible();
});

test('skal vise en tag dersom behandlingen har utløpt ventefrist', () => {
  render(
    <DokumentInfoBanner
      behandlingsreferanse={'uuid'}
      behandlingsVersjon={1}
      journalpostInfo={journalpostInfo}
      påVent={false}
      oppgave={{ ...oppgave, utløptVentefrist: '2026-01-01' }}
    />
  );

  const ventefristUtløptTag = screen.getByText('Frist utløpt 01.01.2026');
  expect(ventefristUtløptTag).toBeVisible();
});

test('skal vise en tag dersom oppgaven er reservert', () => {
  render(
    <DokumentInfoBanner
      behandlingsreferanse={'uuid'}
      behandlingsVersjon={1}
      journalpostInfo={journalpostInfo}
      påVent={false}
      oppgave={{ ...oppgave, reservertAv: 'z123' }}
    />
  );

  const reservertTag = screen.getByText('Tildelt: z123');
  expect(reservertTag).toBeVisible();

  const ledigTag = screen.queryByText('Ledig');
  expect(ledigTag).not.toBeInTheDocument();
});

test('skal vise tag dersom oppgaven er ledig', () => {
  render(
    <DokumentInfoBanner
      behandlingsreferanse={'uuid'}
      behandlingsVersjon={1}
      journalpostInfo={journalpostInfo}
      påVent={false}
      oppgave={oppgave}
    />
  );

  const ledigTag = screen.getByText('Ledig');
  expect(ledigTag).toBeVisible();

  const tildeltTag = screen.queryByText('Tildelt');
  expect(tildeltTag).not.toBeInTheDocument();
});
