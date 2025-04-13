import { hentDigitaliseringGrunnlag, hentFlyt } from 'lib/services/postmottakservice/postmottakservice';
import { DigitaliserDokument } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';

interface Props {
  behandlingsreferanse: string;
}
export const DigitaliserDokumentMedDatafetching = async ({ behandlingsreferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsreferanse);
  const isReadOnly: boolean = !!flyt.visning.readOnly;
  const grunnlag = await hentDigitaliseringGrunnlag(behandlingsreferanse);

  return (
    <DigitaliserDokument
      behandlingsVersjon={flyt.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      grunnlag={grunnlag}
      readOnly={isReadOnly}
    />
  );
};
