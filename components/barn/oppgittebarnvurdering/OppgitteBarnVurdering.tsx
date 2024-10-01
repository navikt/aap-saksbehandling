import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { PlusCircleIcon, QuestionmarkDiamondIcon, TrashIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { OppgitteBarnVurderingFelter } from 'components/barn/oppgittebarnvurderingfelter/OppgitteBarnVurderingFelter';

import styles from 'components/barn/oppgittebarnvurdering/OppgitteBarnVurdering.module.css';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';
import { JaEllerNei } from 'lib/utils/form';
import { harPerioderSomOverlapper } from 'components/behandlinger/sykdom/meldeplikt/Periodevalidering';

interface Props {
  form: UseFormReturn<BarnetilleggFormFields>;
  barnetilleggIndex: number;
  ident: string;
  navn: string;
  fødselsdato: string;
  readOnly: boolean;
}

export const OppgitteBarnVurdering = ({ form, barnetilleggIndex, ident, navn, readOnly, fødselsdato }: Props) => {
  const {
    fields: vurderinger,
    remove,
    append,
  } = useFieldArray({
    control: form.control,
    name: `barnetilleggVurderinger.${barnetilleggIndex}.vurderinger`,
    rules: {
      validate: (value) => {
        const vurderingPerioder = value
          .filter((vurdering) => vurdering.harForeldreAnsvar === JaEllerNei.Ja)
          .map((vurdering) => {
            return { fom: vurdering.fom, tom: vurdering?.tom };
          });

        if (harPerioderSomOverlapper(vurderingPerioder)) {
          return 'Det finnes overlappende perioder';
        }
      },
    },
  });

  const overlappendePerioderFeilMelding =
    form.formState?.errors?.barnetilleggVurderinger &&
    form.formState?.errors?.barnetilleggVurderinger[barnetilleggIndex]?.vurderinger?.root?.message;

  return (
    <section className={`${styles.barnekort} flex-column`}>
      <div className={styles.manueltbarnheading}>
        <div>
          <QuestionmarkDiamondIcon title="manuelt barn ikon" fontSize={'3rem'} />
        </div>
        <div>
          <Heading size={'small'}>Oppgitt fosterbarn - {ident}</Heading>
          <BodyShort size={'medium'}>
            {navn} ({kalkulerAlder(new Date(fødselsdato))})
          </BodyShort>
        </div>
      </div>
      <div>
        {vurderinger.map((vurdering, vurderingIndex) => {
          const kanFjernePeriode = vurderingIndex !== 0;
          return (
            <div key={vurdering.id} className={styles.vurdering}>
              <OppgitteBarnVurderingFelter
                form={form}
                readOnly={readOnly}
                ident={ident}
                barneTilleggIndex={barnetilleggIndex}
                vurderingIndex={vurderingIndex}
              />
              {kanFjernePeriode && (
                <Button
                  onClick={() => remove(vurderingIndex)}
                  className={'fit-content-button'}
                  type={'button'}
                  size={'small'}
                  variant={'tertiary'}
                  icon={<TrashIcon />}
                >
                  Fjern periode
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {overlappendePerioderFeilMelding && <Alert variant={'error'}>{overlappendePerioderFeilMelding}</Alert>}

      <Button
        onClick={() => append({ begrunnelse: '', harForeldreAnsvar: '', fom: '' })}
        className={'fit-content-button'}
        variant={'tertiary'}
        size={'medium'}
        icon={<PlusCircleIcon />}
        type={'button'}
      >
        Legg til periode
      </Button>
    </section>
  );
};
