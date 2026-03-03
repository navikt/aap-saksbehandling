import { Barnepensjon } from 'components/behandlinger/samordning/barnepensjon/Barnepensjon';

interface Props {
  behandlingsreferanse: string;
}

export const BarnePensjonMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  return <Barnepensjon behandlingVersjon={1} readOnly={false} initialMellomlagretVurdering={undefined} />;
};
