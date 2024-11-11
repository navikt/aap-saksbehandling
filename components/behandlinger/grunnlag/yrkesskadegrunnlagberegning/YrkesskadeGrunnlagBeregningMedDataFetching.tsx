import { YrkesskadeGrunnlagBeregning } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregning';

interface Props {
  readOnly: boolean;
  behandlingVersjon: number;
}

export const YrkesskadeGrunnlagBeregningMedDataFetching = async ({ behandlingVersjon, readOnly }: Props) => {
  return <YrkesskadeGrunnlagBeregning behandlingVersjon={behandlingVersjon} readOnly={readOnly} />;
};
