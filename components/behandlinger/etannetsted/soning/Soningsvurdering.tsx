'use client';

import { PadlockLockedIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Soningsgrunnlag } from 'lib/types/types';
import { InstitusjonsoppholdTabell } from '../InstitusjonsoppholdTabell';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { DateInputWrapper, TextAreaWrapper, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { FormEvent } from 'react';
import { useFieldArray } from 'react-hook-form';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { RadioGroupWrapper } from 'components/input/RadioGroupWrapper';
import { BodyShort, Button, Label, Radio } from '@navikt/ds-react';
import { validerDato } from 'lib/validation/dateValidation';
import { parse } from 'date-fns';

import styles from './Soningsvurdering.module.css';

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
  fraDato: string;
}

export const Soningsvurdering = ({ grunnlag, readOnly, behandlingsversjon }: Props) => {
  const { isLoading, status, løsBehovOgGåTilNesteSteg } = useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');
  const behandlingsreferanse = useBehandlingsReferanse();

  const defaultValue: Vurdering[] = grunnlag.vurderinger.map((forhold) => {
    if (forhold.vurdering) {
      return {
        begrunnelse: forhold.vurdering.begrunnelse,
        skalOpphøre: forhold.vurdering.skalOpphøre ? JaEllerNei.Ja : JaEllerNei.Nei,
        fraDato: formaterDatoForFrontend(forhold.vurdering.fraDato),
      };
    } else {
      return {
        begrunnelse: '',
        skalOpphøre: '',
        fraDato: formaterDatoForFrontend(forhold.vurderingsdato),
      };
    }
  });

  const { form } = useConfigForm<FormFields>({
    soningsvurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValue,
    },
  });

  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'soningsvurderinger' });

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
      <Form
        onSubmit={handleSubmit}
        steg={'DU_ER_ET_ANNET_STED'}
        status={status}
        isLoading={isLoading}
        visBekreftKnapp={!readOnly}
      >
        <InstitusjonsoppholdTabell
          label="Søker har følgende soningsforhold"
          beskrivelse="Under opphold i fengsel har ikke søker rett på AAP. Om man soner utenfor fengsel eller arbeider utenfor anstalt har man likevel rett på AAP"
          instutisjonsopphold={grunnlag.soningsforhold}
        />
        {fields.map((field, index) => {
          const erFørsteVurdering = index === 0;
          return (
            <div key={field.id} className={styles.vurdering}>
              <TextAreaWrapper
                name={`soningsvurderinger.${index}.begrunnelse`}
                control={form.control}
                label={
                  'Vurder om medlemmet soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning'
                }
                rules={{ required: 'Du må gi en begrunnelse' }}
                className={'begrunnelse'}
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
              {erFørsteVurdering ? (
                <div>
                  <Label size={'small'}>Vurderingen gjelder fra dato</Label>
                  <BodyShort>{field.fraDato}</BodyShort>
                </div>
              ) : (
                <DateInputWrapper
                  name={`soningsvurderinger.${index}.fraDato`}
                  control={form.control}
                  label={'Vurderingen skal gjelde fra dato'}
                  rules={{
                    required: 'Du må sette en dato for når vurderingen skal gjelde fra',
                    validate: (value) => validerDato(value as string),
                  }}
                  readOnly={readOnly}
                />
              )}
              {!erFørsteVurdering && !readOnly && (
                <Button
                  type={'button'}
                  icon={<TrashIcon />}
                  className={'fit-content'}
                  variant={'tertiary'}
                  size={'small'}
                  onClick={() => remove(index)}
                >
                  Fjern vurdering
                </Button>
              )}
            </div>
          );
        })}
        {!readOnly && (
          <Button
            type={'button'}
            icon={<PlusCircleIcon />}
            className={'fit-content'}
            variant={'tertiary'}
            size={'small'}
            onClick={() => append({ begrunnelse: '', fraDato: '', skalOpphøre: '' })}
          >
            Legg til ny vurdering
          </Button>
        )}
      </Form>
    </VilkårsKort>
  );
};
