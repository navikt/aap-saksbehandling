import { OppsummeringRad } from 'components/saksoversikt/meldekortoversikt/oppsummeringrad/OppsummeringRad';

interface Props {
  timer: number;
}

export const OppsummeringTimer = ({ timer }: Props) => {
  return <OppsummeringRad label={'Sammenlagt for perioden'} value={`${timer} timer`} />;
};
