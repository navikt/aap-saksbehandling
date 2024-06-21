'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { CheckmarkCircleFillIcon, PersonTallShortFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { BodyShort, Label, Table } from '@navikt/ds-react';
import { AlderGrunnlag, AvslagÅrsak, VilkårUtfall } from 'lib/types/types';

import styles from './Alder.module.css';
import { addYears } from 'date-fns';

interface Props {
  grunnlag: AlderGrunnlag;
}

export const Alder = ({ grunnlag }: Props) => {
  const inneholderPerioderMedIkkeOppfylt = grunnlag.vilkårsperioder.find(
    (vilkårsperiode) => vilkårsperiode.utfall === 'IKKE_OPPFYLT'
  );

  return (
    <VilkårsKort heading={'Alder'} steg={'VURDER_ALDER'} icon={<PersonTallShortFillIcon fontSize={'1.5rem'} />}>
      <div className={'flex-column'}>
        <div>
          <Label>Fødselsdato</Label>
          <BodyShort>
            <span>{formaterDatoForFrontend(grunnlag.fødselsdato)}</span>
            <b>{`(Bruker er ${kalkulerAlder(new Date(grunnlag.fødselsdato))} i dag)`}</b>
          </BodyShort>
        </div>

        <div>
          <Label>Dato bruker blir 67 år</Label>
          <BodyShort>
            <span>{formaterDatoForFrontend(addYears(new Date(grunnlag.fødselsdato), 67))}</span>
          </BodyShort>
        </div>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Utfall</Table.HeaderCell>
            <Table.HeaderCell scope="col">Fra og med</Table.HeaderCell>
            <Table.HeaderCell scope="col">Til og med</Table.HeaderCell>
            {inneholderPerioderMedIkkeOppfylt && <Table.HeaderCell scope="col">Avslagsårsak</Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.vilkårsperioder.map((vilkårsperiode, index) => {
            return (
              <Table.Row key={index}>
                <Table.DataCell>
                  <div className={styles.utfall}>
                    {vilkårsperiode.utfall === 'OPPFYLT' ? (
                      <CheckmarkCircleFillIcon title="Oppfylt" className={styles.oppfyltIcon} />
                    ) : (
                      <XMarkOctagonFillIcon title={'Ikke oppfylt'} className={styles.avslåttIcon} />
                    )}

                    <span>{mapUtfallTilTekst(vilkårsperiode.utfall)}</span>
                  </div>
                </Table.DataCell>
                <Table.DataCell>{formaterDatoForFrontend(vilkårsperiode.periode.fom)}</Table.DataCell>
                <Table.DataCell>{formaterDatoForFrontend(vilkårsperiode.periode.tom)}</Table.DataCell>
                {inneholderPerioderMedIkkeOppfylt && (
                  <Table.DataCell>
                    {vilkårsperiode.avslagsårsak ? mapAvslagÅrsakTilTekst(vilkårsperiode.avslagsårsak) : ''}
                  </Table.DataCell>
                )}
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

function mapAvslagÅrsakTilTekst(årsak: AvslagÅrsak): string {
  switch (årsak) {
    case 'BRUKER_OVER_67':
      return 'Brukeren er over 67 år.';
    case 'BRUKER_UNDER_18':
      return 'Brukeren er under 18 år.';
    case 'IKKE_NOK_REDUSERT_ARBEIDSEVNE':
      return 'Ikke nok redusert arbeidsevne.';
    case 'MANGLENDE_DOKUMENTASJON':
      return 'Manglende dokumentasjon';
    case 'IKKE_SYKDOM_SKADE_LYTE_VESENTLIGDEL':
      return 'Ikke sykdom, skade, lyte er vesentlig del';
    default:
      throw new Error('Kunne ikke finne påkrevd årsak.');
  }
}

export function kalkulerAlder(fødselsdato: Date): string {
  const dagensDato = new Date();

  let år = dagensDato.getFullYear() - fødselsdato.getFullYear();
  let måneder = dagensDato.getMonth() - fødselsdato.getMonth();

  if (måneder < 0 || måneder === 0) {
    år--;
    måneder += 12;
  }

  return `${år} år og ${måneder} måneder`;
}
