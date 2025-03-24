import { SamordningAndreStatligeYtelser } from 'components/behandlinger/underveis/samordningandrestatlige/SamordningAndreStatligeYtelser';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}
export const SamordningAndreStatligeYtelserMedDatafetching = ({ behandlingVersjon, readOnly }: Props) => {
  return <SamordningAndreStatligeYtelser behandlingVersjon={behandlingVersjon} readOnly={readOnly} />;
};
