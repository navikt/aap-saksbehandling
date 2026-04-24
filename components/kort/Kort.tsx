import { Box, Heading, VStack } from '@navikt/ds-react';
import { ReactNode } from 'react';

interface Props {
  heading: string;
  children: ReactNode;
}

export const Kort = ({ heading, children }: Props) => {
  return (
    <Box aria-label={heading} borderWidth={'1'} borderColor={'neutral-subtle'} borderRadius={'12'} padding={'space-16'}>
      <Heading spacing size={'small'}>
        {heading}
      </Heading>
      <VStack style={{ borderTop: '1px solid lightgray' }} paddingBlock={'space-16 space-0'}>
        {children}
      </VStack>
    </Box>
  );
};
