import { hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { SykestipendVurdering } from 'components/behandlinger/sykdom/student/sykestipend/SykestipendVurdering';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const SykestipendMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [initialMellomlagretVurdering] = await Promise.all([
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SAMORDNING_SYKESTIPEND_KODE),
  ]);

  if (!skalViseSteg(stegData, false)) {
    return null;
  }

  return (
    <SykestipendVurdering
      readOnly={stegData.readOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
