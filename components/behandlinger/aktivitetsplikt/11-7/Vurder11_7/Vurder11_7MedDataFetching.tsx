import { Vurder11_7 } from 'components/behandlinger/aktivitetsplikt/11-7/Vurder11_7/Vurder11_7';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const Vurder11_7MedDataFetching = ({ behandlingVersjon, readOnly }: Props) => {
  // TODO: Hent grunnlag

  return <Vurder11_7 behandlingVersjon={behandlingVersjon} readOnly={readOnly} />;
};
