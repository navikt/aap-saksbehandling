import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { QuestionmarkDiamondIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Detail } from '@navikt/ds-react';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';
import { JaEllerNei } from 'lib/utils/form';

import styles from 'components/barn/oppgittebarnvurdering/SaksbehandlerOppgitteBarnVurdering.module.css';
import { SaksbehandlerOppgitteBarnVurderingFelter } from 'components/barn/oppgittebarnvurderingfelter/SaksbehandlerOppgitteBarnVurderingFelter';
import React from 'react';

interface Props {
  form: UseFormReturn<BarnetilleggFormFields>;
  barnetilleggIndex: number;
  ident: string | null | undefined;
  navn: string;
  fødselsdato: string | null | undefined;
  harOppgittFosterforelderRelasjon: boolean;
  readOnly: boolean;
  onRemove: () => void;
  erSlettbar: boolean;
}

export const SaksbehandlerOppgittBarnVurdering = ({
  form,
  barnetilleggIndex,
  ident,
  navn,
  readOnly,
  fødselsdato,
  harOppgittFosterforelderRelasjon,
  onRemove,
  erSlettbar,
}: Props) => {
  const { fields: vurderinger, append, remove, } = useFieldArray({
    control: form.control,
    name: `saksbehandlerOppgitteBarnVurderinger.${barnetilleggIndex}.vurderinger`,
  });

  const kanLeggeTilNyVurdering =
    form
      .watch(`saksbehandlerOppgitteBarnVurderinger.${barnetilleggIndex}`)
      ?.vurderinger?.every((vurdering) => vurdering.harForeldreAnsvar !== JaEllerNei.Nei) && !readOnly;

  return (
    <section className={`flex-column`}>
      <div className={styles.manueltbarnheading}>
        <div>
          <QuestionmarkDiamondIcon title="manuelt barn ikon" fontSize={'2rem'} />
        </div>
        <div>
          <Detail className={styles.detailgray}>
            {harOppgittFosterforelderRelasjon ? 'Oppgitt manuelt fosterbarn' : 'Oppgitt manuelt barn'}
          </Detail>
          <BodyShort size={'small'}>
            {navn}, {ident} ({fødselsdato ? kalkulerAlder(new Date(fødselsdato)) : 'Ukjent alder'})
          </BodyShort>
        </div>
        {erSlettbar && (
          <Button
            type="button"
            variant={'tertiary'}
            size={'small'}
            icon={<TrashIcon aria-hidden />}
            onClick={onRemove}
            className={'fit-content'}
            disabled={readOnly}
          >
            Fjern barn
          </Button>
        )}
      </div>
      <div className={styles.vurderingwrapper}>
        {vurderinger.map((vurdering, vurderingIndex) => {
          const kanFjernePeriode = vurderingIndex !== 0;
          return (
            <div key={vurdering.id} className={styles.vurdering}>
              <SaksbehandlerOppgitteBarnVurderingFelter
                form={form}
                readOnly={readOnly}
                barneTilleggIndex={barnetilleggIndex}
                vurderingIndex={vurderingIndex}
                fødselsdato={fødselsdato}
                harOppgittFosterforelderRelasjon={harOppgittFosterforelderRelasjon}
              />
              {kanFjernePeriode && !readOnly && (
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
        {kanLeggeTilNyVurdering && (
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
