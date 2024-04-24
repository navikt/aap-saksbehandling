import { HistorikkType, HistorikkAksjon } from 'lib/types/types';
import { BodyShort, Label } from '@navikt/ds-react';
import styles from 'components/totrinnsvurdering/historikk/Historikk.module.css';
import { formaterDatoTidForVisning } from '@navikt/aap-felles-utils-client';

interface Props {
  historikk: HistorikkType;
  erFørsteElementIListen: boolean;
}

export const Historikk = ({ historikk, erFørsteElementIListen }: Props) => {
  return (
    <div className={erFørsteElementIListen ? styles.historikkTopp : styles.historikkImidten}>
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
