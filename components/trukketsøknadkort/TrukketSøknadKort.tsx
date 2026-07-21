import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyLong, Label } from '@navikt/ds-react/Typography';
import { SideProsessKort } from 'components/sideprosesskort/SideProsessKort';

interface Props {
  grunnlag: {
    begrunnelse: string;
  };
}

export const TrukketSøknadKort = ({ grunnlag }: Props) => {
  return (
    <SideProsessKort heading={'Søknaden er trukket'} icon={<XMarkOctagonIcon />}>
      <div>
        <Label>Begrunnelse</Label>
        <BodyLong>{grunnlag.begrunnelse}</BodyLong>
      </div>
    </SideProsessKort>
  );
};
