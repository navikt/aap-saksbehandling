'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { CheckmarkIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { BodyShort, Label, Table, VStack } from '@navikt/ds-react';
import { AlderGrunnlag, AvslagÅrsak } from 'lib/types/types';

import styles from './Alder.module.css';
import { addYears, differenceInYears } from 'date-fns';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { mapUtfallTilTekst } from 'lib/utils/oversettelser';

interface Props {
  grunnlag: AlderGrunnlag;
}

export const Alder = ({ grunnlag }: Props) => {
  const inneholderPerioderMedIkkeOppfylt = grunnlag.vilkårsperioder.find(
    (vilkårsperiode) => vilkårsperiode.utfall === 'IKKE_OPPFYLT'
  );

  return (
    <VilkårsKort heading={'§ 11-4 Alder'} steg={'VURDER_ALDER'}>
      <VStack gap={'4'}>
        <div className={'flex-column'}>
          <div>
            <Label size={'small'}>Fødselsdato</Label>
            <BodyShort size={'small'}>
              <span>{formaterDatoForFrontend(grunnlag.fødselsdato)} </span>
              <span>{`(Brukeren er ${kalkulerAlder(new Date(grunnlag.fødselsdato))} i dag)`}</span>
            </BodyShort>
          </div>

          <div>
            <Label size={'small'}>Dato brukeren blir 67 år</Label>
            <BodyShort size={'small'}>
              <span>{formaterDatoForFrontend(addYears(new Date(grunnlag.fødselsdato), 67))}</span>
            </BodyShort>
          </div>
        </div>

        <TableStyled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
              <Table.HeaderCell scope="col">Til og med</Table.HeaderCell>
              {inneholderPerioderMedIkkeOppfylt && <Table.HeaderCell scope="col">Avslagsårsak</Table.HeaderCell>}
              <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {grunnlag.vilkårsperioder.map((vilkårsperiode, index) => {
              return (
                <Table.Row key={index}>
                  <Table.DataCell textSize={'small'}>
                    {formaterDatoForFrontend(vilkårsperiode.periode.fom)}
                  </Table.DataCell>
                  <Table.DataCell textSize={'small'}>
                    {formaterDatoForFrontend(vilkårsperiode.periode.tom)}
                  </Table.DataCell>
                  {inneholderPerioderMedIkkeOppfylt && (
                    <Table.DataCell textSize={'small'}>
                      {vilkårsperiode.avslagsårsak ? mapAvslagÅrsakTilTekst(vilkårsperiode.avslagsårsak) : ''}
                    </Table.DataCell>
                  )}
                  <Table.DataCell textSize={'small'}>
                    <div className={styles.utfall}>
                      {vilkårsperiode.utfall === 'OPPFYLT' ? (
                        <CheckmarkIcon title="Oppfylt" className={styles.oppfyltIcon} />
                      ) : (
                        <ExclamationmarkTriangleIcon title={'Ikke oppfylt'} className={styles.avslåttIcon} />
                      )}

                      <span>{mapUtfallTilTekst(vilkårsperiode.utfall)}</span>
                    </div>
                  </Table.DataCell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </TableStyled>
      </VStack>
    </VilkårsKort>
  );
};

function mapAvslagÅrsakTilTekst(årsak: AvslagÅrsak): string {
  switch (årsak) {
    case 'BRUKER_OVER_67':
      return 'Brukeren er over 67 år.';
    case 'BRUKER_UNDER_18':
      return 'Brukeren er under 18 år.';
    default:
      throw new Error('Kunne ikke finne påkrevd årsak.');
  }
}

export function kalkulerAlder(fødselsdato: Date): string {
  return `${differenceInYears(new Date(), fødselsdato)} år`;
}
