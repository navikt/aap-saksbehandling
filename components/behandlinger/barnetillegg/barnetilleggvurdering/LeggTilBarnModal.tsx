import { Button, Checkbox, Modal, Radio, VStack } from '@navikt/ds-react';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { useForm } from 'react-hook-form';
import { CheckboxWrapper } from 'components/form/checkboxwrapper/CheckboxWrapper';
import { BarneTilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { erGyldigFødselsnummer } from 'lib/utils/fnr';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { DATO_FORMATER, formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  readOnly: boolean;
  avbryt: () => void;
  åpne: boolean;
  onLagreNyttBarn: (barn: BarneTilleggVurdering) => void;
}

export type LeggTilBarnFormFields = BarneTilleggVurdering & {
  fornavn: string;
  etternavn: string;
  manglerIdent: boolean;
};

export enum Relasjon {
  FORELDER = 'FORELDER',
  FOSTERFORELDER = 'FOSTERFORELDER',
}

export const LeggTilBarnModal = ({ readOnly, åpne, avbryt, onLagreNyttBarn }: Props) => {
  const localForm = useForm<LeggTilBarnFormFields>({
    defaultValues: {
      fornavn: '',
      etternavn: '',
      navn: '',
      fødselsdato: '',
      ident: '',
      manglerIdent: false,
      oppgittForelderRelasjon: undefined,
    },
  });

  const { control, handleSubmit, reset, watch, setValue, trigger } = localForm;
  const manglerIdent = watch('manglerIdent');
  const onSubmit = (data: LeggTilBarnFormFields) => {
    const nyttBarn: BarneTilleggVurdering = {
      navn: `${data.fornavn} ${data.etternavn}`,
      fødselsdato: data.fødselsdato
        ? formaterDatoForBackend(parse(data.fødselsdato, DATO_FORMATER.ddMMyyyy, new Date()))
        : '',
      ident: data.ident,
      oppgittForelderRelasjon: data.oppgittForelderRelasjon,
      vurderinger: [{ begrunnelse: '', harForeldreAnsvar: '', fraDato: '' }],
    };
    onLagreNyttBarn(nyttBarn);
    reset();
  };

  const handleAvbryt = () => {
    reset();
    avbryt();
  };

  return (
    <Modal
      open={åpne}
      header={{
        heading: 'Legg til barn',
      }}
      onClose={handleAvbryt}
      onBeforeClose={() => {
        reset();
        return true;
      }}
      width={'medium'}
    >
      <Modal.Body>
        <VStack gap={'6'}>
          <TextFieldWrapper
            label={'Fornavn og mellomnavn'}
            name={'fornavn'}
            control={control}
            readOnly={readOnly}
            rules={{ required: 'Du må oppgi fornavn (og eventuelt mellomnavn) på barnet' }}
            type={'text'}
          />
          <TextFieldWrapper
            label="Etternavn"
            name={'etternavn'}
            control={control}
            readOnly={readOnly}
            rules={{ required: 'Du må oppgi etternavn på barnet' }}
            size={'small'}
            type={'text'}
          />
          <DateInputWrapper
            label="Fødselsdato"
            control={control}
            name={'fødselsdato'}
            rules={{
              validate: {
                validerDato: (value) => validerDato(value as string),
                validerIkkeFørDato: (value) => {
                  if (erDatoIFremtiden(value as string)) {
                    return 'Fødselsdato kan ikke være i fremtiden';
                  }
                },
              },
            }}
            size={'small'}
          />
          {!(Array.isArray(manglerIdent) ? manglerIdent.includes('manglerIdent') : manglerIdent) && (
            <TextFieldWrapper
              label="Fødselsnummer / D-nummer"
              name={'ident'}
              control={control}
              readOnly={readOnly}
              rules={{
                validate: {
                  validerIdent: (value) => {
                    if (!value) return true;
                    const ident = value as string;
                    if (ident.length !== 11) return 'Fødselsnummeret må være 11 siffer';
                    if (!/^\d+$/.test(ident)) return 'Fødselsnummeret kan kun inneholde tall';
                    if (!erGyldigFødselsnummer(ident)) {
                      return 'Ugyldig fødselsnummer eller D-nummer';
                    }
                  },
                },
                onChange: (e) => {
                  const value = e.target.value.replaceAll(/\D/g, '').slice(0, 11);
                  setValue('ident', value, {
                    shouldValidate: true,
                    shouldTouch: true,
                  });
                },
              }}
              size={'small'}
              type={'text'}
            />
          )}
          <CheckboxWrapper
            label={'Barn mangler ident'}
            hideLabel={true}
            name={'manglerIdent'}
            control={control}
            onChangeCustom={(checked) => {
              if (checked) {
                setValue('ident', null);
              }
            }}
          >
            <Checkbox value={'manglerIdent'}>Barnet har ikke fødselsnummer eller D-nummer</Checkbox>
          </CheckboxWrapper>
          <RadioGroupWrapper
            name={'oppgittForelderRelasjon'}
            control={control}
            label={'Hva er brukerens relasjon til barnet?'}
            rules={{ required: 'Du må oppgi relasjon til barnet' }}
            readOnly={readOnly}
          >
            <Radio value={Relasjon.FORELDER}>Forelder</Radio>
            <Radio value={Relasjon.FOSTERFORELDER}>Fosterforelder</Radio>
          </RadioGroupWrapper>
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={async () => {
            const isValid = await trigger();
            if (isValid) {
              await handleSubmit(onSubmit)();
            }
          }}
        >
          Lagre
        </Button>
        <Button type="button" variant="tertiary" onClick={handleAvbryt}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
