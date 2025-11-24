import { Button, HStack, Radio, ReadMore, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { VisningModus } from 'hooks/saksbehandling/visning/VisningHook';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { UseFormReturn } from 'react-hook-form';
import React, { useState } from 'react';
import { validerDato } from 'lib/validation/dateValidation';
import { ForutgåendeMedlemskapVurderingForm } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/types';
import { JaEllerNei } from 'lib/utils/form';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { BeregningTidspunktGrunnlag, RettighetsperiodeGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

type Props = {
  form: UseFormReturn<ForutgåendeMedlemskapVurderingForm>;
  rettighetsperiodeGrunnlag?: RettighetsperiodeGrunnlag;
  beregningstidspunktGrunnlag?: BeregningTidspunktGrunnlag;
  visningModus: VisningModus;
  readOnly: boolean;
  index: number;
  harTidligereVurderinger: boolean;
  onRemove: () => void;
};

export const ForutgåendeMedlemskapFormInput = ({
  readOnly,
  harTidligereVurderinger,
  index,
  visningModus,
  form,
  onRemove,
  rettighetsperiodeGrunnlag,
  beregningstidspunktGrunnlag,
}: Props) => {
  const { control, watch } = form;
  const [spinnerRemove, setSpinnerRemove] = useState(false);

  const handleRemove = (): void => {
    setSpinnerRemove(true);
    setTimeout(() => {
      onRemove();
      setSpinnerRemove(false);
    }, 500);
  };

  return (
    <VStack gap="4">
      <HStack justify={'space-between'}>
        <DateInputWrapper
          name={`vurderinger.${index}.fraDato`}
          label="Vurderingen gjelder fra"
          control={control}
          rules={{
            required: 'Du må velge fra hvilken dato vurderingen gjelder fra',
            validate: (value) => validerDato(value as string),
          }}
          readOnly={readOnly}
        />
        {(visningModus === VisningModus.AKTIV_MED_AVBRYT || visningModus === VisningModus.AKTIV_UTEN_AVBRYT) &&
          (index !== 0 || harTidligereVurderinger) && (
            <HStack>
              <VStack justify={'end'}>
                <Button
                  loading={spinnerRemove}
                  aria-label="Fjern vurdering"
                  variant="tertiary"
                  size="small"
                  icon={<TrashFillIcon />}
                  onClick={handleRemove}
                  type="button"
                ></Button>
              </VStack>
            </HStack>
          )}
      </HStack>
      <ReadMore style={{ maxWidth: '90ch' }} size={'small'} header="Hvordan legge til sluttdato?">
        For å legge til en sluttdato på denne vurderingen velger du “Legg til ny vurdering”. Det oppretter en ny
        vurdering, der du kan ha et annet utfall og en ny “gjelder fra” dato, som da vil gi sluttdato på den foregående
        (denne) vurderingen. Sluttdatoen for denne vurderingen blir satt til dagen før den nye vurderingen sin “gjelder
        fra” dato.
      </ReadMore>
      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={control}
        label="Vurder brukerens forutgående medlemskap"
        rules={{
          required: 'Du må gi en begrunnelse på brukerens forutgående medlemskap',
        }}
        readOnly={readOnly}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.harForutgåendeMedlemskap`}
        control={control}
        label="Har brukeren fem års forutgående medlemskap i folketrygden jf. § 11-2?"
        horisontal={true}
        rules={{ required: 'Du må velge om brukeren har fem års forutgående medlemskap' }}
        readOnly={readOnly}
      />
      {watch(`vurderinger.${index}.harForutgåendeMedlemskap`) === JaEllerNei.Nei && (
        <RadioGroupWrapper
          name={`vurderinger.${index}.unntaksvilkår`}
          control={control}
          label={'Oppfyller brukeren noen av unntaksvilkårene?'}
          rules={{ required: 'Du må svare på om brukeren oppfyller noen av unntaksvilkårene' }}
          readOnly={readOnly}
        >
          {[
            {
              value: 'A',
              label: `a: Ja, brukeren har vært medlem i folketrygden i minst ett år umiddelbart før krav om ytelsen settes fram (${rettighetsperiodeGrunnlag?.søknadsdato ? formaterDatoForFrontend(rettighetsperiodeGrunnlag?.søknadsdato) : '(Søknadsdato ikke funnet)'}), og var medlem i trygden da arbeidsevnen ble nedsatt med minst halvparten (${beregningstidspunktGrunnlag?.vurdering?.nedsattArbeidsevneDato ? formaterDatoForFrontend(beregningstidspunktGrunnlag?.vurdering?.nedsattArbeidsevneDato) : '(Dato for nedsatt arbeidsevne ikke funnet)'}), og etter fylte 16 år har perioder med medlemskap som minst tilsvarer perioder uten medlemskap`,
            },
            {
              value: 'B',
              label: `b: Ja, brukeren har vært medlem i folketrygden i minst ett år umiddelbart før krav om ytelsen settes fram (${rettighetsperiodeGrunnlag?.søknadsdato ? formaterDatoForFrontend(rettighetsperiodeGrunnlag?.søknadsdato) : '(Søknadsdato ikke funnet)'}), og har etter fylte 16 år vært medlem i folketrygden med unntak av maksimum fem år.`,
            },
            { value: 'Nei', label: 'Nei' },
          ].map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>
      )}
    </VStack>
  );
};
