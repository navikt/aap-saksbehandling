'use client';

import { ChildHairEyesIcon } from '@navikt/aksel-icons';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Button, Label } from '@navikt/ds-react';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';
import { BarnetilleggGrunnlag, BehandlingPersoninfo } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useConfigForm } from '@navikt/aap-felles-react';
import { useFieldArray } from 'react-hook-form';
import { DATO_FORMATER, formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { OppgitteBarnVurdering } from 'components/barn/oppgittebarnvurdering/OppgitteBarnVurdering';
import { FormEvent } from 'react';

interface Props {
  behandlingsversjon: number;
  grunnlag: BarnetilleggGrunnlag;
  behandlingPersonInfo: BehandlingPersoninfo;
  readOnly: boolean;
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

export const BarnetilleggVurdering = ({ grunnlag, behandlingsversjon, behandlingPersonInfo, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('BARNETILLEGG');

  const vurderteBarn: BarneTilleggVurdering[] = grunnlag.vurderteBarn.map((barn) => {
    return {
      ident: barn.ident,
      navn: behandlingPersonInfo.info[barn.ident],
      fødselsdato: 'hei',
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
      navn: behandlingPersonInfo.info[barn.ident.identifikator],
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

  console.log('grunnlag', grunnlag);

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
                vurderinger: vurderteBarn.vurderinger.map((vurdering) => {
                  return {
                    begrunnelse: vurdering.begrunnelse,
                    harForeldreAnsvar: vurdering.harForeldreAnsvar === JaEllerNei.Ja,
                    fraDato: vurdering.fraDato
                      ? formaterDatoForBackend(parse(vurdering.fraDato, DATO_FORMATER.ddMMyyyy, new Date()))
                      : formaterDatoForBackend(new Date()), //TODO Sett søknadstidspunkt dersom fraDato ikke blir satt
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

  return (
    <VilkårsKort
      heading={'Barnetillegg § 11-20 tredje og fjerde ledd'}
      icon={<ChildHairEyesIcon title="barnetilleg-ikon" fontSize="1.5rem" />}
      steg={'BARNETILLEGG'}
    >
      <div className={'flex-column'}>
        <div className={'flex-column'}>
          <div>
            <Label size={'medium'}>Følgende barn er oppgitt av søker og må vurderes for barnetillegg</Label>
          </div>

          <form className={'flex-column'} id={'barnetillegg'} onSubmit={handleSubmit}>
            {barnetilleggVurderinger.map((vurdering, barnetilleggIndex) => {
              return (
                <OppgitteBarnVurdering
                  key={vurdering.id}
                  form={form}
                  barnetilleggIndex={barnetilleggIndex}
                  ident={vurdering.ident}
                  fødselsdato={vurdering.fødselsdato}
                  navn={behandlingPersonInfo.info[vurdering.ident]}
                  readOnly={readOnly}
                />
              );
            })}
          </form>
        </div>
        {grunnlag.folkeregisterbarn && grunnlag.folkeregisterbarn.length > 0 && (
          <div className={'flex-column'}>
            <Label size={'medium'}>Følgende barn er funnet i folkeregisteret og vil gi grunnlag for barnetillegg</Label>
            {grunnlag.folkeregisterbarn.map((barn, index) => (
              <RegistrertBarn
                key={index}
                registrertBarn={barn}
                navn={behandlingPersonInfo.info[barn.ident.identifikator]}
              />
            ))}
          </div>
        )}
        {!readOnly && (
          <Button className={'fit-content-button'} form={'barnetillegg'} loading={isLoading}>
            Bekreft
          </Button>
        )}
      </div>
    </VilkårsKort>
  );
};
