'use client';

import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { Dato } from 'lib/types/Dato';
import { EtableringEgenVirksomhetVurderingResponse } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { getJaNeiEllerUndefined } from 'lib/utils/form';

import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';

interface Props {
  vurdering: EtableringEgenVirksomhetVurderingResponse;
}

export const EtableringEgenVirksomhetTidligereVurderingNy = ({ vurdering }: Props) => {
  return (
    <VStack gap="space-20">
      <SpørsmålOgSvar spørsmål="Navn på virksomhet" svar={vurdering.virksomhetNavn} />
      <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra" svar={formaterDatoForFrontend(vurdering.fom)} />
      <SpørsmålOgSvar spørsmål="Vilkårsvurdering" svar={vurdering.begrunnelse} />
      <SpørsmålOgSvar
        spørsmål="Foreligger det en næringsfaglig vurdering?"
        svar={getJaNeiEllerUndefined(vurdering.foreliggerFagligVurdering)!}
      />
      {vurdering.jobberBrukerAktivMedVirksomheten != null && (
        <SpørsmålOgSvar
          spørsmål="Jobber bruker aktivt med å etablere virksomheten?"
          svar={getJaNeiEllerUndefined(vurdering.jobberBrukerAktivMedVirksomheten)!}
        />
      )}
      {vurdering.virksomhetErNy != null && (
        <SpørsmålOgSvar spørsmål="Er virksomheten ny?" svar={getJaNeiEllerUndefined(vurdering.virksomhetErNy)!} />
      )}
      {vurdering.brukerEierVirksomheten != null && (
        <SpørsmålOgSvar spørsmål="Eier brukeren virksomheten?" svar={vurdering.brukerEierVirksomheten} />
      )}
      {vurdering.kanFøreTilSelvforsørget != null && (
        <SpørsmålOgSvar
          spørsmål="Antas det at etablering av virksomheten vil føre til at bruker blir selvforsørget?"
          svar={getJaNeiEllerUndefined(vurdering.kanFøreTilSelvforsørget)!}
        />
      )}
      {vurdering.fase != null && <SpørsmålOgSvar spørsmål="Hvilken fase er virksomheten i?" svar={vurdering.fase} />}

      {vurdering.fase == 'OPPSTART' && vurdering.erRegistrertINødvendigeOffentligeRegister != null && (
        <SpørsmålOgSvar
          spørsmål="Er det dokumentert at virksomheten er registrert i de nødvendige offentlige registrene"
          svar={getJaNeiEllerUndefined(vurdering.erRegistrertINødvendigeOffentligeRegister)!}
        />
      )}
    </VStack>
  );
};
