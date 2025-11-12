'use client';

import { Button, Heading, ReadMore } from '@navikt/ds-react';
import { LeggTilBarnModal } from './LeggTilBarnModal';
import { BarnetilleggGrunnlag, BehandlingPersoninfo, MellomlagretVurdering, Periode } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useFieldArray } from 'react-hook-form';
import { DATO_FORMATER, formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import React, { FormEvent, useState } from 'react';
import styles from './BarnetilleggVurdering.module.css';
import { useConfigForm } from 'components/form/FormHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { OppgitteBarnVurdering } from 'components/barn/oppgittebarnvurdering/OppgitteBarnVurdering';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { OppgitteFolkeregisterBarnVurdering } from 'components/barn/oppgittebarnvurdering/OppgitteFolkeregisterBarnVurdering';
import { PlusIcon } from '@navikt/aksel-icons';
import { SaksbehandlerOppgittBarnVurdering } from 'components/barn/oppgittebarnvurdering/SaksbehandlerOppgittBarnVurdering';
import { isProd } from 'lib/utils/environment';

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
  saksbehandlerOppgitteBarnVurderinger: SaksbehandlerOppgitteBarnVurdering[];
}

export interface SaksbehandlerOppgitteBarnVurdering extends BarneTilleggVurdering {
  erSlettbar: boolean;
}

type DraftFormFields = Partial<BarnetilleggFormFields>;

export interface BarneTilleggVurdering {
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

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(
        grunnlag.vurderteBarn,
        grunnlag.barnSomTrengerVurdering,
        grunnlag.vurderteFolkeregisterBarn,
        grunnlag.vurderteSaksbehandlerOppgitteBarn,
        grunnlag.folkeregisterbarn,
        grunnlag.saksbehandlerOppgitteBarn,
        behandlingPersonInfo
      );

