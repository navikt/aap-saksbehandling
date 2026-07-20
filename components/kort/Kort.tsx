import { Box } from '@navikt/ds-react/Box';
import { VStack } from '@navikt/ds-react/Stack';
import { Heading } from '@navikt/ds-react/Typography';
import { ReactNode } from 'react';
import type {
  AkselColoredStatelessBackgroundToken,
  AkselDynamicStatelessBackgroundToken,
  AkselRootBackgroundToken,
  AkselSpaceToken,
} from '@navikt/ds-tokens/types';

type Props = {
  heading?: string;
  children: ReactNode;
  padding?: AkselSpaceToken;
  background?: AkselRootBackgroundToken | AkselColoredStatelessBackgroundToken | AkselDynamicStatelessBackgroundToken;
};

export const Kort = ({ heading, children, background, padding = 'space-16' }: Props) => {
  return (
    <Box
      aria-label={heading}
      borderWidth={'1'}
      borderColor={'neutral-subtle'}
      borderRadius={'12'}
      padding={padding}
      background={background}
    >
      {heading && (
        <Heading spacing size={'small'} style={{ borderBottom: '1px solid lightgray', paddingBottom: 12 }}>
          {heading}
        </Heading>
      )}

      <VStack paddingBlock={'space-4 space-0'}>{children}</VStack>
    </Box>
  );
};
