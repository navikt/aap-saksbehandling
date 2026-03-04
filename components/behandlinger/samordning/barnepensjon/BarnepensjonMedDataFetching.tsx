import { Barnepensjon } from 'components/behandlinger/samordning/barnepensjon/Barnepensjon';
import { StegData } from 'lib/utils/steg';
import { hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const BarnePensjonMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  // TODO Hent grunnlag når det er klar fra backend
  const [initialMellomlagretVurdering] = await Promise.all([
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SAMORDNING_BARNEPENSJON_KODE),
  ]);

  return (
    <Barnepensjon
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
