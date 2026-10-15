'use client';

import { BodyShort, Button, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { StønadsperiodeGrunnlag, StønadsperiodeVurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import { TableStyled } from 'components/tablestyled/TableStyled';
import { KravTag } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodetabell/KravTag';
import { getJaEllerNei } from 'lib/utils/form';

interface Props {
  grunnlag: StønadsperiodeGrunnlag;
  readOnly: boolean;
  valgteKrav: string[];
  onToggleValgtKrav: (referanse: string) => void;
}

export const StønadsperiodeTabell = ({ grunnlag, valgteKrav, onToggleValgtKrav, readOnly }: Props) => {
  const rader = [
    ...grunnlag.vedtatteVurderinger.map((vedtatt) => ({ status: 'Vedtatt', ...vedtatt })),
    ...grunnlag.nyeVurderinger.map((ny) => ({ status: 'Ny', ...ny })),
  ];

  const skalViseEndreValg = false; // TODO Denne funksjonaliteten er satt på vent

  return (
    <VStack gap={'space-16'}>
      <Heading size={'xsmall'}>Brukerens krav om AAP</Heading>
      <TableStyled size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Relevant krav</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Vurderes fra</Table.HeaderCell>
            <Table.HeaderCell>Vurdert av</Table.HeaderCell>
            {skalViseEndreValg && <Table.HeaderCell>Valg</Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rader.map((rad, index) => (
            <Table.ExpandableRow key={index} content={<ExpandableRowContent rad={rad} />}>
              <Table.DataCell textSize={"small"}>{rad.referanse}</Table.DataCell>
              <Table.DataCell>
                <KravTag type={rad.relevantKravType.type} />
              </Table.DataCell>
              <Table.DataCell textSize={"small"}>{formaterDatoForFrontend(rad.startDato)}</Table.DataCell>
              <Table.DataCell textSize={'small'}>{`${rad.vurdertAv} (${formaterDatoForFrontend(rad.opprettet)})`}</Table.DataCell>
              {skalViseEndreValg && (
                <Table.DataCell>
                  <Button
                    type="button"
                    size="small"
                    variant={valgteKrav.includes(rad.referanse) ? 'primary' : 'secondary'}
                    onClick={() => onToggleValgtKrav(rad.referanse)}
                    disabled={readOnly}
                  >
                    {valgteKrav.includes(rad.referanse) ? 'Avbryt' : 'Endre'}
                  </Button>
                </Table.DataCell>
              )}
            </Table.ExpandableRow>
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};

const ExpandableRowContent = ({ rad }: { rad: StønadsperiodeVurdering }) => {
  return (
    <VStack gap={'space-8'}>
      <VStack>
        <LabelValue value={rad.referanse} label={'Referanse'} />
        <LabelValue value={formaterDatoForFrontend(rad.startDato)} label={'Start dato'} />
        <LabelValue value={formaterDatoForFrontend(rad.opprettet)} label={'Opprettet'} />
        <LabelValue value={rad.vurdertAv} label={'Vurdert av'} />
      </VStack>
      <VStack>
        <LabelValue value={rad.begrunnelse} label={'Begrunnelse'} />
        <LabelValue value={getJaEllerNei(rad.harGjenværendeKvote)} label={'Har gjenværende kvote?'} />
        <LabelValue value={getJaEllerNei(rad.harHattOrdinærSiste52Uker)} label={'Har hatt ordinær siste 52 uker?'} />
      </VStack>
    </VStack>
  );
};

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <HStack gap={'space-4'}>
      <BodyShort size={'small'} weight={'semibold'}>
        {label}
      </BodyShort>
      <BodyShort size={'small'}>{value}</BodyShort>
    </HStack>
  );
}
