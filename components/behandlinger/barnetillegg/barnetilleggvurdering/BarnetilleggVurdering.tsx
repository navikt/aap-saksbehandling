'use client';

import { ChildHairEyesIcon } from '@navikt/aksel-icons';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import { RegistrertBarn } from 'components/barn/registrertbarn/RegistrertBarn';
import { BarnetilleggGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useConfigForm } from '@navikt/aap-felles-react';
import { useFieldArray } from 'react-hook-form';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { CheckboxWrapper } from 'components/input/CheckboxWrapper';
import { DATO_FORMATER, formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { ManueltBarnVurdering } from 'components/barn/something/ManueltBarnVurdering';

interface Props {
  behandlingsversjon: number;
  grunnlag: BarnetilleggGrunnlag;
  readOnly: boolean;
}

export interface BarnetilleggFormFields {
  dokumenterBruktIVurderingen: string[];
  barnetilleggVurderinger: BarneTilleggVurdering[];
}

interface BarneTilleggVurdering {
  ident: string;
  vurderinger: ManueltBarnVurdering[];
}

export interface ManueltBarnVurdering {
  begrunnelse: string;
  harForeldreAnsvar: string;
  fom: string;
  tom?: string;
}

export const BarnetilleggVurdering = ({ grunnlag, behandlingsversjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('BARNETILLEGG');

  const { form } = useConfigForm<BarnetilleggFormFields>({
    dokumenterBruktIVurderingen: {
      type: 'checkbox_nested',
      defaultValue: [],
    },
    barnetilleggVurderinger: {
      type: 'fieldArray',
      defaultValue: grunnlag.barnSomTrengerVurdering.map((barn) => {
        return {
          ident: barn.ident.identifikator,
          vurderinger: [{ begrunnelse: '', harForeldreAnsvar: '', fom: '' }],
        };
      }),
    },
  });

  const { fields: barnetilleggVurderinger } = useFieldArray({
    control: form.control,
    name: 'barnetilleggVurderinger',
  });

  return (
    <VilkårsKort
      heading={'Barnetillegg § 11-20 tredje og fjerde ledd'}
      icon={<ChildHairEyesIcon title="barnetilleg-ikon" fontSize="1.5rem" />}
      steg={'BARNETILLEGG'}
    >
      <div className={'flex-column'}>
        <CheckboxWrapper
          label={'Dokumenter funnet som er relevante for vurdering av barnetillegg §11-20'}
          description={'Les dokumentene og tilknytt eventuelle dokumenter benyttet til 11-20 vurderingen'}
          control={form.control}
          name={'dokumenterBruktIVurderingen'}
        >
          <DokumentTabell />
        </CheckboxWrapper>

        <TilknyttedeDokumenter dokumenter={form.watch('dokumenterBruktIVurderingen')} />

        <div>
          <Label size={'small'}>Følgende barn er oppgitt av søker og må vurderes for barnetillegg</Label>
          <BodyShort size={'small'}>
            Les dokumentene og tilknytt relevante dokumenter til vurdering om det skal beregnes barnetillegg
          </BodyShort>
        </div>
        <form
          className={'flex-column'}
          id={'barnetillegg'}
          onSubmit={form.handleSubmit((data) => {
            løsBehovOgGåTilNesteSteg({
              behandlingVersjon: behandlingsversjon,
              behov: {
                behovstype: Behovstype.AVKLAR_BARNETILLEGG_KODE,
                vurderingerForBarnetillegg: {
                  vurderteBarn: data.barnetilleggVurderinger.map((vurderteBarn) => {
                    return {
                      ident: { identifikator: vurderteBarn.ident, aktivIdent: false },
                      vurderinger: vurderteBarn.vurderinger.map((vurdering) => {
                        return {
                          begrunnelse: vurdering.begrunnelse,
                          harForeldreAnsvar: vurdering.harForeldreAnsvar === JaEllerNei.Ja,
                          periode: {
                            fom: vurdering.fom
                              ? formaterDatoForBackend(parse(vurdering.fom, DATO_FORMATER.ddMMyyyy, new Date()))
                              : '',
                            tom: vurdering.tom
                              ? formaterDatoForBackend(parse(vurdering.tom, DATO_FORMATER.ddMMyyyy, new Date()))
                              : '',
                          },
                        };
                      }),
                    };
                  }),
                },
              },
              referanse: behandlingsReferanse,
            });
          })}
        >
          {barnetilleggVurderinger.map((vurdering, barnetilleggIndex) => {
            return (
              <ManueltBarnVurdering
                key={vurdering.id}
                form={form}
                barnetilleggIndex={barnetilleggIndex}
                ident={vurdering.ident}
                readOnly={readOnly}
              />
            );
          })}
        </form>

        {grunnlag.folkeregisterbarn && grunnlag.folkeregisterbarn.length > 0 && (
          <>
            <Label size={'small'}>Følgende barn er funnet i folkeregisteret og vil gi grunnlag for barnetillegg</Label>
            {grunnlag.folkeregisterbarn.map((barn, index) => (
              <RegistrertBarn key={index} registrertBarn={barn} />
            ))}
          </>
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
