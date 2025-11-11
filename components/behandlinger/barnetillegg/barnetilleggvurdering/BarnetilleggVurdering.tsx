'use client';

import { Heading, ReadMore } from '@navikt/ds-react';
import { BarnetilleggGrunnlag, BehandlingPersoninfo, MellomlagretVurdering, Periode } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useFieldArray } from 'react-hook-form';
import { DATO_FORMATER, formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { FormEvent } from 'react';
import styles from './BarnetilleggVurdering.module.css';
import { useConfigForm } from 'components/form/FormHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { OppgitteBarnVurdering } from 'components/barn/oppgittebarnvurdering/OppgitteBarnVurdering';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { OppgitteFolkeregisterBarnVurdering } from 'components/barn/oppgittebarnvurdering/OppgitteFolkeregisterBarnVurdering';

interface Props {
  behandlingsversjon: number;
  grunnlag: BarnetilleggGrunnlag;
  behandlingPersonInfo: BehandlingPersoninfo;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface BarnetilleggFormFields {
  barnetilleggVurderinger: BarneTilleggVurdering[];
  folkeregistrerteBarnVurderinger: BarneTilleggVurdering[];
}

type DraftFormFields = Partial<BarnetilleggFormFields>;

interface BarneTilleggVurdering {
  ident: string | null | undefined;
  fødselsdato: string | null | undefined;
  navn: string | null | undefined;
  oppgittForelderRelasjon?: 'FORELDER' | 'FOSTERFORELDER' | null;
  forsørgerPeriode?: Periode;
  vurderinger: Vurdering[];
}

interface Vurdering {
  begrunnelse: string;
  harForeldreAnsvar: string;
  erFosterforelder?: string | null;
  fraDato?: string;
}

export const BarnetilleggVurdering = ({
  grunnlag,
  behandlingsversjon,
  behandlingPersonInfo,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('BARNETILLEGG');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.AVKLAR_BARNETILLEGG_KODE, initialMellomlagretVurdering);

  const { visningActions, visningModus, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'BARNETILLEGG',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(
        grunnlag.vurderteBarn,
        grunnlag.barnSomTrengerVurdering,
        grunnlag.vurderteFolkeregisterBarn,
        grunnlag.folkeregisterbarn,
        behandlingPersonInfo
      );

  const { form } = useConfigForm<BarnetilleggFormFields>(
    {
      barnetilleggVurderinger: {
        type: 'fieldArray',
        defaultValue: defaultValue.barnetilleggVurderinger,
      },
      folkeregistrerteBarnVurderinger: {
        type: 'fieldArray',
        defaultValue: defaultValue.folkeregistrerteBarnVurderinger,
      },
    },
    {}
  );

  const { fields: barnetilleggVurderinger } = useFieldArray({
    control: form.control,
    name: 'barnetilleggVurderinger',
  });

  const { fields: folkeregistrerteBarnVurderinger } = useFieldArray({
    control: form.control,
    name: 'folkeregistrerteBarnVurderinger',
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingsversjon,
          behov: {
            behovstype: Behovstype.AVKLAR_BARNETILLEGG_KODE,
            vurderingerForBarnetillegg: {
              vurderteBarn: [...data.barnetilleggVurderinger, ...data.folkeregistrerteBarnVurderinger].map(
                (vurderteBarn) => {
                  return {
                    ident: vurderteBarn.ident,
                    navn: vurderteBarn.navn,
                    fødselsdato: vurderteBarn.fødselsdato,
                    vurderinger: vurderteBarn.vurderinger.map((vurdering) => {
                      return {
                        begrunnelse: vurdering.begrunnelse,
                        harForeldreAnsvar: vurdering.harForeldreAnsvar === JaEllerNei.Ja,
                        fraDato: getFraDato(vurdering.fraDato),
                        erFosterForelder:
                          vurdering.erFosterforelder === JaEllerNei.Ja || vurdering.erFosterforelder === JaEllerNei.Nei
                            ? vurdering.erFosterforelder === JaEllerNei.Ja
                            : null,
                      };
                    }),
                  };
                }
              ),
            },
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  }

  function getFraDato(value?: string): string {
    if (value) {
      return formaterDatoForBackend(parse(value, DATO_FORMATER.ddMMyyyy, new Date()));
    } else {
      return grunnlag.søknadstidspunkt;
    }
  }

  const erFolkeregistrerteBarn = grunnlag.folkeregisterbarn && grunnlag.folkeregisterbarn.length > 0;
  const harTidligereVurderinger = [grunnlag.barnSomTrengerVurdering, grunnlag.vurderteBarn].flat().length > 0;
  const kapitaliserNavn = (navn: string) => navn.toLowerCase().replace(/(^|\s)\w/g, (match) => match.toUpperCase());

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-20 tredje og fjerde ledd barnetillegg '}
      steg={'BARNETILLEGG'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdertAv}
      vurdertAutomatisk={erFolkeregistrerteBarn}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(
            mapVurderingToDraftFormFields(
              grunnlag.vurderteBarn,
              grunnlag.barnSomTrengerVurdering,
              grunnlag.vurderteFolkeregisterBarn,
              grunnlag.folkeregisterbarn,
              behandlingPersonInfo
            )
          )
        )
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <div className={'flex-column'}>
        {harTidligereVurderinger && (
          <div className={'flex-column'}>
            <div>
              <Heading size={'xsmall'} level="3">
                Følgende barn er oppgitt av bruker
              </Heading>
            </div>

            {barnetilleggVurderinger.map((vurdering, barnetilleggIndex) => {
              return (
                <OppgitteBarnVurdering
                  key={vurdering.id}
                  form={form}
                  barnetilleggIndex={barnetilleggIndex}
                  ident={vurdering.ident}
                  fødselsdato={vurdering.fødselsdato}
                  navn={kapitaliserNavn(
                    vurdering.navn || behandlingPersonInfo?.info[vurdering.ident || 'null'] || 'Ukjent'
                  )}
                  harOppgittFosterforelderRelasjon={vurdering.oppgittForelderRelasjon === 'FOSTERFORELDER'}
                  readOnly={formReadOnly}
                />
              );
            })}
          </div>
        )}
        {erFolkeregistrerteBarn && (
          <div className={'flex-column'}>
            <Heading size={'xsmall'} level="3">
              Følgende barn er funnet i folkeregisteret
            </Heading>
            <ReadMore header="Slik vurderes barnetillegg for folkeregistrerte barn" size="small">
              Folkeregistrerte barn vil som hovedregel gi grunnlag for barnetillegg innenfor forsørgerperioden. Hvis
              opplysningene fra folkeregisteret ikke stemmer, kan du overstyre den automatiske vurderingen ved å legge
              til en ny vurdering under.
            </ReadMore>
            <div className={styles.registrerte_barn}>
              {folkeregistrerteBarnVurderinger.map((vurdering, barnetilleggIndex) => {
                return (
                  <OppgitteFolkeregisterBarnVurdering
                    key={vurdering.id}
                    form={form}
                    barnetilleggIndex={barnetilleggIndex}
                    ident={vurdering.ident}
                    fødselsdato={vurdering.fødselsdato}
                    navn={kapitaliserNavn(
                      vurdering.navn || behandlingPersonInfo?.info[vurdering.ident || 'null'] || 'Ukjent'
                    )}
                    harOppgittFosterforelderRelasjon={vurdering.oppgittForelderRelasjon === 'FOSTERFORELDER'}
                    forsørgerPeriode={vurdering.forsørgerPeriode}
                    readOnly={formReadOnly}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(
  vurderteBarnArray: BarnetilleggGrunnlag['vurderteBarn'],
  barnSomTrengerVurderingArray: BarnetilleggGrunnlag['barnSomTrengerVurdering'],
  vurderteFolkeregisterBarnArray: BarnetilleggGrunnlag['vurderteFolkeregisterBarn'],
  folkeregisterBarn: BarnetilleggGrunnlag['folkeregisterbarn'],
  behandlingPersonInfo: BehandlingPersoninfo
): DraftFormFields {
  const vurderteBarn: BarneTilleggVurdering[] = vurderteBarnArray.map((barn) => {
    const navn = barn.navn || barn.ident || 'Ukjent';
    return {
      ident: barn.ident,
      navn: barn.ident ? behandlingPersonInfo?.info[barn.ident] : navn,
      oppgittForelderRelasjon: barn.oppgittForeldreRelasjon,
      fødselsdato: barn.fødselsdato,
      vurderinger: barn.vurderinger.map((value) => {
        return {
          begrunnelse: value.begrunnelse,
          harForeldreAnsvar: value.harForeldreAnsvar ? JaEllerNei.Ja : JaEllerNei.Nei,
          fraDato: formaterDatoForFrontend(value.fraDato),
          erFosterforelder:
            value.erFosterForelder !== null ? (value.erFosterForelder ? JaEllerNei.Ja : JaEllerNei.Nei) : null,
        };
      }),
    };
  });

  const barnSomTrengerVurdering: BarneTilleggVurdering[] = barnSomTrengerVurderingArray.map((barn) => {
    return {
      ident: barn?.ident?.identifikator,
      navn: barn.navn || (barn.ident?.aktivIdent ? behandlingPersonInfo?.info[barn.ident.identifikator] : 'Ukjent'),
      oppgittForelderRelasjon: barn.oppgittForeldreRelasjon,
      vurderinger: [{ begrunnelse: '', harForeldreAnsvar: '', fraDato: '' }],
      fødselsdato: barn.fodselsDato,
    };
  });

  const vurderteFolkeregisterBarn: BarneTilleggVurdering[] = folkeregisterBarn.map((barn) => {
    const vurderingForBarn = vurderteFolkeregisterBarnArray.find(
      (vurdertBarn) => vurdertBarn.ident === barn.ident?.identifikator
    );
    return {
      navn: behandlingPersonInfo?.info[barn.ident!.identifikator],
      fødselsdato: barn.fodselsDato,
      ident: barn.ident?.identifikator,
      forsørgerPeriode: barn.forsorgerPeriode,
      vurderinger:
        vurderingForBarn == null
          ? []
          : vurderingForBarn.vurderinger.map((value) => ({
              begrunnelse: value.begrunnelse,
              harForeldreAnsvar: value.harForeldreAnsvar ? JaEllerNei.Ja : JaEllerNei.Nei,
              fraDato: formaterDatoForFrontend(value.fraDato),
              erFosterforelder:
                value.erFosterForelder !== null ? (value.erFosterForelder ? JaEllerNei.Ja : JaEllerNei.Nei) : null,
            })),
    };
  });

  return {
    barnetilleggVurderinger: [...vurderteBarn, ...barnSomTrengerVurdering].flat(),
    folkeregistrerteBarnVurderinger: [...vurderteFolkeregisterBarn],
  };
}
