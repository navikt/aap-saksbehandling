'use client';

import { BodyShort } from '@navikt/ds-react';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';
import { BarnetilleggGrunnlag, BehandlingPersoninfo } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useFieldArray } from 'react-hook-form';
import { DATO_FORMATER, formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { OppgitteBarnVurdering } from 'components/barn/oppgittebarnvurdering/OppgitteBarnVurdering';
import { FormEvent } from 'react';

import styles from './BarnetilleggVurdering.module.css';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårsKortMedForm } from '../../../vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  behandlingsversjon: number;
  grunnlag: BarnetilleggGrunnlag;
  behandlingPersonInfo: BehandlingPersoninfo;
  readOnly: boolean;
  harAvklaringsbehov: boolean;
}

export interface BarnetilleggFormFields {
  barnetilleggVurderinger: BarneTilleggVurdering[];
}

interface BarneTilleggVurdering {
  ident: string | null | undefined;
  fødselsdato: string | null | undefined;
  navn: string | null | undefined;
  vurderinger: Vurdering[];
}

interface Vurdering {
  begrunnelse: string;
  harForeldreAnsvar: string;
  fraDato?: string;
}

export const BarnetilleggVurdering = ({
  grunnlag,
  harAvklaringsbehov,
  behandlingsversjon,
  behandlingPersonInfo,
  readOnly,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('BARNETILLEGG');

  const vurderteBarn: BarneTilleggVurdering[] = grunnlag.vurderteBarn.map((barn) => {
    const navn = barn.navn || barn.ident || 'Ukjent';
    return {
      ident: barn.ident,
      navn: barn.ident ? behandlingPersonInfo?.info[barn.ident] : navn,
      fødselsdato: barn.fødselsdato,
      vurderinger: barn.vurderinger.map((value) => {
        return {
          begrunnelse: value.begrunnelse,
          harForeldreAnsvar: value.harForeldreAnsvar ? JaEllerNei.Ja : JaEllerNei.Nei,
          fraDato: formaterDatoForFrontend(value.fraDato),
        };
      }),
    };
  });

  const barnSomTrengerVurdering: BarneTilleggVurdering[] = grunnlag.barnSomTrengerVurdering.map((barn) => {
    return {
      ident: barn?.ident?.identifikator,
      navn: barn.navn || (barn.ident?.aktivIdent ? behandlingPersonInfo?.info[barn.ident.identifikator] : 'Ukjent'),
      vurderinger: [{ begrunnelse: '', harForeldreAnsvar: '', fraDato: '' }],
      fødselsdato: barn.fodselsDato,
    };
  });

  const defaultValue = [...vurderteBarn, ...barnSomTrengerVurdering].flat();

  const { form } = useConfigForm<BarnetilleggFormFields>({
    barnetilleggVurderinger: {
      type: 'fieldArray',
      defaultValue,
    },
  });

  const { fields: barnetilleggVurderinger } = useFieldArray({
    control: form.control,
    name: 'barnetilleggVurderinger',
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
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
                  };
                }),
              };
            }),
          },
        },
        referanse: behandlingsReferanse,
      });
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
    <VilkårsKortMedForm
      heading={'§ 11-20 tredje og fjerde ledd barnetillegg '}
      steg={'BARNETILLEGG'}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly && harAvklaringsbehov}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag.vurdertAv}
      vurdertAutomatisk={!harAvklaringsbehov}
    >
      <div className={'flex-column'}>
        {harAvklaringsbehov && (
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
                  readOnly={readOnly}
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
                  navn={barn.navn ? behandlingPersonInfo?.info[barn?.ident?.identifikator || 'null'] : 'Ukjent'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </VilkårsKortMedForm>
  );
};
