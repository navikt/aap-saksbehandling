import { Historikk, HistorikkAksjon } from 'lib/types/types';
import { BodyShort, Label } from '@navikt/ds-react';
import styles from './ToTrinnsvurderingHistorikk.module.css';
import { formaterDatoTidForVisning } from '@navikt/aap-felles-utils-client';

interface Props {
  historikk: Historikk;
  erFørsteElementILiten: boolean;
}

export const ToTrinnsvurderingHistorikk = ({ historikk, erFørsteElementILiten }: Props) => {
  return (
    <div className={erFørsteElementILiten ? styles.historikkTopp : styles.historikkImidten}>
      <Label size={'small'}>{mapAksjonTilString(historikk.aksjon)}</Label>
      <BodyShort size={'small'}>
        <span>{formaterDatoTidForVisning(historikk.tidspunkt)}</span> <span>{historikk.avIdent}</span>
      </BodyShort>
    </div>
  );
};

function mapAksjonTilString(aksjon: HistorikkAksjon): string {
  switch (aksjon) {
    case 'RETURNERT_FRA_BESLUTTER':
      return 'Returnert fra beslutter';
    case 'FATTET_VEDTAK':
      return 'Fattet vedtak';
    case 'SENDT_TIL_BESLUTTER':
      return 'Sendt til beslutter';
  }
}
