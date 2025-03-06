import { hentDigitaliseringGrunnlag, hentFlyt } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { DigitaliserDokument } from './DigitaliserDokument.tsx';

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
