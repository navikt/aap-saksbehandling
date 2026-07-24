import { Button, Detail, HStack } from '@navikt/ds-react';
import { MellomlagretVurdering } from 'lib/types/types';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { useFlyt } from 'hooks/saksbehandling/FlytHook';

interface UtkastInfoProps {
  mellomlagretVurdering: MellomlagretVurdering | undefined;
  readOnly: boolean;
  onDeleteMellomlagringClick?: () => void;
}

export const UtkastInfo = ({ mellomlagretVurdering, readOnly, onDeleteMellomlagringClick }: UtkastInfoProps) => {
  const { flyt } = useFlyt();

  const visNårMellomlagringBleLagret =
    (!!mellomlagretVurdering && !readOnly) || (!!mellomlagretVurdering && readOnly && flyt?.visning.visVentekort);
  const visSlettMellomlagringKnapp = !readOnly && mellomlagretVurdering && onDeleteMellomlagringClick;

  if (!visNårMellomlagringBleLagret) return null;

  return (
    <HStack align="baseline">
      <Detail>
        {`Utkast lagret ${formaterDatoMedTidspunktForFrontend(
          mellomlagretVurdering!.vurdertDato
        )} (${mellomlagretVurdering!.vurdertAv})`}
      </Detail>
      {visSlettMellomlagringKnapp && (
        <Button type="button" size="small" variant="tertiary" onClick={onDeleteMellomlagringClick}>
          Slett utkast
        </Button>
      )}
    </HStack>
  );
};
