import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const YrkesskadeMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  return (
    <Yrkesskade readOnly={readOnly} behandlingVersjon={behandlingVersjon} behandlingsReferanse={behandlingsReferanse} />
  );
};
