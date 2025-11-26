import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { ChildEyesIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Detail } from '@navikt/ds-react';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';
import { JaEllerNei } from 'lib/utils/form';

import styles from 'components/barn/oppgittebarnvurdering/OppgitteFolkeregisterBarnVurdering.module.css';
import { OppgitteFolkeregisterBarnVurderingFelter } from 'components/barn/oppgittebarnvurderingfelter/OppgitteFolkeregisterBarnVurderingFelter';
import { Periode } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';
import React from 'react';

interface Props {
  form: UseFormReturn<BarnetilleggFormFields>;
  barnetilleggIndex: number;
  ident: string | null | undefined;
  navn: string;
  fødselsdato: string | null | undefined;
  harOppgittFosterforelderRelasjon: boolean;
  forsørgerPeriode?: Periode;
  readOnly: boolean;
}

export const OppgitteFolkeregisterBarnVurdering = ({
  form,
  barnetilleggIndex,
  ident,
  navn,
  forsørgerPeriode,
  readOnly,
  fødselsdato,
  harOppgittFosterforelderRelasjon,
}: Props) => {
  const {
    fields: vurderinger,
    remove,
    append,
  } = useFieldArray({
    control: form.control,
    name: `folkeregistrerteBarnVurderinger.${barnetilleggIndex}.vurderinger`,
  });

  const kanLeggeTilNyVurdering =
    form
      .watch(`folkeregistrerteBarnVurderinger.${barnetilleggIndex}`)
      ?.vurderinger?.every((vurdering) => vurdering.harForeldreAnsvar !== JaEllerNei.Nei) && !readOnly;

  const erUnderMyndighetsalder = fødselsdato ? Number.parseInt(kalkulerAlder(new Date(fødselsdato))) < 18 : false;

  const periodeTekst = forsørgerPeriode?.fom
    ? `${formaterDatoForFrontend(forsørgerPeriode.fom)} - ${forsørgerPeriode?.tom ? formaterDatoForFrontend(forsørgerPeriode.tom) : ''}`
    : 'Ukjent';

  return (
    <section className={`flex-column`}>
      <div className={styles.folkeregisterbarnheading}>
        <div>
          <ChildEyesIcon title={`registrert barn ${ident}`} fontSize={'2rem'} />
        </div>
        <div className={styles.tekst}>
          <Detail className={styles.detailgray}>Barn</Detail>
          <BodyShort size={'small'}>
            {navn}, {ident} ({fødselsdato ? kalkulerAlder(new Date(fødselsdato)) : 'Ukjent alder'})
          </BodyShort>
          {fødselsdato && <BodyShort size={'small'}>Fødselsdato: {formaterDatoForFrontend(fødselsdato)}</BodyShort>}
          <BodyShort size={'small'}>Forsørgerperiode:{periodeTekst}</BodyShort>
        </div>
      </div>
      <div className={styles.vurderingwrapper}>
        {vurderinger.map((vurdering, vurderingIndex) => {
          return (
            <div key={vurdering.id} className={styles.vurdering}>
              <OppgitteFolkeregisterBarnVurderingFelter
                form={form}
                readOnly={readOnly}
                ident={ident}
                barneTilleggIndex={barnetilleggIndex}
                vurderingIndex={vurderingIndex}
                fødselsdato={fødselsdato}
                harOppgittFosterforelderRelasjon={harOppgittFosterforelderRelasjon}
              />
              {!readOnly && (
                <Button
                  onClick={() => remove(vurderingIndex)}
                  className={'fit-content'}
                  type={'button'}
                  size={'small'}
                  variant={'tertiary'}
                  icon={<TrashIcon aria-hidden />}
                >
                  Fjern vurdering
                </Button>
              )}
            </div>
          );
        })}
        {kanLeggeTilNyVurdering && erUnderMyndighetsalder && (
          <Button
            onClick={() => append({ begrunnelse: '', harForeldreAnsvar: '', fraDato: '' })}
            className={'fit-content'}
            variant={'secondary'}
            size={'small'}
            type={'button'}
          >
            Legg til vurdering
          </Button>
        )}
      </div>
    </section>
  );
};
