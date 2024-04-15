import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
}

export const FastsettArbeidsevneMedDataFetching = async ({ behandlingsReferanse, readOnly }: Props) => {
  return <FastsettArbeidsevne behandlingsReferanse={behandlingsReferanse} readOnly={readOnly} />;
};
