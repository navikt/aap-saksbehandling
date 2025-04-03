import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, test } from 'vitest';
import { DokumentInfoBanner } from 'components/postmottak/dokumentinfobanner/DokumentInfoBanner';

const journalpostInfo = {
  journalpostId: 345,
  registrertDato: '2025-04-03',
  avsender: { navn: 'Lun Veterinær', ident: '12345678910' },
  søker: { navn: 'God Påske', ident: '01987654321' },
  dokumenter: [],
};

describe('Dokumentinfobanner', () => {
  beforeEach(() => {
    render(
      <DokumentInfoBanner
        behandlingsreferanse={'uuid'}
        behandlingsVersjon={1}
        journalpostInfo={journalpostInfo}
        påVent={false}
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
    />
  );

  const påVentTag = screen.getByText('På vent');
  expect(påVentTag).toBeVisible();
});
