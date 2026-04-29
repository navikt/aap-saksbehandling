import { hentMellomlagring, hentStudentGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { StudentVurdering } from 'components/behandlinger/sykdom/student/studentvurdering/StudentVurdering';
import {
  finnDiagnoseGrunnlagForStudent,
  getDefaultOptionsForDiagnosesystem,
} from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';

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

  const diagnoseGrunnlag = finnDiagnoseGrunnlagForStudent(grunnlag.data);
  const diagnoserDefaultOptions = await getDefaultOptionsForDiagnosesystem(diagnoseGrunnlag);

  if (!skalViseSteg(stegData, grunnlag.data.sisteVedtatteVurderinger != null)) {
    return null;
  }

  return (
    <StudentVurdering
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      diagnoseDefaultOptions={diagnoserDefaultOptions}
    />
  );
};
