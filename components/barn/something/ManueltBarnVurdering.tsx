import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { BarnetilleggFormFields } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { QuestionmarkDiamondIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { ManueltBarn } from 'components/barn/manueltbarn/ManueltBarn';

import styles from 'components/barn/Barn.module.css';

interface Props {
  form: UseFormReturn<BarnetilleggFormFields>;
  barnetilleggIndex: number;
  ident: string;
  readOnly: boolean;
}

export const ManueltBarnVurdering = ({ form, barnetilleggIndex, ident, readOnly }: Props) => {
  const {
    fields: vurderinger,
    remove,
    append,
  } = useFieldArray({
    control: form.control,
    name: `barnetilleggVurderinger.${barnetilleggIndex}.vurderinger`,
  });

  return (
    <section className={`${styles.barnekort} flex-column`}>
      <div className={styles.manueltbarnheading}>
        <div>
          <QuestionmarkDiamondIcon title="manuelt barn ikon" fontSize={'3rem'} />
        </div>
        <div>
          <Heading size={'small'}>{ident}</Heading>
        </div>
      </div>
      <div>
        {vurderinger.map((vurdering, vurderingIndex) => (
          <div key={vurderingIndex} className={styles.vurdering}>
            <ManueltBarn
              form={form}
              manueltBarn={vurdering}
              readOnly={readOnly}
              ident={ident}
              barneTilleggIndex={barnetilleggIndex}
              vurderingIndex={vurderingIndex}
            />
            <Button
              onClick={() => remove(vurderingIndex)}
              className={'fit-content-button'}
              variant={'danger'}
              type={'button'}
              size={'small'}
            >
              Fjern periode
            </Button>
          </div>
        ))}
      </div>

      <Button
        onClick={() => append({ begrunnelse: '', harForeldreAnsvar: '', fom: '' })}
        className={'fit-content-button'}
        variant={'secondary'}
        size={'small'}
        type={'button'}
      >
        Legg til flere perioder
      </Button>
    </section>
  );
};
