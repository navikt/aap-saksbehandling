import { useEffect, useState } from 'react';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { MellomlagretVurdering, StegType } from 'lib/types/types';

export enum VisningModus {
  AKTIV_UTEN_AVBRYT = 'AKTIV_UTEN_AVBRYT',
  AKTIV_MED_AVBRYT = 'AKTIV_MED_AVBRYT',
  LÅST_MED_ENDRE = 'LÅST_MED_ENDRE',
  LÅST_UTEN_ENDRE = 'LÅST_UTEN_ENDRE',
}

interface VisningState {
  visningModus: VisningModus;
  formReadOnly: boolean;
  visningActions: VisningActions;
  erAktivUtenAvbryt: boolean;
}

export interface VisningActions {
  avbrytEndringClick: () => void;
  onEndreClick: () => void;
  onBekreftClick: () => void;
}

export function useVilkårskortVisning(
  readOnly: boolean,
  steg: StegType,
  mellomlagring: MellomlagretVurdering | undefined
): VisningState {
  const { flyt } = useRequiredFlyt();

  const erAktivtSteg = flyt.aktivtSteg === steg;
  const initialVisningModus = hentVisning(readOnly, erAktivtSteg, mellomlagring);
  const initialFormReadOnly =
    initialVisningModus === VisningModus.LÅST_MED_ENDRE || initialVisningModus === VisningModus.LÅST_UTEN_ENDRE;

  const [visning, setVisning] = useState<VisningModus>(initialVisningModus);
  const [formReadOnly, setFormReadOnly] = useState<boolean>(initialFormReadOnly);

  useEffect(() => {
    const visning = hentVisning(readOnly, erAktivtSteg, mellomlagring);
    const formReadOnly = visning === VisningModus.LÅST_MED_ENDRE || visning === VisningModus.LÅST_UTEN_ENDRE;
    setVisning(visning);
    setFormReadOnly(formReadOnly);
  }, [flyt.aktivtSteg, readOnly, erAktivtSteg, mellomlagring]);

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
    visningModus: visning,
    formReadOnly: formReadOnly,
    visningActions: {
      avbrytEndringClick: avbrytEndringClick,
      onEndreClick: onEndreClick,
      onBekreftClick: onBekreftClick,
    },
    erAktivUtenAvbryt: visning === VisningModus.AKTIV_UTEN_AVBRYT,
  };
}

/**
 * Frontend antar at steget inneholder en tidligere vurdering dersom det har blitt rendret og ikke er aktivtSteg
 *
 * | readOnly | erAktivtSteg | mellomlagring  | resultat            |
 * |----------|--------------|----------------|----------------------
 * | False    | False        | True           | AKTIV_MED_AVBRYT    |
 * | True     | True         | True           | LÅST_UTEN_ENDRE     | // TODO Hva skal vi gjøre her?
 * | True     | False        | True           | LÅST_UTEN_ENDRE     |
 * | False    | True         | True           | AKTIV_UTEN_AVBRYT   |
 * | True     | True         | False          | LÅST_UTEN_ENDRE     |
 * | False    | True         | False          | AKTIV_UTEN_AVBRYT   |
 * | True     | False        | False          | LÅST_UTEN_ENDRE     |
 * | False    | False        | False          | LÅST__MED_ENDRE     |
 */

export function hentVisning(
  readOnly: boolean,
  erAktivtSteg: boolean,
  mellomlagring: MellomlagretVurdering | undefined
): VisningModus {
  if (readOnly) {
    return VisningModus.LÅST_UTEN_ENDRE;
  }

  if (erAktivtSteg) {
    return VisningModus.AKTIV_UTEN_AVBRYT;
  }

  if (mellomlagring) {
    return VisningModus.AKTIV_MED_AVBRYT;
  }

  return VisningModus.LÅST_MED_ENDRE;
}
