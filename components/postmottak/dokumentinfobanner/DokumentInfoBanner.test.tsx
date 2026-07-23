import { render, screen } from '@testing-library/react';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';
import { OppgaveVisningsinformasjon } from 'lib/types/oppgaveTypes';
import { ReactElement } from 'react';
import { beforeEach, describe, expect, it, test } from 'vitest';

import { DokumentInfoBanner } from 'components/postmottak/dokumentinfobanner/DokumentInfoBanner';

function renderMedInnloggetBruker(ui: ReactElement) {
  return render(
    <InnloggetBrukerContextProvider bruker={{ NAVident: 'Z000000', navn: 'Test Testesen', roller: [] }}>
      {ui}
    </InnloggetBrukerContextProvider>
  );
}

const journalpostInfo = {
  journalpostId: 345,
  registrertDato: '2025-04-03',
  avsender: { navn: 'Lun Veterinær', ident: '12345678910' },
  søker: { navn: 'God Påske', ident: '01987654321' },
  dokumenter: [],
};

const oppgaveVisningsinfo: OppgaveVisningsinformasjon = {
  saksnummer: '12345',
  harUlesteDokumenter: false,
  id: 1,
  markeringer: [],
  skjermingInfo: { erSkjermet: false, harFortroligAdresse: false, harStrengtFortroligAdresse: false },
  versjon: 0,
};

describe('Dokumentinfobanner', () => {
  beforeEach(() => {
    renderMedInnloggetBruker(
      <DokumentInfoBanner
        behandlingsreferanse={'uuid'}
        behandlingsVersjon={1}
        journalpostInfo={journalpostInfo}
        påVent={false}
        oppgaveVisningsinfo={oppgaveVisningsinfo}
      />
    );
  });

  it('skal vise navn på søker ', () => {
    const navn = screen.getByRole('link', { name: 'God Påske' });
    expect(navn).toBeVisible();
    expect(navn).toHaveAttribute('href', '/saksbehandling/sak/12345');
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
    const journalPostId = screen.getByText('Registrert: 03.04.2025');
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
  renderMedInnloggetBruker(
    <DokumentInfoBanner
      behandlingsreferanse={'uuid'}
      behandlingsVersjon={1}
      journalpostInfo={journalpostInfo}
      påVent={true}
      oppgaveVisningsinfo={oppgaveVisningsinfo}
    />
  );

  const påVentTag = screen.getByText('På vent');
  expect(påVentTag).toBeVisible();
});

test('skal vise en tag dersom behandlingen har utløpt ventefrist', () => {
  renderMedInnloggetBruker(
    <DokumentInfoBanner
      behandlingsreferanse={'uuid'}
      behandlingsVersjon={1}
      journalpostInfo={journalpostInfo}
      påVent={false}
      oppgaveVisningsinfo={{
        ...oppgaveVisningsinfo,
        utløptVenteInfo: { påVentTil: '2026-01-01', påVentÅrsak: 'VENTER_PÅ_OPPLYSNINGER' },
      }}
    />
  );

  const ventefristUtløptTag = screen.getByText('Frist utløpt 01.01.2026');
  expect(ventefristUtløptTag).toBeVisible();
});

test('skal vise en tag dersom oppgaven er reservert', () => {
  renderMedInnloggetBruker(
    <DokumentInfoBanner
      behandlingsreferanse={'uuid'}
      behandlingsVersjon={1}
      journalpostInfo={journalpostInfo}
      påVent={false}
      oppgaveVisningsinfo={{ ...oppgaveVisningsinfo, reservertAvIdent: 'z123' }}
    />
  );

  const reservertTag = screen.getByText('Tildelt: z123');
  expect(reservertTag).toBeVisible();

  const ledigTag = screen.queryByText('Ledig');
  expect(ledigTag).not.toBeInTheDocument();
});

test('skal vise tag dersom oppgaven er ledig', () => {
  renderMedInnloggetBruker(
    <DokumentInfoBanner
      behandlingsreferanse={'uuid'}
      behandlingsVersjon={1}
      journalpostInfo={journalpostInfo}
      påVent={false}
      oppgaveVisningsinfo={oppgaveVisningsinfo}
    />
  );

  const ledigTag = screen.getByText('Ledig');
  expect(ledigTag).toBeVisible();

  const tildeltTag = screen.queryByText('Tildelt');
  expect(tildeltTag).not.toBeInTheDocument();
});

test('skal vise søker som tekst når saksnummer mangler', () => {
  renderMedInnloggetBruker(
    <DokumentInfoBanner
      behandlingsreferanse={'uuid'}
      behandlingsVersjon={1}
      journalpostInfo={journalpostInfo}
      påVent={false}
      oppgaveVisningsinfo={{ ...oppgaveVisningsinfo, saksnummer: undefined }}
    />
  );

  const navn = screen.getByText('God Påske');
  expect(navn).toBeVisible();
  expect(screen.queryByRole('link', { name: 'God Påske' })).not.toBeInTheDocument();
});
