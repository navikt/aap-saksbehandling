import { useState } from 'react';
import { Button, Textarea, VStack } from '@navikt/ds-react';
import { BrevFormVerdier } from 'components/brevbygger/brevbyggerNy/types';
import { FritekstType } from 'components/brevbygger/brevmodellTypes';
import { Control, FieldPath, useController } from 'react-hook-form';
import { PlusIcon } from '@navikt/aksel-icons';

interface DelmalFritekstProps {
  node: FritekstType;
  control: Control<BrevFormVerdier>;
}

export const DelmalFritekst = ({ node, control }: DelmalFritekstProps) => {
  const name = `fritekster.${node._key}` as FieldPath<BrevFormVerdier>;
  const { field } = useController({ name, control });
  const [isActive, setIsActive] = useState(() => !!field.value);

  return (
    <VStack gap="2">
      {!isActive && (
        <div>
          <Button type="button" variant="tertiary" size="small" onClick={() => setIsActive(true)} icon={<PlusIcon />}>
            Legg til fritekst
          </Button>
        </div>
      )}
      {isActive && (
        <>
          <Textarea {...field} value={field.value as string} label="Fritekst" size="small" />
          <div>
            <Button
              type="button"
              variant="tertiary"
              size="small"
              onClick={() => {
                field.onChange('');
                setIsActive(false);
              }}
            >
              Slett fritekst
            </Button>
          </div>
        </>
      )}
    </VStack>
  );
};
