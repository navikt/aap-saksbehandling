'use client';

import { BodyShort, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { StønadsperiodeGrunnlag, StønadsperiodeVurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

import { TableStyled } from 'components/tablestyled/TableStyled';
import { KravTag } from 'components/behandlinger/krav/stønadsperiode/stønadsperiodetabell/KravTag';
import { getJaEllerNei } from 'lib/utils/form';

interface Props {
  grunnlag: StønadsperiodeGrunnlag;
}

export const StønadsperiodeTabell = ({ grunnlag }: Props) => {
  const rader = [
    ...grunnlag.vedtatteVurderinger.map((vedtatt) => ({ status: 'Vedtatt', ...vedtatt })),
    ...grunnlag.nyeVurderinger.map((ny) => ({ status: 'Ny', ...ny })),
  ];

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
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rader.map((rad, index) => (
            <Table.ExpandableRow key={index} content={<ExpandableRowContent rad={rad} />}>
              <Table.DataCell textSize={'small'}>{rad.referanse}</Table.DataCell>
              <Table.DataCell>
                <KravTag type={rad.relevantKravType.type} />
              </Table.DataCell>
              <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(rad.startDato)}</Table.DataCell>
              <Table.DataCell
                textSize={'small'}
              >{`${rad.vurdertAv} (${formaterDatoForFrontend(rad.opprettet)})`}</Table.DataCell>
            </Table.ExpandableRow>
          ))}
        </Table.Body>
      </TableStyled>
    </VStack>
  );
};

const ExpandableRowContent = ({ rad }: { rad: StønadsperiodeVurdering }) => {
  return (
    <VStack gap={'space-16'}>
      <VStack>
        <LabelValueHorizontal value={rad.referanse} label={'Referanse'} />
        <LabelValueHorizontal value={formaterDatoForFrontend(rad.opprettet)} label={'Opprettet'} />
        <LabelValueHorizontal value={rad.vurdertAv} label={'Vurdert av'} />
      </VStack>
      <VStack gap={'space-4'}>
        <LabelValueVertical value={rad.begrunnelse} label={'Vilkårsvurdering'} />
        <LabelValueVertical
          value={getJaEllerNei(rad.harGjenværendeKvote)}
          label={'Har brukeren en gjenværende § 11-12 kvote å gjeninntre i?'}
        />
        <LabelValueVertical
          value={getJaEllerNei(rad.harHattOrdinærSiste52Uker)}
          label={'Har brukeren hatt ordinær AAP innen 52 uker før datoen kravet skal vurderes for?'}
        />
        <LabelValueVertical value={formaterDatoForFrontend(rad.startDato)} label={'Dato for ny rettighet'} />
      </VStack>
    </VStack>
  );
};

function LabelValueVertical({ label, value }: { label: string; value: string }) {
  return (
    <VStack>
      <BodyShort size={'small'} weight={'semibold'}>
        {label}
      </BodyShort>
      <BodyShort size={'small'}>{value}</BodyShort>
    </VStack>
  );
}

function LabelValueHorizontal({ label, value }: { label: string; value: string }) {
  return (
    <HStack gap={'space-4'}>
      <BodyShort size={'small'} weight={'semibold'}>
        {label}
      </BodyShort>
      <BodyShort size={'small'}>{value}</BodyShort>
    </HStack>
  );
}
