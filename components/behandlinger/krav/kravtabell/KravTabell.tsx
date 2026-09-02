import { Button, Table, Tag } from '@navikt/ds-react';
import { KravGrunnlag, KravVurdering, KravVurderingLøsning } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import {
  finnOverstyrMuligRettFra,
  finnOverstyrMuligRettFraFraLøsning,
  finnSøknadsdato,
  finnSøknadsdatoFraLøsning,
  formaterKravtype,
  hentOriginaleFormFelter,
} from 'components/behandlinger/krav/kravutils';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { useFormContext, useWatch } from 'react-hook-form';
import { KravFormFields } from 'components/behandlinger/krav/vurderkrav/VurderKrav';

interface Props {
  grunnlag?: KravGrunnlag;
  readOnly: boolean;
}

export const KravTabell = ({ grunnlag, readOnly }: Props) => {
  const form = useFormContext<KravFormFields>();
  const { control, getValues, setValue } = form;
  const valgteKrav = useWatch({ control, name: 'valgteKrav' }) ?? [];

  const toggleValgtKrav = (referanse: string) => {
    const gjeldende = getValues('valgteKrav') ?? [];
    const erÅpen = gjeldende.includes(referanse);

    if (erÅpen) {
      const originaleFelter = hentOriginaleFormFelter(grunnlag, referanse);
      if (originaleFelter) {
        setValue(`vurderinger.${referanse}`, originaleFelter);
      }
    }

    const nyeValgteKrav = erÅpen ? gjeldende.filter((r) => r !== referanse) : [...gjeldende, referanse];
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
              (søknad) => søknad.journalpostId.identifikator === vurdering.journalpostId.identifikator
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
                    onClick={() => toggleValgtKrav(vurdering.referanse)}
                    disabled={readOnly}
                  >
                    {valgteKrav.includes(vurdering.referanse) ? 'Lukk' : 'Endre'}
                  </Button>
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}

          {grunnlag?.vedtatteVurderinger.map((vurdering) => {
            return (
              <Table.ExpandableRow content={vurdering.begrunnelse} key={vurdering.referanse}>
                <Table.DataCell textSize={'small'}>{vurdering.journalpostId.identifikator}</Table.DataCell>
                <Table.DataCell textSize={'small'}>mottat tidspunkt på journalpost</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterKravtype(vurdering.type)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterSøknadsdatoRad(vurdering)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterOverstyrMuligRettFraRad(vurdering)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{vurdering.vurdertAv}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Tag variant="success" size="small">
                    Vedtatt
                  </Tag>
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Button
                    type="button"
                    size="small"
                    variant={valgteKrav.includes(vurdering.referanse) ? 'primary' : 'secondary'}
                    onClick={() => toggleValgtKrav(vurdering.referanse)}
                    disabled={readOnly}
                  >
                    {valgteKrav.includes(vurdering.referanse) ? 'Lukk' : 'Endre'}
                  </Button>
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}

          {grunnlag?.søknaderUtenKravvurdering.map((søknad) => {
            const referanse = søknad.journalpostId.identifikator;

            return (
              <Table.ExpandableRow content="Søknaden har ikke en kravvurdering ennå." key={referanse}>
                <Table.DataCell textSize={'small'}>{søknad.journalpostId.identifikator}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(søknad.mottattTidspunkt)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>-</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(søknad.mottattTidspunkt)}</Table.DataCell>
                <Table.DataCell textSize={'small'}>-</Table.DataCell>
                <Table.DataCell textSize={'small'}>-</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Tag variant="warning" size="small">
                    Må vurderes
                  </Tag>
                </Table.DataCell>
                <Table.DataCell textSize={'small'}></Table.DataCell>
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
