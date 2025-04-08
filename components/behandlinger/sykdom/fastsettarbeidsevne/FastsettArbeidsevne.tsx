'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormEvent } from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
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
import { Button, Link } from '@navikt/ds-react';
import { pipe } from 'lib/utils/functional';
import { erProsent } from 'lib/utils/validering';
import { useConfigForm } from 'components/form/FormHook';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';

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
  const defaultValues: Arbeidsevnevurderinger[] =
    grunnlag?.vurderinger?.map((vurdering) => ({
      begrunnelse: vurdering.begrunnelse,
      arbeidsevne: vurdering.arbeidsevne.toString(),
      fom: formaterDatoForFrontend(vurdering.fraDato),
    })) || [];

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

  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_ARBEIDSEVNE');
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

  const showAsOpen = !!grunnlag?.vurderinger && grunnlag.vurderinger.length >= 1;
  const skalViseBekreftKnapp = !readOnly && arbeidsevneVurderinger.length > 0;

  return (
    <VilkårsKort
      heading={'§ 11-23 andre ledd. Arbeidsevne som ikke er utnyttet'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      vilkårTilhørerNavKontor={true}
      defaultOpen={showAsOpen}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        resetStatus={resetStatus}
        isLoading={isLoading}
        steg={'FASTSETT_ARBEIDSEVNE'}
        visBekreftKnapp={skalViseBekreftKnapp}
      >
        <Link href={'https://lovdata.no/pro/rundskriv/r11-00/KAPITTEL_26-3'} target="_blank">
          Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-23 (lovdata.no)
        </Link>
        {arbeidsevneVurderinger.map((vurdering, index) => (
          <div key={vurdering.id} className={`${styles.vurdering} flex-column`}>
            <TextAreaWrapper
              label={'Vilkårsvurdering'}
              description={
                'Vurder om brukeren har en arbeidsevne som ikke er utnyttet. Hvis det ikke legges inn en vurdering, har brukeren rett på full ytelse.'
              }
              control={form.control}
              name={`arbeidsevnevurderinger.${index}.begrunnelse`}
              rules={{ required: 'Du må begrunne vurderingen din' }}
              className={'begrunnelse'}
              readOnly={readOnly}
            />
            <div className={styles.rad}>
              <div>
                <TextFieldWrapper
                  control={form.control}
                  name={`arbeidsevnevurderinger.${index}.arbeidsevne`}
                  type={'text'}
                  label={'Oppgi arbeidsevnen som ikke er utnyttet i prosent'}
                  rules={{
                    required: 'Du må angi hvor stor arbeidsevne bruker har',
                    validate: (value) => {
                      const valueAsNumber = Number(value);
                      if (isNaN(valueAsNumber)) {
                        return 'Prosent må være et tall';
                      } else if (!erProsent(valueAsNumber)) {
                        return 'Prosent kan bare være mellom 0 og 100';
                      }
                    },
                  }}
                  readOnly={readOnly}
                  className="prosent_input"
                />
                <div className={styles.timekolonne}>
                  {regnOmTilTimer(form.watch(`arbeidsevnevurderinger.${index}.arbeidsevne`))}
                </div>
              </div>
            </div>
            <DateInputWrapper
              control={form.control}
              name={`arbeidsevnevurderinger.${index}.fom`}
              label={'Vurderingen gjelder fra'}
              rules={{
                required: 'Du må angi datoen arbeidsevnen gjelder fra',
                validate: (value) => validerDato(value as string),
              }}
              readOnly={readOnly}
            />
            {!readOnly && (
              <div>
                <Button
                  onClick={() => remove(index)}
                  type={'button'}
                  variant={'tertiary'}
                  size={'small'}
                  icon={<TrashIcon aria-hidden />}
                >
                  Fjern vurdering
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
              variant={'secondary'}
              size={'small'}
            >
              Legg til ny vurdering
            </Button>
          </div>
        )}
      </Form>
    </VilkårsKort>
  );
};
