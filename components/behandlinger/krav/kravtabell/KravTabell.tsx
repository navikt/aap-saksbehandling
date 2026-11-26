import { Button, Heading, Table, Tag } from '@navikt/ds-react';
import { KravGrunnlag, KravVurdering, KravVurderingForSøknad } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import {
  finnMuligRettFra,
  formaterKravtype,
  getKravVurderingerForSøknad,
  hentOriginaleFormFelter,
} from 'components/behandlinger/krav/vurderKravUtils';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { useFormContext, useWatch } from 'react-hook-form';
import { KravFormFields } from 'components/behandlinger/krav/vurderkrav/VurderKrav';
import { KravTabellRadInnhold } from 'components/behandlinger/krav/kravtabell/KravTabellRadInnhold';

interface Props {
  grunnlag: KravGrunnlag;
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

  const gjeldendeVurderinger = getKravVurderingerForSøknad(grunnlag.gjeldendeVurderinger);
  const nyeVurderingerReferanser = new Set(getKravVurderingerForSøknad(grunnlag.nyeVurderinger).map((v) => v.referanse));

  return (
    <>
      <Heading size="xsmall">Søknader</Heading>
      <TableStyled size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>JournalpostId</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Mulig rett fra</Table.HeaderCell>
            <Table.HeaderCell>Vurdert av</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            {!readOnly && <Table.HeaderCell>Valg</Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {gjeldendeVurderinger.map((vurdering) => (
            <KravRad
              key={vurdering.referanse}
              vurdering={vurdering}
              status={nyeVurderingerReferanser.has(vurdering.referanse) ? 'Ny' : 'Vedtatt'}
              readOnly={readOnly}
              erValgt={valgteKrav.includes(vurdering.referanse)}
              onToggle={toggleValgtKrav}
            />
          ))}

          {grunnlag.søknaderUtenKravvurdering.map((søknad) => {
            const referanse = søknad.journalpostId.identifikator;

            return (
              <Table.ExpandableRow content="Søknaden har ikke en kravvurdering ennå." key={referanse}>
                <Table.DataCell textSize={'small'}>{søknad.journalpostId.identifikator}</Table.DataCell>
                <Table.DataCell textSize={'small'}>-</Table.DataCell>
                <Table.DataCell textSize={'small'}>-</Table.DataCell>
                <Table.DataCell textSize={'small'}>-</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <Tag variant="warning" size="small">
                    Må vurderes
                  </Tag>
                </Table.DataCell>
                {!readOnly && <Table.DataCell textSize={'small'}></Table.DataCell>}
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </TableStyled>
    </>
  );
};

interface KravRadProps {
  vurdering: KravVurderingForSøknad;
  status: 'Ny' | 'Vedtatt';
  readOnly: boolean;
  erValgt: boolean;
  onToggle: (referanse: string) => void;
}

const KravRad = ({ vurdering, status, readOnly, erValgt, onToggle }: KravRadProps) => (
  <Table.ExpandableRow content={<KravTabellRadInnhold rad={vurdering} />}>
    <Table.DataCell textSize={'small'}>{vurdering.journalpostId.identifikator}</Table.DataCell>
    <Table.DataCell textSize={'small'}>{formaterKravtype(vurdering.type)}</Table.DataCell>
    <Table.DataCell textSize={'small'}>{formaterOverstyrMuligRettFraRad(vurdering)}</Table.DataCell>
    <Table.DataCell textSize={'small'}>{vurdering.vurdertAv}</Table.DataCell>
    <Table.DataCell textSize={'small'}>
      <Tag variant={status === 'Ny' ? 'alt1' : 'success'} size="small">
        {status}
      </Tag>
    </Table.DataCell>
    {!readOnly && (
      <Table.DataCell textSize={'small'}>
        <Button
          type="button"
          size="small"
          variant={erValgt ? 'primary' : 'secondary'}
          onClick={() => onToggle(vurdering.referanse)}
        >
          {erValgt ? 'Lukk' : 'Endre'}
        </Button>
      </Table.DataCell>
    )}
  </Table.ExpandableRow>
);

function formaterOverstyrMuligRettFraRad(vurdering: KravVurdering) {
  const dato = finnMuligRettFra(vurdering);
  return dato ? formaterDatoForFrontend(dato) : '-';
}
