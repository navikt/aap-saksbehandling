import { Vurder11_9 } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9';
import { hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

// TODO: Erstatt typer når backend er klar

export type Vurdering11_9 = {
  id: string;
  begrunnelse: string;
  dato: string;
  brudd: Brudd;
  grunn: Grunn;
};

export type Vurder11_9Grunnlag = {
  harTilgangTilÅSaksbehandle: boolean;
  tidligereVurderinger: Vurdering11_9[];
  ikkeIverksatteVurderinger: Vurdering11_9[];
};

export type Brudd =
  | 'IKKE_MØTT_TIL_TILTAK'
  | 'IKKE_MØTT_TIL_BEHANDLING'
  | 'IKKE_MØTT_TIL_MØTE'
  | 'IKKE_SENDT_DOKUMENTASJON';

export type Grunn = 'IKKE_RIMELIG_GRUNN' | 'RIMELIG_GRUNN';

export const Vurder11_9MedDataFetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  // TODO: Hent inn reelt grunnlag
  const grunnlag: { data: Vurder11_9Grunnlag } = {
    data: {
      harTilgangTilÅSaksbehandle: true,
      tidligereVurderinger: [
        {
          id: '1',
          begrunnelse: 'Noe',
          dato: '2025-05-01',
          brudd: 'IKKE_MØTT_TIL_TILTAK',
          grunn: 'IKKE_RIMELIG_GRUNN',
        },
        {
          id: '2',
          begrunnelse: 'Noe annet',
          dato: '2025-05-02',
          brudd: 'IKKE_MØTT_TIL_BEHANDLING',
          grunn: 'IKKE_RIMELIG_GRUNN',
        },
      ],
      ikkeIverksatteVurderinger: [
        {
          id: '3',
          begrunnelse: 'En mer utfyllende begrunnelse',
          dato: '2025-05-02',
          brudd: 'IKKE_MØTT_TIL_BEHANDLING',
          grunn: 'IKKE_RIMELIG_GRUNN',
        },
      ],
    },
  };

  const initialMellomlagretVurdering = await hentMellomlagring(behandlingsreferanse, Behovstype.VURDER_BRUDD_11_9_KODE);

  return (
    <Vurder11_9
      grunnlag={grunnlag.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
    />
  );
};
