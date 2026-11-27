import { Box, Heading, HStack, Tag, VStack } from '@navikt/ds-react';
import { JaEllerNei } from 'lib/utils/form';
import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BeslutterFormFields } from 'components/behandlinger/vedtak/beslutter/Beslutter';

interface Props {
  tittel: string;
  children: ReactNode;
  form: UseFormReturn<BeslutterFormFields>;
  index: number;
}

export const BeslutterKort = ({ tittel, children, form, index }: Props) => {
  const godkjentFormFieldValue = form.watch(`vurderinger.${index}.godkjent`);
  return (
    <Box
      role="region"
      aria-label={tittel}
      background={'default'}
      borderWidth={'1'}
      borderColor={'neutral-subtle'}
      borderRadius={'12'}
      padding={'space-12'}
    >
      <VStack gap={'space-4'}>
        <HStack justify={'space-between'} paddingBlock={'space-4'}>
          <Heading level={'3'} size={'small'} data-testid="vilkår-heading">
            {tittel}
          </Heading>
          <StatusTagForBeslutter godkjentFormFieldValue={godkjentFormFieldValue} />
        </HStack>
        <VStack style={{ borderTop: '1px solid lightgray' }} paddingBlock={'space-16 space-0'}>
          {children}
        </VStack>
      </VStack>
    </Box>
  );
};

function StatusTagForBeslutter({ godkjentFormFieldValue }: { godkjentFormFieldValue: JaEllerNei | undefined }) {
  if (godkjentFormFieldValue === undefined) {
    return (
      <Tag variant={'outline'} data-color={'info'} size={'small'}>
        Mangler vurdering av beslutter
      </Tag>
    );
  }

  if (godkjentFormFieldValue === JaEllerNei.Nei) {
    return (
      <Tag variant={'strong'} data-color={'danger'} size={'small'}>
        Ikke godkjent av beslutter
      </Tag>
    );
  }

  if (godkjentFormFieldValue === JaEllerNei.Ja) {
    return (
      <Tag variant={'strong'} data-color={'success'} size={'small'}>
        Godkjent av beslutter
      </Tag>
    );
  }
}
