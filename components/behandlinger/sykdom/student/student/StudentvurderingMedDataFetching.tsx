import { hentMellomlagring, hentStudentGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { Studentvurdering } from 'components/behandlinger/sykdom/student/student/Studentvurdering';
import { unleashService } from 'lib/services/unleash/unleashService';
import { StudentVurderingPeriodisert } from 'components/behandlinger/sykdom/student/student/StudentVurderingPeriodisert';
import { VStack } from '@navikt/ds-react';

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

  if (!skalViseSteg(stegData, grunnlag.data.studentvurdering != null)) {
    return null;
  }

  return unleashService.isEnabled('periodisertStudentVurdering') ? (
    <VStack gap={'2'}>
      <StudentVurderingPeriodisert
        grunnlag={grunnlag.data}
        readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
        behandlingVersjon={stegData.behandlingVersjon}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
      />
      <Studentvurdering
        grunnlag={grunnlag.data}
        readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
        behandlingVersjon={stegData.behandlingVersjon}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
      />
    </VStack>
  ) : (
    <Studentvurdering
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
