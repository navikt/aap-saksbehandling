import { UseFormReturn } from 'react-hook-form';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/etannetsted/helseinstitusjon/Helseinstitusjon';
import { Radio } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  helseinstitusjonoppholdIndex: number;
  readonly: boolean;
}

export const Helseinstitusjonsvurdering = ({ form, helseinstitusjonoppholdIndex, readonly }: Props) => {
  const visSpørsmålOmSøkerFårFiKostOgLosji =
    form.watch(`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.forsoergerEktefelle`) === JaEllerNei.Nei &&
    form.watch(`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.harFasteUtgifter`) === JaEllerNei.Nei;

  return (
    <div className={'flex-column'}>
      <TextAreaWrapper
        name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.begrunnelse`}
        control={form.control}
        label={'Vurder §11-25 og om det skal gis reduksjon av ytelsen'}
        rules={{ required: 'Du må begrunne vurderingen din' }}
        readOnly={readonly}
      />
      <RadioGroupWrapper
        name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.forsoergerEktefelle`}
        control={form.control}
        label={'Forsørger brukeren ektefelle eller tilsvarende?'}
        rules={{ required: 'Du må svare på om brukeren forsørger ektefelle eller tilsvarende' }}
        readOnly={readonly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>
      <RadioGroupWrapper
        name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.harFasteUtgifter`}
        control={form.control}
        label={'Har brukeren faste utgifter nødvendig for å beholde bolig og andre eiendeler?'}
        rules={{
          required: 'Du må svare på om brukeren har faste utgifter nødvendig for å beholde bolig og andre eiendeler',
        }}
        readOnly={readonly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>
      {visSpørsmålOmSøkerFårFiKostOgLosji && (
        <RadioGroupWrapper
          name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.faarFriKostOgLosji`}
          control={form.control}
          label={'Får brukeren fri kost og losji?'}
          rules={{
            required: 'Du må svare på om brukeren får fri kost og losji',
          }}
          readOnly={readonly}
          horisontal
        >
          <Radio value={JaEllerNei.Ja}>Ja</Radio>
          <Radio value={JaEllerNei.Nei}>Nei</Radio>
        </RadioGroupWrapper>
      )}
    </div>
  );
};
