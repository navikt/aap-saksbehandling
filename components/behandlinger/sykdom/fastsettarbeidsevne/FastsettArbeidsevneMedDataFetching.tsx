import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const FastsettArbeidsevneMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  return (
    <FastsettArbeidsevne
      behandlingsReferanse={behandlingsReferanse}
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
