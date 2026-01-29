import { useEffect, useState } from 'react';
import { useRequiredFlyt } from 'hooks/saksbehandling/FlytHook';
import { MellomlagretVurdering, StegType } from 'lib/types/types';
import { VisningModus, VisningState } from 'lib/types/visningTypes';
import { hentVisning, isFormReadOnly } from 'lib/utils/visning';

export function useVilkårskortVisning(
  readOnly: boolean,
  steg: StegType,
  mellomlagring: MellomlagretVurdering | undefined
): VisningState {
  const { flyt } = useRequiredFlyt();

  const erAktivtSteg = flyt.aktivtSteg === steg;
  const initialVisningModus = hentVisning(readOnly, erAktivtSteg, mellomlagring);
  const initialFormReadOnly = isFormReadOnly(initialVisningModus);
  const [visning, setVisning] = useState<VisningModus>(initialVisningModus);
  const [formReadOnly, setFormReadOnly] = useState<boolean>(initialFormReadOnly);

  useEffect(() => {
    const visning = hentVisning(readOnly, erAktivtSteg, mellomlagring);
    const formReadOnly = isFormReadOnly(visning);
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
