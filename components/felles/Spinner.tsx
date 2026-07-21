import { Loader, type LoaderProps } from '@navikt/ds-react/Loader';
import { HStack } from '@navikt/ds-react/Stack';
import { BodyLong } from '@navikt/ds-react/Typography';

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
