import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { QuestionmarkDiamondIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Detail } from '@navikt/ds-react';
import { OppgitteBarnVurderingFelter } from 'components/barn/oppgittebarnvurderingfelter/OppgitteBarnVurderingFelter';
import { kalkulerAlder } from 'components/behandlinger/alder/Alder';
import { JaEllerNei } from 'lib/utils/form';

import styles from 'components/barn/oppgittebarnvurdering/OppgitteBarnVurdering.module.css';

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
  });

  const kanLeggeTilNyVurdering =
    form
      .watch(`barnetilleggVurderinger.${barnetilleggIndex}`)
      .vurderinger.every((vurdering) => vurdering.harForeldreAnsvar !== JaEllerNei.Nei) && !readOnly;

  return (
    <section className={`flex-column`}>
      <div className={styles.manueltbarnheading}>
        <div>
          <QuestionmarkDiamondIcon title="manuelt barn ikon" fontSize={'2rem'} />
        </div>
        <div>
          <Detail className={styles.detailgray}>Oppgitt fosterbarn</Detail>
          <BodyShort size={'small'}>
            {navn}, {ident} ({kalkulerAlder(new Date(fødselsdato))})
          </BodyShort>
        </div>
      </div>
      <div className={styles.vurderingwrapper}>
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
                fødselsdato={fødselsdato}
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
