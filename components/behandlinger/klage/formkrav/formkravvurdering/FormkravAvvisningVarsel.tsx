import { isBefore } from 'date-fns';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { KelvinAlert } from 'components/alert/KelvinAlert';

type Props = {
  frist: Date;
};

export const FormkravAvvisningVarsel = ({ frist }: Props) => {
  const today = new Date();

  if (isBefore(today, frist)) {
    return (
      <KelvinAlert variant="warning">
        Brukeren har frem til {formaterDatoForFrontend(frist)} til å svare på varselet om avvisningen av klagen. Ved å
        bekrefte en vurdering om at formkravene ikke er oppfyllt vil behandlingen settes på vent frem til svarfristen.
      </KelvinAlert>
    );
  }

  return (
    <KelvinAlert variant="warning">
      Svarfristen på forhåndsvarselet om avvisning utløp {formaterDatoForFrontend(frist)}. Ved å bekrefte at formkravene
      ikke er oppfyllt vil vi starte effektuering av avvisningen av klagen.
    </KelvinAlert>
  );
};
