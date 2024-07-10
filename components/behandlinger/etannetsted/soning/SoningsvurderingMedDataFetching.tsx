import {Soningsvurdering} from "./Soningsvurdering";
import {hentSoningsvurdering} from "../../../../lib/services/saksbehandlingservice/saksbehandlingService";

interface Props {
  behandlingsreferanse: string;
  behandlingsversjon: number;
  readOnly: boolean;
}

export const SoningsvurderingMedDataFetching = async ({behandlingsreferanse, behandlingsversjon, readOnly}: Props) => {
  const soningsgrunnlag = await hentSoningsvurdering(behandlingsreferanse)

  return <Soningsvurdering
    behandlingsreferanse={behandlingsreferanse}
    behandlingVersjon={behandlingsversjon}
    grunnlag={soningsgrunnlag}
    readOnly={readOnly}/>
}
