import { Periode } from 'lib/types/types';
import { Heading, VStack } from '@navikt/ds-react';
import { formaterPeriode } from 'lib/utils/date';
import styles from './rimeliggrunn.module.css';
import { Control, FieldArrayWithId } from 'react-hook-form';
import { MeldepliktOverstyringFormFields } from 'components/behandlinger/underveis/ikkeoppfyltmeldeplikt/types';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';

type Props = {
  periode: Periode;
  control: Control<MeldepliktOverstyringFormFields, any, any>;
  index: number;
  field: FieldArrayWithId<MeldepliktOverstyringFormFields>;
  readOnly: boolean;
};

export const VurderingMeldepliktOverstyringSkjema = ({ periode, index, control, readOnly }: Props, key?: React.Key) => {
  return (
    <section key={key} className={styles.skjemaContainer}>
      <Heading size={'small'} level="3">
        Vurdering av periode {formaterPeriode(periode.fom, periode.tom)}
      </Heading>
      <VStack gap={'6'} style={{ marginTop: '1rem' }}>
        <SelectWrapper
          name={`vurderinger.${index}.meldepliktOverstyringStatus`}
          control={control}
          label="Vurdering av meldeplikt"
          size="small"
          readOnly={readOnly}
        >
          <option value="IKKE_MELDT_SEG">Meldeplikt ikke overholdt</option>
          <option value="HAR_MELDT_SEG">Meldeplikt overholdt</option>
          <option value="RIMELIG_GRUNN">Rimelig grunn</option>
        </SelectWrapper>
        <TextAreaWrapper
          name={`vurderinger.${index}.begrunnelse`}
          label="Begrunnelse"
          control={control}
          size="small"
          rules={{ required: 'Du må skrive inn en begrunnelse for overstyringen.' }}
          readOnly={readOnly}
        />
      </VStack>
    </section>
  );
};
