import { Helseinstitusjonsvurdering } from 'components/behandlinger/etannetsted/helseinstitusjon/Helseinstitusjonsvurdering';

type Props = {
  behandlingVersjon: number;
  readOnly: boolean;
};

export const HelseinstitusjonsvurderingMedDataFetching = ({ behandlingVersjon, readOnly }: Props) => {
  return <Helseinstitusjonsvurdering readOnly={readOnly} behandlingVersjon={behandlingVersjon} />;
};
