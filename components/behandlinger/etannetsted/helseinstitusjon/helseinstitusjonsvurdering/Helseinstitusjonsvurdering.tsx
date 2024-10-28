import { UseFormReturn } from 'react-hook-form';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/etannetsted/helseinstitusjon/Helseinstitusjon';
import { TextAreaWrapper } from '@navikt/aap-felles-react';
import { RadioGroupWrapper } from 'components/input/RadioGroupWrapper';
import { Radio } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  helseinstitusjonoppholdIndex: number;
  readonly: boolean;
}

export const Helseinstitusjonsvurdering = ({ form, helseinstitusjonoppholdIndex, readonly }: Props) => {
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
        label={'Forsørger søker ektefelle eller tilsvarende?'}
        rules={{ required: 'Du må svare på om søker forsørger ektefelle eller tilsvarende' }}
        readOnly={readonly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>
      <RadioGroupWrapper
        name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.harFasteUtgifter`}
        control={form.control}
        label={'Har søker faste utgifter nødvendig for å beholde bolig og andre eiendeler?'}
        rules={{
          required: 'Du må svare på om søker har faste utgifter nødvendig for å beholde bolig og andre eiendeler',
        }}
        readOnly={readonly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>
      <RadioGroupWrapper
        name={`helseinstitusjonsvurderinger.${helseinstitusjonoppholdIndex}.faarFriKostOgLosji`}
        control={form.control}
        label={'Får søker fri kost og losji?'}
        rules={{
          required: 'Du må svare på om søker får fri kost og losji',
        }}
        readOnly={readonly}
        horisontal
      >
        <Radio value={JaEllerNei.Ja}>Ja</Radio>
        <Radio value={JaEllerNei.Nei}>Nei</Radio>
      </RadioGroupWrapper>
    </div>
  );
};
