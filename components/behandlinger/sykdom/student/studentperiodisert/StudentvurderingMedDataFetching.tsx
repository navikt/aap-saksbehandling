import { hentMellomlagring, hentStudentGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { StudentVurderingPeriodisert } from 'components/behandlinger/sykdom/student/studentperiodisert/StudentVurderingPeriodisert';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const StudentvurderingMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentStudentGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_STUDENT_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (
    !skalViseSteg(stegData, grunnlag.data.studentvurdering != null || grunnlag.data.sisteVedtatteVurderinger != null)
  ) {
    return null;
  }

  return (
    <StudentVurderingPeriodisert
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
