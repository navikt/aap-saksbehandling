import {
  AutomatiskVurderingAvLovvalgOgMedlemskap
} from "components/behandlinger/lovvalg/automatiskvurderingavlovvalgogmedlemskap/AutomatiskVurderingAvLovvalgOgMedlemskap";
import {hentAutomatiskLovvalgOgMedlemskapVurdering} from "lib/services/saksbehandlingservice/saksbehandlingService";

interface Props {
  behandlingsReferanse: string;
}

export const AutomatiskVurderingMedDataFetching = async ({behandlingsReferanse}: Props) => {
  const vurdering = await hentAutomatiskLovvalgOgMedlemskapVurdering(behandlingsReferanse);
  return <AutomatiskVurderingAvLovvalgOgMedlemskap vurdering={vurdering} />
}
