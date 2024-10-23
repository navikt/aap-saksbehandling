'use client';

import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Soningsgrunnlag } from 'lib/types/types';
import { InstitusjonsoppholdTabell } from '../InstitusjonsoppholdTabell';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { TextAreaWrapper, TextFieldWrapper, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { FormEvent } from 'react';
import { useFieldArray } from 'react-hook-form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { RadioGroupWrapper } from 'components/input/RadioGroupWrapper';
import { Radio } from '@navikt/ds-react';
import { validerDato } from 'lib/validation/dateValidation';
import { parse } from 'date-fns';

interface Props {
  grunnlag: Soningsgrunnlag;
  readOnly: boolean;
  behandlingsversjon: number;
}

interface FormFields {
  soningsvurderinger: Vurdering[];
}

interface Vurdering {
  begrunnelse: string;
  skalOpphøre: string;
  fraDato?: string;
}

export const Soningsvurdering = ({ grunnlag, readOnly, behandlingsversjon }: Props) => {
  const { isLoading, status, løsBehovOgGåTilNesteSteg } = useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');
  const behandlingsreferanse = useBehandlingsReferanse();

  console.log('grunnlag', grunnlag);

  const defaultValue: Vurdering[] = grunnlag.soningsforhold.map((soning) => {
    if (soning.vurdering) {
      return {
        begrunnelse: soning.vurdering.begrunnelse,
        skalOpphøre: soning.vurdering.skalOpphøre ? JaEllerNei.Ja : JaEllerNei.Nei,
        fraDato: formaterDatoForFrontend(soning.vurdering.fraDato),
      };
    } else {
      return {
        begrunnelse: '',
        skalOpphøre: '',
        fraDato: '',
      };
    }
  });

  const { form } = useConfigForm<FormFields>(
    {
      soningsvurderinger: {
        type: 'fieldArray',
        defaultValue: defaultValue,
      },
    },
    { shouldUnregister: true }
  );

  const { fields } = useFieldArray({ control: form.control, name: 'soningsvurderinger' });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behov: {
          behovstype: Behovstype.AVKLAR_SONINGSFORRHOLD,
          soningsvurdering: {
            vurderinger: data.soningsvurderinger.map((vurdering) => {
              return {
                begrunnelse: vurdering.begrunnelse,
                skalOpphore: vurdering.skalOpphøre === JaEllerNei.Ja,
                //@ts-ignore //TODO Hva skjer dersom ytelsen skal opphøre?
                fraDato: formaterDatoForBackend(parse(vurdering.fraDato, 'dd.MM.yyyy', new Date())),
              };
            }),
          },
        },
        behandlingVersjon: behandlingsversjon,
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Soning § 11-26'} steg={'DU_ER_ET_ANNET_STED'} icon={<PadlockLockedIcon />}>
      <Form onSubmit={handleSubmit} steg={'DU_ER_ET_ANNET_STED'} status={status} isLoading={isLoading}>
        <InstitusjonsoppholdTabell
          label="Søker har følgende soningsforhold"
          beskrivelse="Under opphold i fengsel har ikke søker rett på AAP. Om man soner utenfor fengsel eller arbeider utenfor anstalt har man likevel rett på AAP"
          instutisjonsopphold={grunnlag.soningsforhold.map((soningsforhold) => soningsforhold.info)}
        />
        {fields.map((field, index) => {
          return (
            <div key={field.id} className={'flex-column'}>
              <TextAreaWrapper
                name={`soningsvurderinger.${index}.begrunnelse`}
                control={form.control}
                label={
                  'Vurder om medlemmet soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning'
                }
                rules={{ required: 'Du må gi en begrunnelse' }}
                readOnly={readOnly}
              />
              <RadioGroupWrapper
                name={`soningsvurderinger.${index}.skalOpphøre`}
                control={form.control}
                label={'Skal ytelsen stoppes på grunn av soning?'}
                rules={{ required: 'Du må ta stilling til om ytelsen skal stoppes på grunn av soning' }}
                readOnly={readOnly}
              >
                <Radio value={JaEllerNei.Ja}>Ja</Radio>
                <Radio value={JaEllerNei.Nei}>Nei</Radio>
              </RadioGroupWrapper>
              {form.watch(`soningsvurderinger.${index}.skalOpphøre`) === JaEllerNei.Ja && (
                <TextFieldWrapper
                  type={'text'}
                  name={`soningsvurderinger.${index}.fraDato`}
                  control={form.control}
                  label={'Ytelsen skal opphøre fra dato'}
                  rules={{
                    required: 'Når ytelsen skal stoppes må du sette hvilken dato den skal stoppes fra',
                    validate: (value) => validerDato(value as string),
                  }}
                  readOnly={readOnly}
                />
              )}
            </div>
          );
        })}
      </Form>
    </VilkårsKort>
  );
};
