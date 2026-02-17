'use client';

import { EtableringEgenVirksomhetVurderingResponse } from 'lib/types/types';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { getJaNeiEllerUndefined } from 'lib/utils/form';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { Dato } from 'lib/types/Dato';

interface Props {
  vurdering: EtableringEgenVirksomhetVurderingResponse;
}

export const EtableringEgenVirksomhetTidligereVurdering = ({ vurdering }: Props) => {
  return (
    <VStack gap="5">
      <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra" svar={formaterDatoForFrontend(vurdering.fom)} />
      <SpørsmålOgSvar spørsmål="Vilkårsvurdering" svar={vurdering.begrunnelse} />
      <SpørsmålOgSvar
        spørsmål="Foreligger det en næringsfaglig vurdering?"
        svar={getJaNeiEllerUndefined(vurdering.foreliggerFagligVurdering)!}
      />
      {vurdering.virksomhetErNy != null && (
        <SpørsmålOgSvar spørsmål="Er virksomheten ny?" svar={getJaNeiEllerUndefined(vurdering.virksomhetErNy)!} />
      )}
      {vurdering.brukerEierVirksomheten != null && (
        <SpørsmålOgSvar spørsmål="Eier brukeren virksomheten?" svar={vurdering.brukerEierVirksomheten!} />
      )}
      {vurdering.kanFøreTilSelvforsørget != null && (
        <SpørsmålOgSvar
          spørsmål="Antas det at etablering av virksomheten vil føre til at bruker blir selvforsørget?"
          svar={getJaNeiEllerUndefined(vurdering.kanFøreTilSelvforsørget)!}
        />
      )}
      {vurdering.utviklingsPeriode.length > 0 && (
        <>
          {vurdering.utviklingsPeriode.map((periode) => (
            <>
              <Label size={'small'}>Utviklingsperiode</Label>
              <BodyShort
                size={'small'}
              >{`${new Dato(periode.fom).formaterForFrontend()} - ${new Dato(periode.tom).formaterForFrontend()}`}</BodyShort>
            </>
          ))}
        </>
      )}
      {vurdering.oppstartsPeriode.length > 0 && (
        <>
          {vurdering.oppstartsPeriode.map((periode) => (
            <>
              <Label size={'small'}>Oppstartsperiode</Label>
              <BodyShort
                size={'small'}
              >{`${new Dato(periode.fom).formaterForFrontend()} - ${new Dato(periode.tom).formaterForFrontend()}`}</BodyShort>
            </>
          ))}
        </>
      )}
    </VStack>
  );
};
