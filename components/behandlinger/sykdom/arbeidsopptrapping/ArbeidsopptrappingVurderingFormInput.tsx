'use client';

import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { UseFormReturn } from 'react-hook-form';
import { ArbeidsopptrappingForm } from 'components/behandlinger/sykdom/arbeidsopptrapping/Arbeidsopptrapping';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { Button, HStack, Link, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { erDatoIPeriode, validerDato } from 'lib/validation/dateValidation';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { parse } from 'date-fns';
import { Periode } from 'lib/types/types';
import { stringToDate } from '../../../../lib/utils/date';
interface Props {
  index: number;
  form: UseFormReturn<ArbeidsopptrappingForm>;
  readonly: boolean;
  onRemove: () => void;
  ikkeRelevantePerioder?: Periode[];
}
export const ArbeidsopptrappingVurderingFormInput = ({
  index,
  readonly,
  form,
  onRemove,
  ikkeRelevantePerioder,
}: Props) => {
  return (
    <VStack gap={'5'}>
      <HStack justify={'space-between'}>
        <DateInputWrapper
          name={`vurderinger.${index}.fraDato`}
          label="Vurderingen gjelder fra"
          control={form.control}
          rules={{
            required: 'Du må velge fra hvilken dato vurderingen gjelder fra',
            validate: {
              validerDato: (value) => validerDato(value as string),
              validerIkkeRelevantPeriode: (value) => {
                const parsedInputDato = new Date(parse(value as string, 'dd.MM.yyyy', new Date()));
                const funnetIkkeRelevantPeriode = ikkeRelevantePerioder?.find((periode) => {
                  const fom = stringToDate(periode.fom);
                  const tom = stringToDate(periode.tom);
                  if (!fom || !tom) return false;
                  return erDatoIPeriode(parsedInputDato, fom, tom);
                });

                return funnetIkkeRelevantPeriode
                  ? `Dato kan ikke være inne i perioden (${funnetIkkeRelevantPeriode.fom} - ${funnetIkkeRelevantPeriode.tom})`
                  : true;
              },
            },
          }}
          readOnly={readonly}
        />

        <Button
          aria-label="Fjern vurdering"
          variant="tertiary"
          size="small"
          icon={<TrashFillIcon />}
          onClick={() => onRemove()}
          type="button"
        />
      </HStack>
      <Link href="https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_26-7" target="_blank">
        Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-23 (lovdata.no)
      </Link>
      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={form.control}
        label="Vilkårsvurdering"
        rules={{
          required: 'Du må fylle ut en vilkårsvurdering',
        }}
        readOnly={readonly}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.reellMulighetTilOpptrapping`}
        control={form.control}
        label="Har brukeren en reell mulighet til å trappe opp til en 100% stilling?"
        horisontal={true}
        rules={{ required: 'Du må ta stilling til om brukeren har en reell mulighet til å trappe opp arbeid' }}
        readOnly={readonly}
      />

      <RadioGroupJaNei
        name={`vurderinger.${index}.rettPaaAAPIOpptrapping`}
        control={form.control}
        label="Har brukeren rett på Aap i arbeidsopptrapping etter § 11-23 6. ledd?"
        horisontal={true}
        rules={{ required: 'Du må ta stilling til om brukeren har rett på aap i arbeidsopptrapping' }}
        readOnly={readonly}
      />
    </VStack>
  );
};
