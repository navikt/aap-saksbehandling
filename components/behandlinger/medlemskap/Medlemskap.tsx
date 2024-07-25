'use client';
import React from 'react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import Image from 'next/image';
import Medlemskapkatt from '../../../public/medlemskapkatt.jpg';
import { MedlemskapGrunnlag } from 'lib/types/types';
import { Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  grunnlag: MedlemskapGrunnlag;
}

export const Medlemskap = async ({ grunnlag }: Props) => {
  const unntakListe = grunnlag?.medlemskap?.unntak ?? [];
  return (
    <VilkårsKort heading={'Medlemskap'} steg={'VURDER_MEDLEMSKAP'}>
      {unntakListe.length > 0 && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Fra</Table.HeaderCell>
              <Table.HeaderCell>Til</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Status årsak</Table.HeaderCell>
              <Table.HeaderCell>Er medlem</Table.HeaderCell>
              <Table.HeaderCell>Grunnlag</Table.HeaderCell>
              <Table.HeaderCell>Lovvalg</Table.HeaderCell>
              <Table.HeaderCell>Er helsedel</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {unntakListe.map((unntak, index) => (
              <Table.Row key={index}>
                <Table.DataCell>{formaterDatoForFrontend(unntak.periode.fom)}</Table.DataCell>
                <Table.DataCell>{formaterDatoForFrontend(unntak.periode.tom)}</Table.DataCell>
                <Table.DataCell>{getTekstligVerdiForStatus(unntak.verdi.status)}</Table.DataCell>
                <Table.DataCell>{unntak.verdi.statusaarsak}</Table.DataCell>
                <Table.DataCell>{unntak.verdi.medlem ? 'Ja' : 'Nei'}</Table.DataCell>
                <Table.DataCell>{unntak.verdi.grunnlag}</Table.DataCell>
                <Table.DataCell>{unntak.verdi.lovvalg}</Table.DataCell>
                <Table.DataCell>{unntak.verdi.helsedel ? 'Ja' : 'Nei'}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      <Image src={Medlemskapkatt} alt="medlemskap-katt" width={500} height={500} />
    </VilkårsKort>
  );
};

// Tar utgangspunkt i verdiene her https://confluence.adeo.no/pages/viewpage.action?spaceKey=FEL&title=Gyldige+verdier+for+kodeverk+i+MEDL
const getTekstligVerdiForStatus = (status: string) => {
  switch (status) {
    case 'GYLD':
      return 'Gyldig';
    case 'AVST':
      return 'Avvist';
    case 'UAVK':
      return 'Uavklart';
    default:
      return '';
  }
};
