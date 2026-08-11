import { Button, Table, Tag } from '@navikt/ds-react';
import { KravGrunnlag, KravVurdering, KravVurderingLøsning } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import {
  finnOverstyrMuligRettFra,
  finnOverstyrMuligRettFraFraLøsning,
  finnSøknadsdato,
  finnSøknadsdatoFraLøsning,
  formaterKravtype,
  kravVurderingTilFormFields,
} from 'components/behandlinger/krav/kravutils';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { useFormContext, useWatch } from 'react-hook-form';
import { KravFormFields } from 'components/behandlinger/krav/vurderkrav/VurderKravV2';

interface Props {
  grunnlag?: KravGrunnlag;
  readOnly: boolean;
}

export const KravTabellV2 = ({ grunnlag, readOnly }: Props) => {
  const form = useFormContext<KravFormFields>();
  const { control, getValues, setValue } = form;
  const valgteKrav = useWatch({ control, name: 'valgteKrav' }) ?? [];

  const toggleValgtKrav = (vurdering: KravVurdering) => {
    const gjeldende = getValues('valgteKrav') ?? [];
    const erÅpen = gjeldende.includes(vurdering.referanse);

    if (erÅpen) {
      // Lukker boksen - nullstill feltene til opprinnelig verdi fra grunnlaget,
      // slik at ulagrede endringer forkastes.
      setValue(`vurderinger.${vurdering.referanse}`, kravVurderingTilFormFields(vurdering));
    }

    const nyeValgteKrav = erÅpen
      ? gjeldende.filter((r) => r !== vurdering.referanse)
      : [...gjeldende, vurdering.referanse];
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
                <Table.DataCell textSize={'small'}>{vurdering.journalpostId.identifikator}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {journalpost ? formaterDatoForFrontend(journalpost.mottattTidspunkt) : '-'}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterKravtype(vurdering.type)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterSøknadsdatoRad(vurdering)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterOverstyrMuligRettFraRad(vurdering)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{vurdering.vurdertAv}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Tag variant="alt1" size="small">
                    Ny
                  </Tag>
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Button
                    type="button"
                    size="small"
                    variant={valgteKrav.includes(vurdering.referanse) ? 'primary' : 'secondary'}
                    onClick={() => toggleValgtKrav(vurdering)}
                    disabled={readOnly}
                  >
                    {valgteKrav.includes(vurdering.referanse) ? 'Lukk' : 'Endre'}
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
                    onClick={() => toggleValgtKrav(vurdering)}
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
