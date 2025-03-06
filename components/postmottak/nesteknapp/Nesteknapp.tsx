import { Button, ButtonProps, HStack } from '@navikt/ds-react';

export const Nesteknapp = (props: ButtonProps) => {
  return (
    <HStack>
      <Button {...props}>{props.children}</Button>
    </HStack>
  );
};
