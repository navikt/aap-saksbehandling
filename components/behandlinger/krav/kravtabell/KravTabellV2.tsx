import { Button, Table, Tag } from '@navikt/ds-react';
import { KravGrunnlag, KravVurdering, KravVurderingLøsning } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import {
  finnOverstyrMuligRettFra,
  finnOverstyrMuligRettFraFraLøsning,
  finnSøknadsdato,
  finnSøknadsdatoFraLøsning,
  formaterKravtype,
} from 'components/behandlinger/krav/kravutils';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { useFormContext, useWatch } from 'react-hook-form';
import { KravFormFields } from 'components/behandlinger/krav/vurderkrav/VurderKravV2';

interface Props {
  grunnlag?: KravGrunnlag;
}

export const KravTabellV2 = ({ grunnlag }: Props) => {
  const form = useFormContext<KravFormFields>();
  const { control, getValues, setValue } = form;
  const valgteKrav = useWatch({ control, name: 'valgteKrav' }) ?? [];

  const toggleValgtKrav = (referanse: string) => {
    const gjeldende = getValues('valgteKrav') ?? [];
    const nyeValgteKrav = gjeldende.includes(referanse)
      ? gjeldende.filter((r) => r !== referanse)
      : [...gjeldende, referanse];
    setValue('valgteKrav', nyeValgteKrav);
  };

  return (
    <>
      <TableStyled size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>JournalpostId</Table.HeaderCell>
            <Table.HeaderCell>Journalpost mottatt</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Søknadsdato</Table.HeaderCell>
            <Table.HeaderCell>Mulig rett fra</Table.HeaderCell>
            <Table.HeaderCell>Vurdert av</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Valg</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag?.nyeVurderinger.map((vurdering) => {
            const journalpost = grunnlag.søknader.find(
              (s) => s.journalpostId.identifikator === vurdering.journalpostId.identifikator
            );

            return (
              <Table.ExpandableRow content={vurdering.begrunnelse} key={vurdering.referanse}>
                <Table.DataCell>{vurdering.journalpostId.identifikator}</Table.DataCell>
                <Table.DataCell>
                  {journalpost ? formaterDatoForFrontend(journalpost.mottattTidspunkt) : '-'}
                </Table.DataCell>
                <Table.DataCell>{formaterKravtype(vurdering.type)}</Table.DataCell>
                <Table.DataCell>{formaterSøknadsdatoRad(vurdering)}</Table.DataCell>
                <Table.DataCell>{formaterOverstyrMuligRettFraRad(vurdering)}</Table.DataCell>
                <Table.DataCell>{vurdering.vurdertAv}</Table.DataCell>
                <Table.DataCell>
                  <Tag variant="alt1" size="small">
                    Ny
                  </Tag>
                </Table.DataCell>
                <Table.DataCell>
                  <Button
                    type="button"
                    size="small"
                    variant={valgteKrav.includes(vurdering.referanse) ? 'primary' : 'secondary'}
                    onClick={() => toggleValgtKrav(vurdering.referanse)}
                  >
                    {valgteKrav.includes(vurdering.referanse) ? 'Lukk' : 'Endre'}
                  </Button>
                  <Button
                    type="button"
                    size="small"
                    variant="tertiary"
                    onClick={() => console.log('Ikke implementert enda')}
                  >
                    Slett
                  </Button>
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}

          {/*{Object.entries(lokaleNyeKrav).map(([key, løsning]) => (*/}
          {/*  <Table.ExpandableRow content={løsning.begrunnelse} key={key}>*/}
          {/*    <Table.DataCell>{løsning.journalpostId.identifikator}</Table.DataCell>*/}
          {/*    <Table.DataCell>{formaterKravtype(løsning.kravType)}</Table.DataCell>*/}
          {/*    <Table.DataCell>{formaterSøknadsdatoFraLøsningRad(løsning)}</Table.DataCell>*/}
          {/*    <Table.DataCell>{formaterOverstyrFraLøsningRad(løsning)}</Table.DataCell>*/}
          {/*    <Table.DataCell>—</Table.DataCell>*/}
          {/*    <Table.DataCell>*/}
          {/*      <Tag variant="alt3" size="small">*/}
          {/*        Lagt til*/}
          {/*      </Tag>*/}
          {/*    </Table.DataCell>*/}
          {/*    <Table.DataCell>*/}
          {/*      <Button type="button" size="small" variant="secondary" onClick={() => console.log('Ikke implementert')}>*/}
          {/*        Endre*/}
          {/*      </Button>*/}
          {/*      <Button type="button" size="small" variant="tertiary" onClick={() => console.log('Ikke implementert')}>*/}
          {/*        Slett*/}
          {/*      </Button>*/}
          {/*    </Table.DataCell>*/}
          {/*  </Table.ExpandableRow>*/}
          {/*))}*/}

          {grunnlag?.vedtatteVurderinger.map((vurdering) => {
            return (
              <Table.ExpandableRow content={vurdering.begrunnelse} key={vurdering.referanse}>
                <Table.DataCell>{vurdering.journalpostId.identifikator}</Table.DataCell>
                <Table.DataCell>{formaterKravtype(vurdering.type)}</Table.DataCell>
                <Table.DataCell>{formaterSøknadsdatoRad(vurdering)}</Table.DataCell>
                <Table.DataCell>{formaterOverstyrMuligRettFraRad(vurdering)}</Table.DataCell>
                <Table.DataCell>{vurdering.vurdertAv}</Table.DataCell>
                <Table.DataCell>hehe</Table.DataCell>
                <Table.DataCell>
                  <Button
                    type="button"
                    size="small"
                    variant={valgteKrav.includes(vurdering.referanse) ? 'primary' : 'secondary'}
                    onClick={() => toggleValgtKrav(vurdering.referanse)}
                  >
                    {valgteKrav.includes(vurdering.referanse) ? 'Lukk' : 'Endre'}
                  </Button>
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </TableStyled>
    </>
  );
};

function formaterSøknadsdatoRad(vurdering: KravVurdering, løsning?: KravVurderingLøsning) {
  const dato = løsning ? finnSøknadsdatoFraLøsning(løsning)?.dato : finnSøknadsdato(vurdering)?.dato;
  return dato ? formaterDatoForFrontend(dato) : '-';
}

function formaterOverstyrMuligRettFraRad(vurdering: KravVurdering, løsning?: KravVurderingLøsning) {
  const dato = løsning ? finnOverstyrMuligRettFraFraLøsning(løsning)?.dato : finnOverstyrMuligRettFra(vurdering)?.dato;
  return dato ? formaterDatoForFrontend(dato) : '-';
}

function formaterSøknadsdatoFraLøsningRad(løsning: KravVurderingLøsning) {
  const dato = finnSøknadsdatoFraLøsning(løsning)?.dato;
  return dato ? formaterDatoForFrontend(dato) : '-';
}

function formaterOverstyrFraLøsningRad(løsning: KravVurderingLøsning) {
  const dato = finnOverstyrMuligRettFraFraLøsning(løsning)?.dato;
  return dato ? formaterDatoForFrontend(dato) : '-';
}
