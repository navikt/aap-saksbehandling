interface Props {
  behandlingsReferanse: string;
}

export const VisBeregningMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  // const grunnlag = await hentBeregningsGrunnlag(behandlingsReferanse);
  console.log(behandlingsReferanse);

  // return <VisBeregning grunnlag={grunnlag} />;
};
