'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { PersonTallShortFillIcon } from '@navikt/aksel-icons';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { BodyShort, Label, Table } from '@navikt/ds-react';
import { AlderGrunnlag, VilkårUtfall } from 'lib/types/types';

interface Props {
  grunnlag: AlderGrunnlag;
}

export const Alder = ({ grunnlag }: Props) => {
  return (
    <VilkårsKort heading={'Alder'} steg={'VURDER_ALDER'} icon={<PersonTallShortFillIcon fontSize={'1.5rem'} />}>
      <div>
        <Label>Fødselsdato</Label>
        <BodyShort>{formaterDatoForFrontend(grunnlag.fødselsdato)}</BodyShort>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Utfall</Table.HeaderCell>
            <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
            <Table.HeaderCell scope="col">Til og med</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.vilkårsperioder.map((vilkårsperiode, index) => {
            return (
              <Table.Row key={index}>
                <Table.DataCell>{mapUtfallTilTekst(vilkårsperiode.utfall)}</Table.DataCell>
                <Table.DataCell>{formaterDatoForFrontend(vilkårsperiode.periode.fom)}</Table.DataCell>
                <Table.DataCell>{formaterDatoForFrontend(vilkårsperiode.periode.tom)}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </VilkårsKort>
  );
};

function mapUtfallTilTekst(utfall: VilkårUtfall): string {
  switch (utfall) {
    case 'OPPFYLT':
      return 'Oppfylt';
    case 'IKKE_OPPFYLT':
      return 'Ikke oppfylt';
    case 'IKKE_RELEVANT':
      return 'Ikke relevant';
    case 'IKKE_VURDERT':
      return 'Ikke vurdert';
  }
}
