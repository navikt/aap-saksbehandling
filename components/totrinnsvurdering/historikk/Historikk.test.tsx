import { render, screen } from '@testing-library/react';
import { Historikk } from 'components/totrinnsvurdering/historikk/Historikk';
import { HistorikkType } from 'lib/types/types';

const date = new Date('April 19, 2024').toString();

const sendtTilBeslutterInnslag: HistorikkType = {
  aksjon: 'SENDT_TIL_BESLUTTER',
  tidspunkt: date,
  avIdent: 'Kjell T. Ringen',
};

const returnertFraBeslutterInnslag: HistorikkType = {
  aksjon: 'RETURNERT_FRA_BESLUTTER',
  tidspunkt: date,
  avIdent: 'Iren Panikk',
};

const fatteVedtakInnslag: HistorikkType = {
  aksjon: 'FATTET_VEDTAK',
  tidspunkt: date,
  avIdent: 'Per Fekt',
};

describe('toTrinnsvurderingHistorikk', () => {
  it('Skal vise korrekt label dersom aksjon er SENDT_TIL_BESLUTTER', () => {
    render(<Historikk historikk={sendtTilBeslutterInnslag} erFørsteElementIListen={true} />);
    expect(screen.getByText('Sendt til beslutter')).toBeVisible();
  });

  it('Skal vise korrekt label dersom aksjon er RETURNERT_FRA_BESLUTTER', () => {
    render(<Historikk historikk={returnertFraBeslutterInnslag} erFørsteElementIListen={true} />);
    expect(screen.getByText('Returnert fra beslutter')).toBeVisible();
  });

  it('Skal vise korrekt label dersom aksjon er FATTET_VEDTAK', () => {
    render(<Historikk historikk={fatteVedtakInnslag} erFørsteElementIListen={true} />);
    expect(screen.getByText('Fattet vedtak')).toBeVisible();
  });

  it('Skal vise tidspunkt for når hendelsen skjedde', () => {
    render(<Historikk historikk={sendtTilBeslutterInnslag} erFørsteElementIListen={true} />);
    expect(screen.getByText('19.04.2024 00:00')).toBeVisible();
  });

  it('Skal vise personen som har gjort hendelsen', () => {
    render(<Historikk historikk={sendtTilBeslutterInnslag} erFørsteElementIListen={true} />);
    expect(screen.getByText('Kjell T. Ringen')).toBeVisible();
  });
});
