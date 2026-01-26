import { useEffect, useState } from 'react';
import { usePostmottakRequiredFlyt } from 'hooks/postmottak/PostmottakFlytHook';
import { StegType } from 'lib/types/postmottakTypes';
import { VisningModus, VisningState } from 'lib/types/visningTypes';
import { hentVisning, isFormReadOnly } from 'lib/utils/visning';

export function usePostmottakVilkårskortVisning(readOnly: boolean, steg: StegType): VisningState {
  const { flyt } = usePostmottakRequiredFlyt();

  const erAktivtSteg = flyt.aktivtSteg === steg;
  const initialVisningModus = hentVisning(readOnly, erAktivtSteg, undefined);
  const initialFormReadOnly = isFormReadOnly(initialVisningModus);

  const [visning, setVisning] = useState<VisningModus>(initialVisningModus);
  const [formReadOnly, setFormReadOnly] = useState<boolean>(initialFormReadOnly);

  useEffect(() => {
    const visning = hentVisning(readOnly, erAktivtSteg, undefined);
    const formReadOnly = isFormReadOnly(visning);
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
    visningModus: visning,
    formReadOnly: formReadOnly,
    visningActions: {
      avbrytEndringClick: avbrytEndringClick,
      onEndreClick: onEndreClick,
      onBekreftClick: onBekreftClick,
    },
  };
}
