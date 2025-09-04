import { useEffect, useState } from 'react';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { StegType } from 'lib/types/types';

export enum VisningModus {
  AKTIV_UTEN_AVBRYT = 'AKTIV_UTEN_AVBRYT',
  AKTIV_MED_AVBRYT = 'AKTIV_MED_AVBRYT',
  LÅST_MED_ENDRE = 'LÅST_MED_ENDRE',
  LÅST_UTEN_ENDRE = 'LÅST_UTEN_ENDRE',
}

interface VisningState {
  visning: VisningModus;
  formReadOnly: boolean;
  actions: VisningActions;
}

export interface VisningActions {
  avbrytEndringClick: () => void;
  onEndreClick: () => void;
  onBekreftClick: () => void;
}

export function useVisning(readOnly: boolean, steg: StegType): VisningState {
  const { flyt } = useRequiredFlyt();

  const erAktivtSteg = flyt.aktivtSteg === steg;
  const initialVisningModus = hentVisning(readOnly, erAktivtSteg);
  const initialFormReadOnly =
    initialVisningModus === VisningModus.LÅST_MED_ENDRE || initialVisningModus === VisningModus.LÅST_UTEN_ENDRE;

  const [visning, setVisning] = useState<VisningModus>(initialVisningModus);
  const [formReadOnly, setFormReadOnly] = useState<boolean>(initialFormReadOnly);

  useEffect(() => {
    const visning = hentVisning(readOnly, erAktivtSteg);
    const formReadOnly = visning === VisningModus.LÅST_MED_ENDRE || visning === VisningModus.LÅST_UTEN_ENDRE;
    setVisning(visning);
    setFormReadOnly(formReadOnly);
  }, [flyt.aktivtSteg, readOnly, erAktivtSteg]);

  function avbrytEndringClick() {
    setVisning(VisningModus.LÅST_MED_ENDRE);
    setFormReadOnly(true);
  }

  function onEndreClick() {
    setVisning(VisningModus.AKTIV_MED_AVBRYT);
    setFormReadOnly(false);
  }

  function onBekreftClick() {
    setVisning(VisningModus.LÅST_MED_ENDRE);
    setFormReadOnly(true);
  }

  return {
    visning: visning,
    formReadOnly: formReadOnly,
    actions: {
      avbrytEndringClick: avbrytEndringClick,
      onEndreClick: onEndreClick,
      onBekreftClick: onBekreftClick,
    },
  };
}

/**
 * Frontend antar at steget inneholder en tidligere vurdering dersom det har blitt rendret og ikke er aktivtSteg
 *
 * | readOnly | erAktivtSteg | resultat             |
 * |----------|--------------|----------------------|
 * | False    | False        | LÅST_MED_ENDRE       |
 * | True     | True         | LÅST_UTEN_ENDRE      |
 * | True     | False        | LÅST_UTEN_ENDRE      |
 * | False    | True         | AKTIV_UTEN_VURDERING |
 */

export function hentVisning(readOnly: boolean, erAktivtSteg: boolean): VisningModus {
  if (readOnly) {
    return VisningModus.LÅST_UTEN_ENDRE;
  } else if (erAktivtSteg && !readOnly) {
    return VisningModus.AKTIV_UTEN_AVBRYT;
  } else {
    return VisningModus.LÅST_MED_ENDRE;
  }
}
