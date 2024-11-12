'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BandageIcon } from '@navikt/aksel-icons';
import { TextAreaWrapper, TextFieldWrapper, useConfigForm } from '@navikt/aap-felles-react';
import { useFieldArray } from 'react-hook-form';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { YrkesskadeTabell } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/yrkesskadetabell/YrkesskadeTabell';
import { BodyShort, Label } from '@navikt/ds-react';

import styles from './YrkesskadeGrunnlagBeregning.module.css';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  antattÅrligArbeidsinntekt: Inntekt[];
}

interface Inntekt {
  inntekt: string;
  begrunnelse: string;
  ref: string;
  skadetidspunkt: string;
  gverdi: number;
}

export const YrkesskadeGrunnlagBeregning = ({ behandlingVersjon, readOnly }: Props) => {
  console.log(behandlingVersjon);
  const { isLoading, status } = useLøsBehovOgGåTilNesteSteg('FASTSETT_GRUNNLAG');
  const defaultValue: Inntekt[] = [
    { ref: 'YRK', inntekt: '', begrunnelse: '', skadetidspunkt: '2020-10-10', gverdi: 124000 },
    { ref: 'SYK', inntekt: '', begrunnelse: '', skadetidspunkt: '2007-2-10', gverdi: 96000 },
  ];

  const { form } = useConfigForm<FormFields>(
    {
      antattÅrligArbeidsinntekt: {
        type: 'fieldArray',
        defaultValue: defaultValue,
      },
    },
    { readOnly: readOnly }
  );

  const { fields } = useFieldArray({ control: form.control, name: 'antattÅrligArbeidsinntekt' });

  return (
    <VilkårsKort
      heading={'Yrkesskade grunnlagsberegning § 11-19 / 11-22'}
      steg={'FASTSETT_GRUNNLAG'}
      icon={<BandageIcon />}
    >
      <Form onSubmit={form.handleSubmit(() => {})} steg={'FASTSETT_GRUNNLAG'} status={status} isLoading={isLoading}>
        <YrkesskadeTabell yrkesskader={[{ ref: 'YRK', kilde: 'Yrkesskaderegisteret', skadedato: '2024-10-10' }]} />
        {fields.map((field, index) => {
          const grunnlag = Number(form.watch(`antattÅrligArbeidsinntekt.${index}.inntekt`)) / field.gverdi;

          return (
            <div key={field.id} className={'flex-column'}>
              <div className={styles.inntektfelt}>
                <Label size="small">{`Anslått årlig arbeidsinntekt på skadetidspunkt ${formaterDatoForFrontend(field.skadetidspunkt)}`}</Label>
                <div className={styles.inntektwrapper}>
                  <TextFieldWrapper
                    label={`Anslått årlig arbeidsinntekt på skadetidspunkt ${formaterDatoForFrontend(field.skadetidspunkt)}`}
                    hideLabel
                    name={`antattÅrligArbeidsinntekt.${index}.inntekt`}
                    control={form.control}
                    type={'number'}
                    className={styles.input}
                    readOnly={readOnly}
                  />
                  <BodyShort>{grunnlag.toFixed(2)} G</BodyShort>
                </div>
              </div>
              <TextAreaWrapper
                name={`antattÅrligArbeidsinntekt.${index}.begrunnelse`}
                control={form.control}
                label={`Begrunnelse for anslått årlig arbeidsinntekt for skadetidspunkt ${formaterDatoForFrontend(field.skadetidspunkt)}`}
                readOnly={readOnly}
                className={'begrunnelse'}
              />
            </div>
          );
        })}
      </Form>
    </VilkårsKort>
  );
};
