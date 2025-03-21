import { BodyLong, HStack, Loader, type LoaderProps } from '@navikt/ds-react';

interface Props extends Omit<LoaderProps, 'title'> {
  visible?: boolean;
  label: string;
}

export const Spinner = ({ visible, label, ...rest }: Props) => {
  if (visible === false) return null;

  return (
    <HStack gap="4" align="center" justify="center" margin="12">
      <Loader {...rest} title={label} />
      {label && <BodyLong>{label}</BodyLong>}
    </HStack>
  );
};
