'use client';

import { useFieldArray } from 'react-hook-form';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { YrkesskadeTabell } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/yrkesskadetabell/YrkesskadeTabell';
import { BodyShort, Label } from '@navikt/ds-react';

import styles from './YrkesskadeGrunnlagBeregning.module.css';
import { YrkeskadeBeregningGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  behandlingVersjon: number;
  yrkeskadeBeregningGrunnlag: YrkeskadeBeregningGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  vurderinger: AntattÅrligInntektVurdering[];
}

interface AntattÅrligInntektVurdering {
  inntekt: string;
  begrunnelse: string;
  ref: string;
  skadetidspunkt: string;
  gverdi: number;
}

export const YrkesskadeGrunnlagBeregning = ({ readOnly, yrkeskadeBeregningGrunnlag, behandlingVersjon }: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_GRUNNLAG');
  const behandlingsReferanse = useBehandlingsReferanse();
  const defaultValue: AntattÅrligInntektVurdering[] = yrkeskadeBeregningGrunnlag.skalVurderes.map((yrkesskade) => {
    const vurdertYrkesskade = yrkeskadeBeregningGrunnlag.vurderinger.find(
      (vurdering) => vurdering.referanse === yrkesskade.referanse
    );
    return {
      ref: yrkesskade.referanse,
      gverdi: yrkesskade.grunnbeløp.verdi,
      skadetidspunkt: yrkesskade.skadeDato,
      inntekt: vurdertYrkesskade ? vurdertYrkesskade.antattÅrligInntekt.verdi.toString() : '',
      begrunnelse: vurdertYrkesskade ? vurdertYrkesskade.begrunnelse : '',
    };
  });

  const { form } = useConfigForm<FormFields>(
    {
      vurderinger: {
        type: 'fieldArray',
        defaultValue: defaultValue,
      },
    },
    { readOnly: readOnly }
  );

  const { fields } = useFieldArray({ control: form.control, name: 'vurderinger' });

  return (
    <VilkårsKortMedForm
      heading={'Yrkesskade grunnlagsberegning §§ 11-19 / 11-22'}
      steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
      onSubmit={form.handleSubmit((data) => {
        løsBehovOgGåTilNesteSteg({
          behov: {
            behovstype: Behovstype.FASTSETT_YRKESSKADEINNTEKT,
            yrkesskadeInntektVurdering: {
              vurderinger: data.vurderinger.map((vurdering) => {
                return {
                  begrunnelse: vurdering.begrunnelse,
                  antattÅrligInntekt: { verdi: Number(vurdering.inntekt) },
                  referanse: vurdering.ref,
                };
              }),
            },
          },
          referanse: behandlingsReferanse,
          behandlingVersjon: behandlingVersjon,
        });
      })}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      erAktivtSteg={true}
      vilkårTilhørerNavKontor={false}
    >
      <YrkesskadeTabell
        yrkesskader={yrkeskadeBeregningGrunnlag.skalVurderes.map((vurdering) => {
          return { kilde: 'YRK', ref: vurdering.referanse, skadedato: vurdering.skadeDato };
        })}
      />
      {fields.map((field, index) => {
        const grunnlag = Number(form.watch(`vurderinger.${index}.inntekt`)) / field.gverdi;

        return (
          <div key={field.id} className={'flex-column'}>
            <TextAreaWrapper
              name={`vurderinger.${index}.begrunnelse`}
              control={form.control}
              label={`Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt ${formaterDatoForFrontend(field.skadetidspunkt)}`}
              readOnly={readOnly}
              className={'begrunnelse'}
            />
            <div className={styles.inntektfelt}>
              <Label size="small">{`Anslått årlig arbeidsinntekt på skadetidspunkt ${formaterDatoForFrontend(field.skadetidspunkt)}`}</Label>
              <div className={styles.inntektwrapper}>
                <TextFieldWrapper
                  label={`Anslått årlig arbeidsinntekt på skadetidspunkt ${formaterDatoForFrontend(field.skadetidspunkt)}`}
                  hideLabel
                  name={`vurderinger.${index}.inntekt`}
                  control={form.control}
                  type={'number'}
                  className={'inntekt_input'}
                  readOnly={readOnly}
                />
                <BodyShort>{grunnlag.toFixed(2)} G</BodyShort>
              </div>
            </div>
          </div>
        );
      })}
    </VilkårsKortMedForm>
  );
};
