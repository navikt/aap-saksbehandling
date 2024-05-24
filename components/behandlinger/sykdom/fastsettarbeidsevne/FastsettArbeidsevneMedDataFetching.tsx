import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const FastsettArbeidsevneMedDataFetching = async ({ behandlingVersjon, readOnly }: Props) => {
  return <FastsettArbeidsevne readOnly={readOnly} behandlingVersjon={behandlingVersjon} />;
};
