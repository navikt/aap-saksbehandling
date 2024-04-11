import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';

interface Props {
  behandlingsReferanse: string;
  erBeslutter: boolean;
}

export const FastsettArbeidsevneMedDataFetching = async ({ behandlingsReferanse, erBeslutter }: Props) => {
  return <FastsettArbeidsevne behandlingsReferanse={behandlingsReferanse} erBeslutter={erBeslutter} />;
};
