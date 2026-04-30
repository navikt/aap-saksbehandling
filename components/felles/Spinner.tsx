import { BodyLong, HStack, Loader, type LoaderProps } from '@navikt/ds-react';

interface Props extends Omit<LoaderProps, 'title'> {
  visible?: boolean;
  label: string;
}

export const Spinner = ({ visible, label, ...rest }: Props) => {
  if (visible === false) return null;

  return (
    <HStack gap="space-16" align="center" justify="center" margin="space-48">
      <Loader {...rest} title={label} />
      {label && <BodyLong>{label}</BodyLong>}
    </HStack>
  );
};
