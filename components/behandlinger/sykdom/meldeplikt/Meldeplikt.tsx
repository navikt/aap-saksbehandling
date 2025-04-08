'use client';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Link, Radio, VStack } from '@navikt/ds-react';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FritakMeldepliktGrunnlag } from 'lib/types/types';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';
import { useFieldArray } from 'react-hook-form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';

import styles from './Meldeplikt.module.css';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { useConfigForm } from 'components/form/FormHook';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';

type Props = {
  behandlingVersjon: number;
  grunnlag?: FritakMeldepliktGrunnlag;
  readOnly: boolean;
};

type Fritaksvurderinger = {
  begrunnelse: string;
  harFritak: string;
  fraDato: string;
};

type FritakMeldepliktFormFields = {
  fritaksvurderinger: Fritaksvurderinger[];
};

export const Meldeplikt = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  let defaultValues: Fritaksvurderinger[] =
    grunnlag?.vurderinger.map((vurdering) => ({
      begrunnelse: vurdering.begrunnelse,
      fraDato: formaterDatoForFrontend(vurdering.fraDato),
      harFritak: vurdering.harFritak ? JaEllerNei.Ja : JaEllerNei.Nei,
    })) || [];

  const { form } = useConfigForm<FritakMeldepliktFormFields>({
    fritaksvurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValues,
    },
  });

  const {
    fields: fritakMeldepliktVurderinger,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'fritaksvurderinger',
  });

  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus } = useLøsBehovOgGåTilNesteSteg('FRITAK_MELDEPLIKT');
  const behandlingsreferanse = useBehandlingsReferanse();

  const skalViseBekreftKnapp = !readOnly && fritakMeldepliktVurderinger.length > 0;
  {
    /*
  const simulate = async () => {
    const validationResult = await form.trigger(); // force validation
    if (validationResult) {
      const vurderinger: FritaksvurderingDto[] = form.getValues().fritaksvurderinger.map((vurdering) => ({
        begrunnelse: vurdering.begrunnelse,
        harFritak: vurdering.harFritak === JaEllerNei.Ja,
        fraDato: formaterDatoForBackend(parse(vurdering.fraDato, 'dd.MM.yyyy', new Date())),
      }));

      // @ts-ignore THOMAS! HJELP!
      const res: SimulertMeldeplikt = await simulerMeldeplikt(behandlingsreferanse, {
        fritaksvurderinger: vurderinger,
      });
    } else {
      console.log(`form is not valid ${validationResult}`);
    }
  };
  */
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        referanse: behandlingsreferanse,
        behov: {
          behovstype: Behovstype.FRITAK_MELDEPLIKT_KODE,
          fritaksvurderinger: data.fritaksvurderinger.map((periode) => ({
            begrunnelse: periode.begrunnelse,
            harFritak: periode.harFritak === JaEllerNei.Ja,
            fraDato: formaterDatoForBackend(parse(periode.fraDato, 'dd.MM.yyyy', new Date())),
          })),
        },
      });
    })(event);
  };

  const showAsOpen = !!grunnlag?.vurderinger && grunnlag.vurderinger.length > 0;

  return (
    <VilkårsKort
      heading={'§ 11-10 tredje ledd. Unntak fra meldeplikt'}
      steg="FRITAK_MELDEPLIKT"
      vilkårTilhørerNavKontor
      defaultOpen={showAsOpen}
    >
      <VStack gap={'4'}>
        <Link href={'https://lovdata.no/pro/rundskriv/r11-00/KAPITTEL_12'} target="_blank">
          Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-10 (lovdata.no)
        </Link>

        <Form
          onSubmit={handleSubmit}
          status={status}
          resetStatus={resetStatus}
          isLoading={isLoading}
          steg={'FRITAK_MELDEPLIKT'}
          visBekreftKnapp={skalViseBekreftKnapp}
        >
          {fritakMeldepliktVurderinger.map((vurdering, index) => (
            <div className={`${styles.vurdering} flex-column`} key={vurdering.id}>
              <TextAreaWrapper
                label={'Vilkårsvurdering'}
                control={form.control}
                name={`fritaksvurderinger.${index}.begrunnelse`}
                rules={{ required: 'Du må begrunne vurderingen din' }}
                className={'begrunnelse'}
                readOnly={readOnly}
              />
              <RadioGroupWrapper
                label={'Skal bruker få fritak fra meldeplikt?'}
                control={form.control}
                name={`fritaksvurderinger.${index}.harFritak`}
                rules={{ required: 'Du må svare på om bruker skal få fritak fra meldeplikt' }}
                readOnly={readOnly}
                horisontal
              >
                <Radio value={JaEllerNei.Ja}>Ja</Radio>
                <Radio value={JaEllerNei.Nei}>Nei</Radio>
              </RadioGroupWrapper>
              <DateInputWrapper
                label={'Vurderingen gjelder fra'}
                control={form.control}
                name={`fritaksvurderinger.${index}.fraDato`}
                rules={{
                  required: 'Du må angi en dato vurderingen gjelder fra',
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
                    icon={<TrashIcon aria-hidden />}
                    size={'small'}
                  >
                    Fjern periode
                  </Button>
                </div>
              )}
            </div>
          ))}
          {!readOnly && (
            <>
              <div>
                <Button
                  onClick={() => append({ begrunnelse: '', harFritak: '', fraDato: '' })}
                  type={'button'}
                  variant={'secondary'}
                  size={'small'}
                >
                  Legg til periode
                </Button>
              </div>
              {/*<div>
              <Button
                onClick={() => simulate()}
                type={'button'}
                variant={'secondary'}
                size={'medium'}
                icon={<TestFlaskIcon aria-hidden />}
              >
                Simuler
              </Button>
            </div>*/}
            </>
          )}
        </Form>
      </VStack>
    </VilkårsKort>
  );
};
