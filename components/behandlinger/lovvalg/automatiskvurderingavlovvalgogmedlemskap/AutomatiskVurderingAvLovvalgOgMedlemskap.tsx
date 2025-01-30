'use client'

import {VilkårsKort} from "components/vilkårskort/VilkårsKort";
import {Heading, Table} from "@navikt/ds-react";
import styles from "components/behandlinger/alder/Alder.module.css";
import {CheckmarkCircleFillIcon, XMarkOctagonFillIcon} from "@navikt/aksel-icons";
type IndikasjonerLovvalgOgMedlemskap = {
  tilhørighetTilNorge: {kilde: string; opplysning: string; resultat: string;}[];
}
interface Props {
  grunnlag: IndikasjonerLovvalgOgMedlemskap;
}
export const AutomatiskVurderingAvLovvalgOgMedlemskap = ({grunnlag}: Props) => {
  return (
    <VilkårsKort heading={'Automatisk vurdering av lovvalg og medlemskap'} steg={'VURDER_LOVVALG'}>

      <Heading size={"small"}>Indikasjoner på tilhørighet til Norge</Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
            <Table.HeaderCell scope="col">Opplysning</Table.HeaderCell>
            <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.tilhørighetTilNorge.map((indikasjon, index) => {
            return (
              <Table.Row key={index}>
                <Table.DataCell>{indikasjon.kilde}</Table.DataCell>
                <Table.DataCell>{indikasjon.opplysning}</Table.DataCell>
                <Table.DataCell>
                    {indikasjon.resultat === 'JA' ? (
                      <>
                        <CheckmarkCircleFillIcon title="Oppfylt" className={styles.oppfyltIcon} />
                        Ja
                      </>

                    ) : (
                      <>
                        <XMarkOctagonFillIcon title={'Ikke oppfylt'} className={styles.avslåttIcon} />
                        Nei
                      </>
                    )}
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </VilkårsKort>
  )
}