  const { visningActions, visningModus, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'BARNETILLEGG',
    mellomlagretVurdering
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
      saksbehandlerOppgitteBarnVurderinger: {
        type: 'fieldArray',
        defaultValue: defaultValue.saksbehandlerOppgitteBarnVurderinger,
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

  const {
    fields: saksbehandlerOppgitteBarnVurderinger, append, remove, } = useFieldArray({
    control: form.control,
    name: 'saksbehandlerOppgitteBarnVurderinger',
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    form.handleSubmit((data) => {
      const mapVurdering = (vurdering: Vurdering) => ({
        begrunnelse: vurdering.begrunnelse,
        harForeldreAnsvar: vurdering.harForeldreAnsvar === JaEllerNei.Ja,
        fraDato: getFraDato(vurdering.fraDato),
        erFosterForelder:
          vurdering.erFosterforelder === JaEllerNei.Ja || vurdering.erFosterforelder === JaEllerNei.Nei
            ? vurdering.erFosterforelder === JaEllerNei.Ja
            : null,
      });

      const mapBarnVurdering = (barn: BarneTilleggVurdering) => ({
        ident: barn.ident || null,
        navn: barn.navn,
        fødselsdato: barn.fødselsdato,
        oppgittForeldreRelasjon: barn.oppgittForelderRelasjon,
        vurderinger: barn.vurderinger.map(mapVurdering),
      });

      const alleBarn = [
        ...data.barnetilleggVurderinger,
        ...data.folkeregistrerteBarnVurderinger,
        ...data.saksbehandlerOppgitteBarnVurderinger,
      ];

      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingsversjon,
          behov: {
            behovstype: Behovstype.AVKLAR_BARNETILLEGG_KODE,
            vurderingerForBarnetillegg: {
              vurderteBarn: alleBarn.map(mapBarnVurdering),
              saksbehandlerOppgitteBarn: data.saksbehandlerOppgitteBarnVurderinger.map((barn) => ({
                ...mapBarnVurdering(barn),
              })),
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
  const harSaksbehandlerOppgitteBarnVurderinger = saksbehandlerOppgitteBarnVurderinger?.some(
    (v) => v.ident || v.fødselsdato
  );
  const kapitaliserNavn = (navn: string) => navn.toLowerCase().replaceAll(/(^|\s)\w/g, (match) => match.toUpperCase());
  const [visLeggTilBarnModal, setVisLeggTilBarnModal] = useState(false);

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
              grunnlag.vurderteSaksbehandlerOppgitteBarn,
              grunnlag.folkeregisterbarn,
              grunnlag.saksbehandlerOppgitteBarn,
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
        {harSaksbehandlerOppgitteBarnVurderinger && (
          <div className={'flex-column'}>
            <div>
              <Heading size={'xsmall'} level="3">
                Følgende barn er manuelt lagt til
              </Heading>
            </div>

            {saksbehandlerOppgitteBarnVurderinger.map((vurdering, manuelleBarnIndex) => {
              return (
                <SaksbehandlerOppgittBarnVurdering
                  key={vurdering.id}
                  form={form}
                  barnetilleggIndex={manuelleBarnIndex}
                  ident={vurdering.ident}
                  fødselsdato={vurdering.fødselsdato}
                  navn={kapitaliserNavn(
                    (vurdering.ident && behandlingPersonInfo?.info[vurdering.ident]) || vurdering.navn || 'Ukjent'
                  )}
                  harOppgittFosterforelderRelasjon={vurdering.oppgittForelderRelasjon === 'FOSTERFORELDER'}
                  readOnly={formReadOnly}
                  onRemove={() => remove(manuelleBarnIndex)}
                  erSlettbar={vurdering.erSlettbar}
                />
              );
            })}
          </div>
        )}
        {!isProd() && (
          <>
            <div className={'flex-row'}>
              <Button
                type="button"
                className={'fit-content'}
                size={'small'}
                onClick={() => setVisLeggTilBarnModal(true)}
                variant={'tertiary'}
                icon={<PlusIcon aria-hidden />}
                disabled={formReadOnly}
              >
                Legg til nytt barn
              </Button>
            </div>
            {visLeggTilBarnModal && (
              <LeggTilBarnModal
                avbryt={() => setVisLeggTilBarnModal(false)}
                åpne={true}
                readOnly={formReadOnly}
                onLagreNyttBarn={(nyttBarn) => {
                  append({ ...nyttBarn, erSlettbar: true });
                  setVisLeggTilBarnModal(false);
                }}
              />
            )}
          </>
        )}
      </div>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(
  vurderteBarnArray: BarnetilleggGrunnlag['vurderteBarn'],
  barnSomTrengerVurderingArray: BarnetilleggGrunnlag['barnSomTrengerVurdering'],
  vurderteFolkeregisterBarnArray: BarnetilleggGrunnlag['vurderteFolkeregisterBarn'],
  vurderteSaksbehandlerOppgitteBarn: BarnetilleggGrunnlag['vurderteSaksbehandlerOppgitteBarn'],
  folkeregisterBarn: BarnetilleggGrunnlag['folkeregisterbarn'],
  saksbehandlerOppgitteBarn: BarnetilleggGrunnlag['saksbehandlerOppgitteBarn'],
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
            value.erFosterForelder === null ? null : (value.erFosterForelder ? JaEllerNei.Ja : JaEllerNei.Nei),
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
                value.erFosterForelder === null ? null : (value.erFosterForelder ? JaEllerNei.Ja : JaEllerNei.Nei),
            })),
    };
  });

  const saksbehandlerOppgitteBarnVurderinger: SaksbehandlerOppgitteBarnVurdering[] = saksbehandlerOppgitteBarn
    .filter((barn) => barn !== null && barn !== undefined)
    .map((barn) => {
      const vurderingForBarn = vurderteSaksbehandlerOppgitteBarn?.find((eksisterendeVurdering) => {
        if (barn.ident?.identifikator) {
          return eksisterendeVurdering.vurdertBarn.ident === barn.ident.identifikator;
        }
        return eksisterendeVurdering.vurdertBarn.navn === barn.navn && eksisterendeVurdering.vurdertBarn.fødselsdato === barn.fodselsDato;
      });

      const mapVurdering = (value: any) => ({
        begrunnelse: value.begrunnelse,
        harForeldreAnsvar: value.harForeldreAnsvar ? JaEllerNei.Ja : JaEllerNei.Nei,
        fraDato: formaterDatoForFrontend(value.fraDato),
        erFosterforelder: value.erFosterForelder === null ? null : (value.erFosterForelder ? JaEllerNei.Ja : JaEllerNei.Nei),
      });

      return {
        navn: barn.navn,
        fødselsdato: barn.fodselsDato,
        ident: barn.ident?.identifikator,
        oppgittForelderRelasjon: barn.oppgittForeldreRelasjon,
        erSlettbar: vurderingForBarn?.erSlettbar ?? true,
        vurderinger: vurderingForBarn
          ? vurderingForBarn.vurdertBarn.vurderinger.map(mapVurdering)
          : [{ begrunnelse: '', harForeldreAnsvar: '', fraDato: '' }]
      };
    });

  return {
    barnetilleggVurderinger: [...vurderteBarn, ...barnSomTrengerVurdering].flat(),
    folkeregistrerteBarnVurderinger: [...vurderteFolkeregisterBarn],
    saksbehandlerOppgitteBarnVurderinger: [...saksbehandlerOppgitteBarnVurderinger],
  };
}
