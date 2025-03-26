import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtak';

interface Props {
  behandlingVersjon: number;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingVersjon }: Props) => {
  return <ForeslåVedtak behandlingVersjon={behandlingVersjon} />;
};
