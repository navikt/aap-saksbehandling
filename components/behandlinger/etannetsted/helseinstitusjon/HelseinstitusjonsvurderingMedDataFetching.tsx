import { Helseinstitusjonsvurdering } from 'components/behandlinger/etannetsted/helseinstitusjon/Helseinstitusjonsvurdering';
import { hentHelseInstitusjonsVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';

type Props = {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const HelseinstitusjonsvurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentHelseInstitusjonsVurdering(behandlingsreferanse);
  console.log('grunnlag', grunnlag);
  return <Helseinstitusjonsvurdering grunnlag={grunnlag} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />;
};
