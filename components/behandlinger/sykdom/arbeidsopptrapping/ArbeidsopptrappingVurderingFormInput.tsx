'use client';

import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { UseFormReturn } from 'react-hook-form';
import { ArbeidsopptrappingForm } from 'components/behandlinger/sykdom/arbeidsopptrapping/Arbeidsopptrapping';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { Button, HStack, Link, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { TrashFillIcon } from '@navikt/aksel-icons';
interface Props {
  index: number;
  form: UseFormReturn<ArbeidsopptrappingForm>;
  readonly: boolean;
  onRemove: () => void;
}
export const ArbeidsopptrappingVurderingFormInput = ({ index, readonly, form, onRemove }: Props) => {
  return (
    <VStack gap={'5'}>
      <HStack justify={'space-between'}>
        <DateInputWrapper
          name={`vurderinger.${index}.fraDato`}
          label="Vurderingen gjelder fra"
          control={form.control}
          rules={{
            required: 'Du må velge fra hvilken dato vurderingen gjelder fra',
            validate: (value) => validerDato(value as string),
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
      <Link href="https://lovdata.no/nav/rundskriv/r11-00#ref/lov/1997-02-28-19/%C2%A711-3" target="_blank">
        Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-3 (lovdata.no)
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
