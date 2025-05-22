import { tilhørighetVurdering } from 'lib/types/types';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { BodyShort, Table, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { formaterTilNok } from 'lib/utils/string';

interface Props {
  opplysning: tilhørighetVurdering;
}

export const OpplysningerContent = ({ opplysning }: Props) => {
  if (opplysning.arbeidInntektINorgeGrunnlag) {
    const arbeidInntektINorgeGrunnlag = opplysning.arbeidInntektINorgeGrunnlag;
    return (
      <TableStyled>
        <Table.Header>
          <Table.ColumnHeader>Periode</Table.ColumnHeader>
          <Table.ColumnHeader>Arbeidsgiver</Table.ColumnHeader>
          <Table.ColumnHeader>Arbeidsforhold</Table.ColumnHeader>
          <Table.ColumnHeader>Stillingsprosent</Table.ColumnHeader>
          <Table.ColumnHeader>Inntekt</Table.ColumnHeader>
        </Table.Header>

        <Table.Body>
          {arbeidInntektINorgeGrunnlag.map((inntekt, index) => {
            return (
              <Table.Row key={index}>
                <Table.DataCell>
                  {formaterDatoForFrontend(inntekt.periode.fom)} - {formaterDatoForFrontend(inntekt.periode.tom)}
                </Table.DataCell>
                <Table.DataCell>{inntekt.identifikator}</Table.DataCell>
                <Table.DataCell></Table.DataCell>
                <Table.DataCell></Table.DataCell>
                <Table.DataCell>{formaterTilNok(inntekt.beloep)}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>
    );
  }

  if (opplysning.mottarSykepengerGrunnlag) {
    const mottarSykepengerGrunnlag = opplysning.mottarSykepengerGrunnlag;

    return (
      <VStack gap={'2'}>
        {mottarSykepengerGrunnlag.map((sykepenger, index) => {
          return (
            <VStack gap={'1'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
              <BodyShort size={'small'}>{sykepenger.inntektType}</BodyShort>
              <BodyShort size={'small'}>
                {formaterDatoForFrontend(sykepenger.periode.fom)} - {formaterDatoForFrontend(sykepenger.periode.tom)}
              </BodyShort>
            </VStack>
          );
        })}
      </VStack>
    );
  }

  if (opplysning.oppgittJobbetIUtlandGrunnlag) {
    const oppgittJobbetIUtlandGrunnlag = opplysning.oppgittJobbetIUtlandGrunnlag;
    console.log(oppgittJobbetIUtlandGrunnlag);
    return (
      <VStack gap={'2'}>
        {oppgittJobbetIUtlandGrunnlag.map((jobb, index) => {
          return (
            <VStack gap={'1'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
              <BodyShort size={'small'}>{jobb.land}</BodyShort>
              <BodyShort size={'small'}>
                {/*@ts-ignore // TODO Få riktig type fra bakcend*/}
                {formaterDatoForFrontend(jobb.fraDato)} - {formaterDatoForFrontend(jobb.tilDato)}
              </BodyShort>
            </VStack>
          );
        })}
      </VStack>
    );
  }
  // TODO Hvorfor er denne boolsk?
  if (opplysning.oppgittUtenlandsOppholdGrunnlag) {
    return <VStack gap={'2'}>Hva skal vises her?</VStack>;
  }

  if (opplysning.manglerStatsborgerskapGrunnlag) {
    const manglerStatsborgerskapGrunnlag = opplysning.manglerStatsborgerskapGrunnlag;
    return (
      <VStack gap={'2'}>
        {manglerStatsborgerskapGrunnlag.map((manglerStatsborgerskap, index) => {
          return (
            <VStack gap={'1'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
              <BodyShort size={'small'}>{manglerStatsborgerskap.land}</BodyShort>
              <BodyShort size={'small'}>
                {/*@ts-ignore // TODO Få riktig type fra bakcend*/}
                {formaterDatoForFrontend(manglerStatsborgerskap.gyldigFraOgMed)} -{' '}
                {/*@ts-ignore // TODO Få riktig type fra bakcend*/}
                {formaterDatoForFrontend(manglerStatsborgerskap.gyldigTilOgMed)}
              </BodyShort>
            </VStack>
          );
        })}
      </VStack>
    );
  }
  if (opplysning.utenlandsAddresserGrunnlag) {
    const utenlandsAddresserGrunnlag = opplysning.utenlandsAddresserGrunnlag;
    return (
      <VStack gap={'2'}>
        {utenlandsAddresserGrunnlag.map((utenlandsAdresse, index) => {
          return (
            <VStack gap={'1'} key={index} style={{ paddingLeft: '1rem', borderLeft: '1px solid gray' }}>
              <BodyShort size={'small'}>
                {utenlandsAdresse.adresseNavn} {utenlandsAdresse.landkode} {utenlandsAdresse.postkode}
              </BodyShort>
              <BodyShort size={'small'}>{utenlandsAdresse.bySted}</BodyShort>
              <BodyShort size={'small'}>
                {/*@ts-ignore // TODO Få riktig type fra bakcend*/}
                {formaterDatoForFrontend(utenlandsAdresse.gyldigFraOgMed)} -{' '}
                {/*@ts-ignore // TODO Få riktig type fra bakcend*/}
                {formaterDatoForFrontend(utenlandsAdresse.gyldigTilOgMed)}
              </BodyShort>
            </VStack>
          );
        })}
      </VStack>
    );
  }
  if (opplysning.vedtakImedlGrunnlag) {
    return <div>{JSON.stringify(opplysning.vedtakImedlGrunnlag)}</div>;
  }
};
