import { hentForutgåendeMedlemskapsVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { AutomatiskVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/automatiskvurderingforutgåendemedlemskap/AutomatiskVurderingForutgåendeMedlemskap';

interface Props {
  behandlingsReferanse: string;
}

export const AutomatiskVurderingForutgåendeMedlemskapMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentForutgåendeMedlemskapsVurdering(behandlingsReferanse);

  return <AutomatiskVurderingForutgåendeMedlemskap vurdering={grunnlag} />;
};
