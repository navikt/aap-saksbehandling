import { BrevFormVerdier } from 'components/brevbygger/brevbyggerNy/types';
import { FritekstType } from 'components/brevbygger/brevmodellTypes';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { Control } from 'react-hook-form';

interface DelmalFritekstProps {
  node: FritekstType;
  control: Control<BrevFormVerdier>;
}

export const DelmalFritekst = ({ node, control }: DelmalFritekstProps) => (
  <TextAreaWrapper control={control} name={`fritekster.${node._key}`} label="Fritekst" size="small" />
);
