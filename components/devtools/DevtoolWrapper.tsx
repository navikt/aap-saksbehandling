import { Box, Heading, HStack } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { isProd } from 'lib/utils/environment';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

interface DevtoolBoxProps {
  title?: string;
  hideTitle?: boolean;
  children: ReactNode;
}

/**
 * Wrapper/Box med styling for å synliggjøre at innholdet er for utviklere og ikke skal brukes i produksjonsmiljøet.
 * Brukes i devtools-komponenter for å skille dem fra resten av UI-et.
 **/
export const DevtoolWrapper = ({ title, hideTitle, children }: DevtoolBoxProps) =>
  !isProd() && (
    <Box
      borderColor="danger-subtle"
      borderRadius="8"
      borderWidth="1"
      padding="space-12"
      style={{
        background: `repeating-linear-gradient(
          -45deg,
          var(--ax-bg-danger-moderate) 0px,
          var(--ax-bg-danger-moderate) 10px,
          transparent 10px,
          transparent 20px
        )`,
      }}
    >
      {!hideTitle && (
        <Box
          background="danger-soft"
          marginBlock="space-0 space-8"
          padding="space-8"
          borderRadius="8"
          borderColor="danger-subtle"
          borderWidth="1"
        >
          <Heading size="small" textColor="subtle">
            <HStack gap="space-4" align="center">
              <ExclamationmarkTriangleFillIcon />
              {title || 'Utviklerverktøy'}
            </HStack>
          </Heading>
        </Box>
      )}

      <Box padding="space-8" background="default" borderRadius="8" borderWidth="1" borderColor="danger-subtle">
        {children}
      </Box>
    </Box>
  );
