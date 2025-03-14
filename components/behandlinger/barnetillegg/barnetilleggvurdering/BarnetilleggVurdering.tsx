'use client';

import { ChildHairEyesIcon } from '@navikt/aksel-icons';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button, Label } from '@navikt/ds-react';
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
import { ServerSentEventStatusAlert } from 'components/serversenteventstatusalert/ServerSentEventStatusAlert';
import { useConfigForm } from 'components/form/FormHook';

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
  ident: string;
  fødselsdato: string;
  navn: string;
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
  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus } = useLøsBehovOgGåTilNesteSteg('BARNETILLEGG');

  const vurderteBarn: BarneTilleggVurdering[] = grunnlag.vurderteBarn.map((barn) => {
    return {
      ident: barn.ident,
      navn: behandlingPersonInfo?.info[barn.ident],
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
      ident: barn.ident.identifikator,
      navn: behandlingPersonInfo?.info[barn.ident.identifikator],
      vurderinger: [{ begrunnelse: '', harForeldreAnsvar: '', fraDato: '' }],
      fødselsdato: barn.fødselsdato,
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
                vurderinger: vurderteBarn.vurderinger.map((vurdering, index) => {
                  return {
                    begrunnelse: vurdering.begrunnelse,
                    harForeldreAnsvar: vurdering.harForeldreAnsvar === JaEllerNei.Ja,
                    fraDato: getFraDato(index, vurdering.fraDato),
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

  function getFraDato(index: number, value?: string): string {
    if (value && index !== 0) {
      return formaterDatoForBackend(parse(value, DATO_FORMATER.ddMMyyyy, new Date()));
    } else {
      return grunnlag.søknadstidspunkt;
    }
  }

  const erFolkeregistrerteBarn = grunnlag.folkeregisterbarn && grunnlag.folkeregisterbarn.length > 0;

  return (
    <VilkårsKort
      heading={'Barnetillegg § 11-20 tredje og fjerde ledd'}
      icon={<ChildHairEyesIcon title="barnetilleg-ikon" fontSize="1.5rem" aria-hidden />}
      steg={'BARNETILLEGG'}
    >
      <div className={'flex-column'}>
        {harAvklaringsbehov && (
          <div className={'flex-column'}>
            <div>
              <Label size={'medium'}>Følgende barn er oppgitt av bruker og må vurderes</Label>
            </div>

            <form className={'flex-column'} id={'barnetillegg'} onSubmit={handleSubmit} autoComplete={'off'}>
              <ServerSentEventStatusAlert status={status} resetStatus={resetStatus} />
              {barnetilleggVurderinger.map((vurdering, barnetilleggIndex) => {
                return (
                  <OppgitteBarnVurdering
                    key={vurdering.id}
                    form={form}
                    barnetilleggIndex={barnetilleggIndex}
                    ident={vurdering.ident}
                    fødselsdato={vurdering.fødselsdato}
                    navn={behandlingPersonInfo?.info[vurdering.ident] || 'Ukjent'}
                    readOnly={readOnly}
                  />
                );
              })}
            </form>
          </div>
        )}
        {erFolkeregistrerteBarn && (
          <div className={'flex-column'}>
            <Label size={'medium'}>Følgende barn er funnet i folkeregisteret og vil gi grunnlag for barnetillegg</Label>
            <div className={styles.registrerte_barn}>
              {grunnlag.folkeregisterbarn.map((barn, index) => (
                <RegistrertBarn
                  key={index}
                  registrertBarn={barn}
                  navn={behandlingPersonInfo?.info[barn.ident.identifikator] || 'Ukjent'}
                />
              ))}
            </div>
          </div>
        )}
        {!readOnly && harAvklaringsbehov && (
          <Button className={'fit-content'} form={'barnetillegg'} loading={isLoading}>
            Bekreft
          </Button>
        )}
      </div>
    </VilkårsKort>
  );
};
