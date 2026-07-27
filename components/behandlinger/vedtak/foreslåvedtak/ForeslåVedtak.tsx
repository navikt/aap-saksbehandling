'use client';

import { Behovstype } from 'lib/utils/form';
import { BodyShort, Box, Label, List, Table, VStack } from '@navikt/ds-react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';

import { ForeslåVedtakGrunnlag, StansOpphørÅrsak } from 'lib/types/types';
import { ForeslåVedtakTabell } from 'components/behandlinger/vedtak/foreslåvedtak/foreslåvedtaktabell/ForeslåVedtakTabell';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useFeatureFlag } from 'context/UnleashContext';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { VilkårskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { storForbokstav } from 'lib/utils/string';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: ForeslåVedtakGrunnlag;
}

export const ForeslåVedtak = ({ behandlingVersjon, readOnly, grunnlag }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FORESLÅ_VEDTAK');
  const visStansOpphørFeature = useFeatureFlag('VisStansOpphorFrontend');

  const { visningActions, visningModus } = useVilkårskortVisning(readOnly, 'FORESLÅ_VEDTAK', undefined);
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  return (
    <VilkårskortMedForm
      heading="Foreslå vedtak"
      steg={'FORESLÅ_VEDTAK'}
      vilkårTilhørerNavKontor={false}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      onSubmit={(event) => {
        event.preventDefault();
        løsBehovOgGåTilNesteSteg(
          {
            behandlingVersjon: behandlingVersjon,
            behov: {
              behovstype: Behovstype.FORESLÅ_VEDTAK_KODE,
            },
            referanse: behandlingsreferanse,
          },
          () => {
            loggUmamiVarighet('STEG_FORESLÅ_VEDTAK_VARIGHET', umamiStartTidspunkt, Date.now());
          }
        );
      }}
      knappTekst={'Send til beslutter'}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {}}
    >
      <VStack gap={'space-16'}>
        <Label as="p" size={'medium'}>
          Vedtaket medfører følgende konsekvens for brukeren:
        </Label>
        <ForeslåVedtakTabell grunnlag={grunnlag} />
        {visStansOpphørFeature && (
          <TableStyled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Fra og med</Table.HeaderCell>
                <Table.HeaderCell>Stans eller opphør</Table.HeaderCell>
                <Table.HeaderCell>Årsak</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {grunnlag.stansOpphør.map(({ stansOpphørFraOgMed, historikk }) => {
                const finnesFlereÅrsaker = historikk[0].årsaker.length > 1;

                return (
                  <Table.Row key={stansOpphørFraOgMed}>
                    <Table.DataCell>{formaterDatoForFrontend(stansOpphørFraOgMed)}</Table.DataCell>
                    <Table.DataCell>{storForbokstav(historikk[0].type)}</Table.DataCell>
                    <Table.DataCell>
                      {finnesFlereÅrsaker ? (
                        <Box asChild>
                          <List>
                            {historikk[0].årsaker.map((årsak, index) => (
                              <List.Item key={index}>{mapÅrsakTilTekst(årsak)}</List.Item>
                            ))}
                          </List>
                        </Box>
                      ) : (
                        <BodyShort>{mapÅrsakTilTekst(historikk[0].årsaker[0])}</BodyShort>
                      )}
                    </Table.DataCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </TableStyled>
        )}
      </VStack>
    </VilkårskortMedForm>
  );
};

export function mapÅrsakTilTekst(årsak: StansOpphørÅrsak): string {
  switch (årsak) {
    case 'IKKE_SYKDOM_SKADE_LYTE':
      return 'Ikke sykdom, skade eller lyte';
    case 'BRUKER_UNDER_18':
      return 'Brukeren er under 18 år';
    case 'BRUKER_OVER_67':
      return 'Brukeren er over 67 år';
    case 'MANGLENDE_DOKUMENTASJON':
      return 'Brukeren har ikke oppfylt opplysningsplikten sin etter § 21-3';
    case 'IKKE_RETT_PA_SYKEPENGEERSTATNING':
      return 'Ikke rett til AAP som sykepengeerstatning';
    case 'IKKE_RETT_PA_STUDENT':
      return 'Ikke rett til AAP til studenter';
    case 'VARIGHET_OVERSKREDET_STUDENT':
      return 'Maks varighet på AAP til studenter er nådd';
    case 'IKKE_SYKDOM_AV_VISS_VARIGHET':
      return 'Nedsatt arbeidsevne er ikke varig';
    case 'IKKE_SYKDOM_SKADE_LYTE_VESENTLIGDEL':
      return 'Sykdom, skade eller lyte er ikke vesentlig medvirkende årsak til nedsatt arbeidsevne';
    case 'IKKE_NOK_REDUSERT_ARBEIDSEVNE':
      return 'Arbeidsevnen er ikke tilstrekkelig nedsatt';
    case 'IKKE_BEHOV_FOR_OPPFOLGING':
      return 'Brukeren har ikke behov for oppfølging eller behandling';
    case 'IKKE_MEDLEM_FORUTGÅENDE':
      return 'Brukeren oppfyller ikke medlemsvilkåret i § 11-2';
    case 'IKKE_MEDLEM':
      return 'Brukeren oppfyller ikke kravet til medlemskap i folketrygden etter kapittel 2';
    case 'IKKE_OPPFYLT_OPPHOLDSKRAV_EØS':
      return 'Brukeren oppfyller ikke oppholdskrav etter § 11-3';
    case 'NORGE_IKKE_KOMPETENT_STAT':
      return 'Norge er ikke kompetent sak til å behandle søknaden';
    case 'ANNEN_FULL_YTELSE':
      return 'Brukeren har annen full ytelse fra folketrygden';
    case 'INNTEKTSTAP_DEKKES_ETTER_ANNEN_LOVGIVNING':
      return 'AAP utbetales ikke når brukeren får dekket det samme inntektstapet under annen lovgivning';
    case 'IKKE_RETT_PA_AAP_UNDER_BEHANDLING_AV_UFORE':
      return 'Brukeren har ikke rett til AAP under behandling av krav om uføretrygd';
    case 'VARIGHET_OVERSKREDET_OVERGANG_UFORE':
      return 'Maks varighet på AAP under behandling av krav om uføretrygd';
    case 'VARIGHET_OVERSKREDET_ARBEIDSSØKER':
      return 'Maks varighet på AAP i perioden som arbeidssøker';
    case 'IKKE_RETT_PA_AAP_I_PERIODE_SOM_ARBEIDSSOKER':
      return 'Brukeren har ikke rett til AAP i perioden som arbeidssøker';
    case 'IKKE_RETT_UNDER_STRAFFEGJENNOMFØRING':
      return 'Brukeren har ikke rett til AAP under straffegjennomføring';
    case 'BRUDD_PÅ_AKTIVITETSPLIKT_STANS':
      return 'AAP er stanset fordi aktivitetsplikten i § 11-7 ikke er oppfylt';
    case 'BRUDD_PÅ_AKTIVITETSPLIKT_OPPHØR':
      return 'AAP er opphørt fordi aktivitetsplikten i § 11-7 ikke er oppfylt';
    case 'BRUDD_PÅ_OPPHOLDSKRAV_STANS':
      return 'AAP er stanset fordi oppholdskrav i § 11-3 ikke er oppfylt';
    case 'BRUDD_PÅ_OPPHOLDSKRAV_OPPHØR':
      return 'AAP er opphørt fordi oppholdskrav i § 11-3 ikke er oppfylt';
    case 'HAR_RETT_TIL_FULLT_UTTAK_ALDERSPENSJON':
      return 'Brukeren har rett til fullt uttak av alderspensjon';
    case 'ORDINÆRKVOTE_BRUKT_OPP':
      return 'Ordinær kvote er oppbrukt';
    case 'SYKEPENGEERSTATNINGKVOTE_BRUKT_OPP':
      return 'Kvote på AAP som sykepengeerstatning er oppbrukt';
    case 'ANNEN_FULL_YTELSE_AVSLAG':
      return '§ 11-27 Mulig avslag pga. annen full folketrygdytelse'
  }
}
