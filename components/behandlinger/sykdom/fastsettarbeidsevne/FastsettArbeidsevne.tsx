'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormEvent } from 'react';

import { PercentIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { TextAreaWrapper, TextFieldWrapper, useConfigForm } from '@navikt/aap-felles-react';
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
import { pipe } from 'lib/utils/functional';
import { Veiledning } from 'components/veiledning/Veiledning';

interface Props {
  grunnlag?: ArbeidsevneGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

type Arbeidsevnevurderinger = {
  begrunnelse: string;
  arbeidsevne: string;
  fom: string;
};

type FastsettArbeidsevneFormFields = {
  arbeidsevnevurderinger: Arbeidsevnevurderinger[];
};

const ANTALL_TIMER_FULL_UKE = 37.5;

const prosentTilTimer = (prosent: string): number => (Number.parseInt(prosent, 10) / 100) * ANTALL_TIMER_FULL_UKE;
const rundNedTilNaermesteHalve = (tall: number): number => Math.floor(tall * 2) / 2;
const tilNorskDesimalFormat = (tall: number): string => tall.toLocaleString('no-NB');
const tilAvrundetTimetall = pipe<string>(prosentTilTimer, rundNedTilNaermesteHalve, tilNorskDesimalFormat);

const regnOmTilTimer = (value: string) => {
  if (!value) {
    return undefined;
  }
  return `(${tilAvrundetTimetall(value)} timer)`;
};

export const FastsettArbeidsevne = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const defaultValues: Arbeidsevnevurderinger[] = grunnlag?.vurderinger.map((vurdering) => ({
    begrunnelse: vurdering.begrunnelse,
    arbeidsevne: vurdering.arbeidsevne.toString(),
    fom: formaterDatoForFrontend(vurdering.fraDato),
  })) || [{ begrunnelse: '', arbeidsevne: '', fom: '' }];

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

  const showAsOpen = !!(readOnly && grunnlag?.vurderinger && grunnlag.vurderinger.length >= 1);

  return (
    <VilkårsKort
      heading={'Vurdering av etablert og uutnyttet arbeidsevne'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      vilkårTilhørerNavKontor={true}
      defaultOpen={showAsOpen}
      icon={<PercentIcon />}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'FASTSETT_ARBEIDSEVNE'}
        visBekreftKnapp={!readOnly}
      >
        <Veiledning defaultOpen={false} />
        {arbeidsevneVurderinger.map((vurdering, index) => (
          <div key={vurdering.id} className={`${styles.vurdering} flex-column`}>
            <TextAreaWrapper
              label={'Vurder om innbygger har arbeidsevne som er utnyttet eller ikke utnyttet'}
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
                label={'Oppgi den etablerte arbeidsevnen eller den uutnyttede arbeidsevnen i prosent'}
                rules={{ required: 'Du må angi hvor stor arbeidsevne innbygger har' }}
                readOnly={readOnly}
              />
              <div className={styles.timekolonne}>
                {regnOmTilTimer(form.watch(`arbeidsevnevurderinger.${index}.arbeidsevne`))}
                {/*
                {prosentTilTimer(form.watch(`arbeidsevnevurderinger.${index}.arbeidsevne`)) + ' timer'}
		*/}
              </div>
            </div>
            <TextFieldWrapper
              type="text"
              control={form.control}
              description={'Datoformat: dd.mm.åååå'}
              name={`arbeidsevnevurderinger.${index}.fom`}
              label={'Den etablerte eller uutnyttede arbeidsevnen gjelder fra'}
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
              onClick={() => append({ begrunnelse: '', arbeidsevne: '', fom: '' })}
              type={'button'}
              variant={'tertiary'}
              size={'medium'}
              icon={<PlusCircleIcon />}
            >
              Legg til ny arbeidsevne
            </Button>
          </div>
        )}
      </Form>
    </VilkårsKort>
  );
};
