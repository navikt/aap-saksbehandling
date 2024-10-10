'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormEvent } from 'react';

import { PercentIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { SelectWrapper, TextAreaWrapper, TextFieldWrapper, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';

import { useFieldArray } from 'react-hook-form';
import { validerDato } from 'lib/validation/dateValidation';
import { ArbeidsevneGrunnlag } from 'lib/types/types';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';
import { parse } from 'date-fns';

import styles from './FastsettArbeidsevne.module.css';
import { Button } from '@navikt/ds-react';

interface Props {
  grunnlag?: ArbeidsevneGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

type Arbeidsevnevurderinger = {
  begrunnelse: string;
  arbeidsevne: string;
  enhet: 'PROSENT' | 'TIMER';
  fom: string;
};

type FastsettArbeidsevneFormFields = {
  arbeidsevnevurderinger: Arbeidsevnevurderinger[];
};

export const FastsettArbeidsevne = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const defaultValues: Arbeidsevnevurderinger[] = grunnlag?.vurderinger.map((vurdering) => ({
    begrunnelse: vurdering.begrunnelse,
    arbeidsevne: vurdering.arbeidsevne.toString(),
    enhet: 'PROSENT',
    fom: formaterDatoForFrontend(vurdering.fraDato),
  })) || [{ begrunnelse: '', arbeidsevne: '', enhet: 'PROSENT', fom: '' }];

  const { form } = useConfigForm<FastsettArbeidsevneFormFields>({
    arbeidsevnevurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValues,
    },
  });

  const {
    fields: arbeidsevneVurderinger,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'arbeidsevnevurderinger',
  });

  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('FASTSETT_ARBEIDSEVNE');
  const behandlingsreferanse = useBehandlingsReferanse();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsreferanse,
        behov: {
          behovstype: Behovstype.FASTSETT_ARBEIDSEVNE_KODE,
          arbeidsevneVurderinger: data.arbeidsevnevurderinger.map((vurdering) => ({
            arbeidsevne: Number.parseInt(vurdering.arbeidsevne, 10),
            begrunnelse: vurdering.begrunnelse,
            fraDato: formaterDatoForBackend(parse(vurdering.fom, 'dd.MM.yyyy', new Date())),
          })),
        },
      });
    })(event);
  };

  return (
    <VilkårsKort
      heading={'Reduksjon av maks utbetalt ytelse ved delvis nedsatt arbeidsevne § 11-23 2.ledd (valgfritt)'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      vilkårTilhørerNavKontor={true}
      defaultOpen={false}
      icon={<PercentIcon />}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'FASTSETT_ARBEIDSEVNE'}
        visBekreftKnapp={!readOnly}
      >
        {arbeidsevneVurderinger.map((vurdering, index) => (
          <div key={vurdering.id} className={`${styles.vurdering} flex-column`}>
            <TextAreaWrapper
              label={'Vurder om innbygger har arbeidsevne'}
              description={'Hvis ikke annet er oppgitt, så antas innbygger å ha 0% arbeidsevne og rett på full ytelse'}
              control={form.control}
              name={`arbeidsevnevurderinger.${index}.begrunnelse`}
              rules={{ required: 'Du må begrunne vurderingen din' }}
              readOnly={readOnly}
            />
            <div className={styles.rad}>
              <TextFieldWrapper
                control={form.control}
                name={`arbeidsevnevurderinger.${index}.arbeidsevne`}
                type={'text'}
                label={'Arbeidsevne'}
                rules={{ required: 'Du må angi hvor stor arbeidsevne innbygger har' }}
                readOnly={readOnly}
              />
              <SelectWrapper
                name={`arbeidsevnevurderinger.${index}.enhet`}
                control={form.control}
                label="Enhet"
                readOnly={readOnly}
                rules={{ required: 'Du må angi en enhet for arbeidsevnen' }}
              >
                <option value={'PROSENT'}>%</option>
                <option value={'TIMER'}>T</option>
              </SelectWrapper>
            </div>
            <TextFieldWrapper
              type="text"
              control={form.control}
              description={'Datoformat: dd.mm.åååå'}
              name={`arbeidsevnevurderinger.${index}.fom`}
              label={'Arbeidsevne gjelder fra'}
              rules={{
                required: 'Du må angi datoen arbeidsevnen gjelder fra',
                validate: (value) => validerDato(value as string),
              }}
              readOnly={readOnly}
            />
            {!readOnly && arbeidsevneVurderinger.length > 1 && (
              <div>
                <Button onClick={() => remove(index)} type={'button'} variant={'tertiary'} icon={<TrashIcon />}>
                  Fjern periode
                </Button>
              </div>
            )}
          </div>
        ))}
        {!readOnly && (
          <div>
            <Button
              onClick={() => append({ begrunnelse: '', arbeidsevne: '', enhet: 'PROSENT', fom: '' })}
              type={'button'}
              variant={'tertiary'}
              size={'medium'}
              icon={<PlusCircleIcon />}
            >
              Legg til vurdering
            </Button>
          </div>
        )}
      </Form>
    </VilkårsKort>
  );
};
