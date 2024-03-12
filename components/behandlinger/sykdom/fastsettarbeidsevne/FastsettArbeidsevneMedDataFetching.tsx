import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';

interface Props {
  behandlingsReferanse: string;
}

export const FastsettArbeidsevneMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  return <FastsettArbeidsevne behandlingsReferanse={behandlingsReferanse} />;
};
