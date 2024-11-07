'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { HandBandageIcon } from '@navikt/aksel-icons';
import { Veiledning } from 'components/veiledning/Veiledning';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { CheckboxWrapper } from 'components/input/CheckboxWrapper';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { YrkesskadeVurderingGrunnlag } from 'lib/types/types';

interface Props {
  yrkesskadeVurderingGrunnlag: YrkesskadeVurderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  behandlingsReferanse: string;
}

interface FormFields {
  begrunnelse: string;
  erÅrsakssammenheng: string;
  relevanteSaker?: string[];
  andelAvNedsettelsen?: number;
}

export const Yrkesskade = ({
  yrkesskadeVurderingGrunnlag,
  behandlingVersjon,
  behandlingsReferanse,
  readOnly,
}: Props) => {
  console.log(yrkesskadeVurderingGrunnlag);

  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('VURDER_YRKESSKADE');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om yrkesskade er medvirkende årsak til nedsatt arbeidsevne',
        defaultValue: yrkesskadeVurderingGrunnlag.yrkesskadeVurdering?.begrunnelse,
        rules: { required: 'Du må begrunne' },
      },
      erÅrsakssammenheng: {
        type: 'radio',
        label: 'Finnes det en årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(yrkesskadeVurderingGrunnlag.yrkesskadeVurdering?.erÅrsakssammenheng),
        rules: { required: 'Du må svare på om det finnes en årsakssammenheng' },
      },
      relevanteSaker: {
        type: 'checkbox_nested',
      },
      andelAvNedsettelsen: {
        type: 'number',
        label: 'Hvor stor andel totalt av nedsatt arbeidsevne skyldes yrkesskadene?',
        defaultValue: yrkesskadeVurderingGrunnlag.yrkesskadeVurdering?.andelAvNedsettelsen?.toString(),
        rules: { required: 'Du må svare på hvor stor andel av den nedsatte arbeidsevnen skyldes yrkesskadene' },
      },
    },
    { readOnly }
  );

  return (
    <VilkårsKort
      heading={'Yrkesskade §§ 11-22 1.ledd'}
      steg={'VURDER_YRKESSKADE'}
      vilkårTilhørerNavKontor={false}
      icon={<HandBandageIcon />}
    >
      <Form
        steg={'VURDER_YRKESSKADE'}
        onSubmit={form.handleSubmit((data) => {
          løsBehovOgGåTilNesteSteg({
            behov: {
              behovstype: Behovstype.YRKESSKADE_KODE,
              yrkesskadesvurdering: {
                begrunnelse: data.begrunnelse,
                erÅrsakssammenheng: data.erÅrsakssammenheng === JaEllerNei.Ja,
                andelAvNedsettelsen: data?.andelAvNedsettelsen,
                relevanteSaker: ['YRK'],
              },
            },
            behandlingVersjon: behandlingVersjon,
            referanse: behandlingsReferanse,
          });
        })}
        isLoading={isLoading}
        status={status}
      >
        <Veiledning />
        <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
        <FormField form={form} formField={formFields.erÅrsakssammenheng} />
        <CheckboxWrapper
          name={'relevanteSaker'}
          control={form.control}
          label={'Tilknytt eventuelle yrkesskader som er helt eller delvis årsak til den nedsatte arbeidsevnen.'}
          readOnly={readOnly}
          // rules={{ required: 'Du må velge minst én yrkesskade' }}
        >
          <div></div>
        </CheckboxWrapper>
        <FormField form={form} formField={formFields.andelAvNedsettelsen} />
      </Form>
    </VilkårsKort>
  );
};
