'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { Behovstype, getJaNeiEllerUndefined, getStringEllerUndefined } from 'lib/utils/form';
import { formaterDatoForBackend, stringToDate } from 'lib/utils/date';
import { BeregningsGrunnlag, BeregningsVurdering } from 'lib/types/types';
import { numberToString } from 'lib/utils/string';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Heading } from '@navikt/ds-react';
import { Grunnlag1119 } from 'components/behandlinger/grunnlag/fastsettberegning/Grunnlag1119';

import styles from './Grunnlag1119.module.css';
import { LabelValuePair } from 'components/labelvaluepair/LabelValuePair';

interface Props {
  vurdering?: BeregningsVurdering;
  grunnlag?: BeregningsGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
  ytterligereNedsattArbeidsevneDato: Date;
  antattÅrligInntekt: string;
}

export const FastsettBeregning = ({ vurdering, grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading } = useLøsBehovOgGåTilNesteSteg('FASTSETT_BEREGNINGSTIDSPUNKT');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'text',
        label: 'Begrunnelse',
        defaultValue: getStringEllerUndefined(vurdering?.begrunnelse),
      },
      ytterligereNedsattArbeidsevneDato: {
        type: 'date',
        label: 'Ytterligere nedsatt arbeidsevne dato',
        defaultValue: stringToDate(vurdering?.ytterligereNedsattArbeidsevneDato),
      },
      antattÅrligInntekt: {
        type: 'number',
        label: 'Antatt årlig inntekt',
        defaultValue: numberToString(vurdering?.antattÅrligInntekt),
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE,
          beregningVurdering: {
            begrunnelse: data.begrunnelse,
            ytterligereNedsattArbeidsevneDato: formaterDatoForBackend(data.ytterligereNedsattArbeidsevneDato),
            antattÅrligInntekt: data.antattÅrligInntekt ? { verdi: Number(data.antattÅrligInntekt) } : undefined,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Fastsett beregning'} steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}>
      <Form
        steg={'FASTSETT_BEREGNINGSTIDSPUNKT'}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        status={status}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.ytterligereNedsattArbeidsevneDato} />
        <FormField form={form} formField={formFields.antattÅrligInntekt} />
      </Form>

      {grunnlag && (
        <div className={'flex-column'}>
          <Heading size={'small'}>Utregning</Heading>
          <div className={styles.grunnlagvisning}>
            <LabelValuePair label={'Faktagrunnlag'} value={JSON.stringify(grunnlag.faktagrunnlag)} />
            <LabelValuePair label={'Grunnlag'} value={JSON.stringify(grunnlag.grunnlag.verdi)} />
          </div>

          <Heading size={'small'}>Grunnlag 11-19</Heading>
          <Grunnlag1119 grunnlag={grunnlag.grunnlag11_19} />

          {grunnlag.grunnlagUføre && (
            <>
              <Heading size={'small'}>Grunnlag uføre</Heading>
              <div className={styles.grunnlagvisning}>
                <LabelValuePair
                  label={'Er 6G begrenset?'}
                  value={getJaNeiEllerUndefined(grunnlag.grunnlagUføre.er6GBegrenset)}
                />
                <LabelValuePair
                  label={'Er gjennomsnitt?'}
                  value={getJaNeiEllerUndefined(grunnlag.grunnlagUføre.erGjennomsnitt)}
                />

                <LabelValuePair label={'grunnlaget'} value={grunnlag.grunnlagUføre.grunnlaget} />
                <LabelValuePair label={'type'} value={grunnlag.grunnlagUføre.type} />
                <LabelValuePair label={'Uføre inntekt i kroner?'} value={grunnlag.grunnlagUføre.uføreInntektIKroner} />
                <LabelValuePair
                  label={'Uføre ytterligere nedsatt arbeidsevn år?'}
                  value={grunnlag.grunnlagUføre.uføreYtterligereNedsattArbeidsevneÅr}
                />
                <LabelValuePair label={'Uføregrad'} value={grunnlag.grunnlagUføre.uføregrad} />
              </div>
              <Heading size={'small'}>Grunnlag Uføre (11-19)</Heading>
              <Grunnlag1119 grunnlag={grunnlag.grunnlagUføre.grunnlag} />
              <Heading size={'small'}>Grunnlag ytterligere nedsatt (11-19)</Heading>
              <Grunnlag1119 grunnlag={grunnlag.grunnlagUføre.grunnlagYtterligereNedsatt} />
            </>
          )}

          {grunnlag.grunnlagYrkesskade && (
            <>
              <Heading size={'small'}>Grunnlag Yrkesskade</Heading>
              <div className={styles.grunnlagvisning}>
                <LabelValuePair
                  label={'Andel som ikke skyldes yrkesskade'}
                  value={grunnlag.grunnlagYrkesskade.andelSomIkkeSkyldesYrkesskade}
                />
                <LabelValuePair
                  label={'Andel som skyldes yrkesskade'}
                  value={grunnlag.grunnlagYrkesskade.andelSomSkyldesYrkesskade}
                />
                <LabelValuePair label={'Andel yrkesskade?'} value={grunnlag.grunnlagYrkesskade.andelYrkesskade} />
                <LabelValuePair
                  label={'Antatt årlig inntekt yrkesskade tidspunktet?'}
                  value={grunnlag.grunnlagYrkesskade.antattÅrligInntektYrkesskadeTidspunktet}
                />
                <LabelValuePair
                  label={'benyttet andel for yrkesskaden?'}
                  value={grunnlag.grunnlagYrkesskade.benyttetAndelForYrkesskade}
                />
                <LabelValuePair
                  label={'er 6G begrenset?'}
                  value={getJaNeiEllerUndefined(grunnlag.grunnlagYrkesskade.er6GBegrenset)}
                />
                <LabelValuePair
                  label={'er gjennomsnitt?'}
                  value={getJaNeiEllerUndefined(grunnlag.grunnlagYrkesskade.er6GBegrenset)}
                />
                <LabelValuePair
                  label={'Grunnlag etter yrkesskade fordel'}
                  value={grunnlag.grunnlagYrkesskade.grunnlagEtterYrkesskadeFordel}
                />
                <LabelValuePair
                  label={'grunnlag for beregning av yrkesskade andel'}
                  value={grunnlag.grunnlagYrkesskade.grunnlagForBeregningAvYrkesskadeandel}
                />
                <LabelValuePair label={'grunnlaget'} value={grunnlag.grunnlagYrkesskade.grunnlaget} />
                <LabelValuePair
                  label={'terskelverdi for yrkesskade'}
                  value={grunnlag.grunnlagYrkesskade.terskelverdiForYrkesskade}
                />
                <LabelValuePair label={'yrkesskadetidspunkt'} value={grunnlag.grunnlagYrkesskade.yrkesskadeTidspunkt} />
                <LabelValuePair
                  label={'yrkesskade inntekt i G'}
                  value={grunnlag.grunnlagYrkesskade.yrkesskadeinntektIG}
                />
              </div>
              <Heading size={'small'}>grunnlag Yrkesskade (11-19) </Heading>
              <Grunnlag1119 grunnlag={grunnlag.grunnlagYrkesskade.beregningsgrunnlag} />
            </>
          )}
        </div>
      )}
    </VilkårsKort>
  );
};
