export enum VisningModus {
  AKTIV_UTEN_AVBRYT = 'AKTIV_UTEN_AVBRYT',
  AKTIV_MED_AVBRYT = 'AKTIV_MED_AVBRYT',
  LÅST_MED_ENDRE = 'LÅST_MED_ENDRE',
  LÅST_UTEN_ENDRE = 'LÅST_UTEN_ENDRE',
}

export interface VisningState {
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
