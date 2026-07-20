import { useState } from 'react';
import { Button } from '@navikt/ds-react/Button';
import { VStack } from '@navikt/ds-react/Stack';
import { Textarea } from '@navikt/ds-react/Textarea';
import { BrevFormVerdier } from 'components/brevbygger/types';
import { FritekstType } from 'components/brevbygger/brevmodellTypes';
import { Control, FieldPath, useController } from 'react-hook-form';
import { PlusIcon } from '@navikt/aksel-icons';

interface DelmalFritekstProps {
  node: FritekstType;
  control: Control<BrevFormVerdier>;
  delmalId: string;
}

export const DelmalFritekst = ({ node, control, delmalId }: DelmalFritekstProps) => {
  const sammensattNøkkel = `${delmalId}###${node._key}`;
  const name = `fritekster.${sammensattNøkkel}` as FieldPath<BrevFormVerdier>;
  const { field } = useController({ name, control });
  const [isActive, setIsActive] = useState(() => !!field.value);

  return (
    <VStack gap="space-8">
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
