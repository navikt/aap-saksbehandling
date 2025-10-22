'use client';

import { BodyShort } from '@navikt/ds-react';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';
import { BarnetilleggGrunnlag, BehandlingPersoninfo, MellomlagretVurdering } from 'lib/types/types';
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
import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';

interface Props {
  behandlingsversjon: number;
  grunnlag: BarnetilleggGrunnlag;
  behandlingPersonInfo: BehandlingPersoninfo;
  readOnly: boolean;
  visManuellVurdering: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

type DraftFormFields = Partial<BarnetilleggFormFields>;

interface OldBarnetilleggVurdering {
  ident: string | null | undefined;
  fødselsdato: string | null | undefined;
  navn: string | null | undefined;
  oppgittForelderRelasjon?: 'FORELDER' | 'FOSTERFORELDER' | null;
  vurderinger: Vurdering[];
}

interface Vurdering {
  begrunnelse: string;
  harForeldreAnsvar: string;
  erFosterforelder?: string | null;
  fraDato?: string;
}

export const OldBarnetilleggVurdering = ({
  grunnlag,
  behandlingsversjon,
  behandlingPersonInfo,
  readOnly,
  visManuellVurdering,
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
    : mapVurderingToDraftFormFields(grunnlag.vurderteBarn, grunnlag.barnSomTrengerVurdering, behandlingPersonInfo);

  const { form } = useConfigForm<BarnetilleggFormFields>(
    {
      barnetilleggVurderinger: {
        type: 'fieldArray',
        defaultValue: defaultValue.barnetilleggVurderinger,
      },
      folkeregistrerteBarnVurderinger: {
        type: 'fieldArray',
        defaultValue: [],
      },
    },
    {}
  );

  const { fields: barnetilleggVurderinger } = useFieldArray({
    control: form.control,
    name: 'barnetilleggVurderinger',
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingsversjon,
          behov: {
            behovstype: Behovstype.AVKLAR_BARNETILLEGG_KODE,
            vurderingerForBarnetillegg: {
              vurderteBarn: data.barnetilleggVurderinger.map((vurderteBarn) => {
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
              }),
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

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-20 tredje og fjerde ledd barnetillegg '}
      steg={'BARNETILLEGG'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly && visManuellVurdering}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdertAv}
      vurdertAutomatisk={erFolkeregistrerteBarn}
      readOnly={readOnly}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(
            mapVurderingToDraftFormFields(grunnlag.vurderteBarn, grunnlag.barnSomTrengerVurdering, behandlingPersonInfo)
          )
        )
      }
      visningModus={visningModus}
      visningActions={visningActions}
    >
      <div className={'flex-column'}>
        {visManuellVurdering && barnetilleggVurderinger.length > 0 && (
          <div className={'flex-column'}>
            <div>
              <BodyShort size={'small'} weight={'semibold'}>
                Følgende barn er oppgitt av brukeren og må vurderes
              </BodyShort>
            </div>

            {barnetilleggVurderinger.map((vurdering, barnetilleggIndex) => {
              return (
                <OppgitteBarnVurdering
                  key={vurdering.id}
                  form={form}
                  barnetilleggIndex={barnetilleggIndex}
                  ident={vurdering.ident}
                  fødselsdato={vurdering.fødselsdato}
                  navn={vurdering.navn || behandlingPersonInfo?.info[vurdering.ident || 'null'] || 'Ukjent'}
                  harOppgittFosterforelderRelasjon={vurdering.oppgittForelderRelasjon === 'FOSTERFORELDER'}
                  readOnly={formReadOnly}
                />
              );
            })}
          </div>
        )}
        {erFolkeregistrerteBarn && (
          <div className={'flex-column'}>
            <BodyShort size={'small'} weight={'semibold'}>
              Følgende barn er funnet i folkeregisteret og vil gi grunnlag for barnetillegg
            </BodyShort>
            <div className={styles.registrerte_barn}>
              {grunnlag.folkeregisterbarn.map((barn, index) => (
                <RegistrertBarn
                  key={index}
                  registrertBarn={barn}
                  navn={barn.navn || behandlingPersonInfo?.info[barn?.ident?.identifikator || 'null'] || 'Ukjent'}
                />
              ))}
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
  behandlingPersonInfo: BehandlingPersoninfo
): DraftFormFields {
  const vurderteBarn: OldBarnetilleggVurdering[] = vurderteBarnArray.map((barn) => {
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

  const barnSomTrengerVurdering: OldBarnetilleggVurdering[] = barnSomTrengerVurderingArray.map((barn) => {
    return {
      ident: barn?.ident?.identifikator,
      navn: barn.navn || (barn.ident?.aktivIdent ? behandlingPersonInfo?.info[barn.ident.identifikator] : 'Ukjent'),
      oppgittForelderRelasjon: barn.oppgittForeldreRelasjon,
      vurderinger: [{ begrunnelse: '', harForeldreAnsvar: '', fraDato: '' }],
      fødselsdato: barn.fodselsDato,
    };
  });

  return { barnetilleggVurderinger: [...vurderteBarn, ...barnSomTrengerVurdering].flat() };
}
