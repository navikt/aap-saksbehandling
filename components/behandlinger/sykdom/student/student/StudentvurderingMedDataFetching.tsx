import { Studentvurdering } from 'components/behandlinger/sykdom/student/student/Studentvurdering';
import { hentMellomlagring, hentStudentGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';
import { BehandlingFlytOgTilstand } from 'lib/types/types';
import { getStegSomSkalVises } from 'lib/utils/steg';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const StudentvurderingMedDataFetching = async ({ behandlingsreferanse, flyt }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentStudentGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_STUDENT_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const stegSomSkalVisesForGruppe = getStegSomSkalVises('STUDENT', flyt);
  const harAvklaringsbehov = stegSomSkalVisesForGruppe.includes('AVKLAR_STUDENT');

  const erRevurdering = flyt.visning.typeBehandling === 'Revurdering';
  const harTidligereVurdering = !!grunnlag.data.studentvurdering;
  const visStudentvurdering = harAvklaringsbehov || (erRevurdering && harTidligereVurdering);
  const readOnly =
    flyt.visning.saksbehandlerReadOnly || !grunnlag.data.harTilgangTilÅSaksbehandle || !harAvklaringsbehov;

  if (!visStudentvurdering) {
    return null;
  }

  return (
    <Studentvurdering
      grunnlag={grunnlag.data}
      readOnly={readOnly}
      behandlingVersjon={flyt.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
