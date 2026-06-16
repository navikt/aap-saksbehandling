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
import { unleashService } from 'lib/services/unleash/unleashService';
import { StudentVurderingV2 } from 'components/behandlinger/sykdom/student/studentvurdering/StudentVurderingV2';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const StudentvurderingMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentStudentGrunnlag(behandlingsreferanse);
  const skalBrukeNyttStudentsteg = unleashService.isEnabled('StudentV2');

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const diagnoseGrunnlag = finnDiagnoseGrunnlagForStudent(grunnlag.data);
  const diagnoserDefaultOptions = await getDefaultOptionsForDiagnosesystem(diagnoseGrunnlag);

  if (!skalViseSteg(stegData, grunnlag.data.sisteVedtatteVurderinger != null)) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const behovstype = skalBrukeNyttStudentsteg ? Behovstype.AVKLAR_STUDENT_KODE_V2 : Behovstype.AVKLAR_STUDENT_KODE;
  const initialMellomlagretVurdering = await hentMellomlagring(behandlingsreferanse, behovstype, totalReadOnly);

  if (skalBrukeNyttStudentsteg) {
    return (
      <StudentVurderingV2
        grunnlag={grunnlag.data}
        readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
        behandlingVersjon={stegData.behandlingVersjon}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
        diagnoseDefaultOptions={diagnoserDefaultOptions}
      />
    );
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
