import { Detail, HStack, Tag } from '@navikt/ds-react';
import { isBefore, isSameDay, sub } from 'date-fns';
import { formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import styles from './oppholdskrav.module.css';
import { OppholdskravForm } from 'components/behandlinger/oppholdskrav/types';
import { UseFormReturn } from 'react-hook-form';
import { JaEllerNei } from 'lib/utils/form';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';

type OppholdskravTidligerePeriodeHeadingProps = {
  fom: Date;
  tom: Date | null | undefined;
  foersteNyePeriode: Date | null | undefined;
  oppfylt: boolean;
};

export const OppholdskravTidligerePeriodeHeading = ({
  fom,
  tom,
  foersteNyePeriode,
  oppfylt,
}: OppholdskravTidligerePeriodeHeadingProps) => {
  const strekUtHele = foersteNyePeriode != null ? !isBefore(fom, foersteNyePeriode) : false;
  const nySluttdato =
    !strekUtHele &&
    foersteNyePeriode != null &&
    (tom == null || isBefore(foersteNyePeriode, tom) || isSameDay(foersteNyePeriode, tom));

  return (
    <HStack gap="space-12">
      <Detail className={strekUtHele ? styles.streketUtTekst : ''}>
        {formaterDatoForFrontend(fom)} –{' '}
        {tom != null && (
          <span className={nySluttdato ? styles.streketUtTekst : ''}>{formaterDatoForFrontend(tom)}</span>
        )}
        {nySluttdato && <span> {formaterDatoForFrontend(sub(foersteNyePeriode, { days: 1 }))}</span>}
      </Detail>
      <OppholdskravStatusTag oppfylt={oppfylt} />
    </HStack>
  );
};

type OppholdskravTNyPeriodeHeadingProps = {
  index: number;
  form: UseFormReturn<OppholdskravForm>;
  isLast: boolean;
};

export const OppholdskravNyPeriodeHeading = ({ index, form, isLast }: OppholdskravTNyPeriodeHeadingProps) => {
  const fom = parseDatoFraDatePicker(form.watch(`vurderinger.${index}.fraDato`));
  const oppfylt = form.watch(`vurderinger.${index}.oppfyller`);
  const tom = isLast ? null : parseDatoFraDatePickerOgTrekkFra1Dag(form.watch(`vurderinger.${index + 1}.fraDato`));

  return (
    <HStack gap="space-12">
      <Detail>
        Ny vurdering: {fom == null ? '[Ikke valgt]' : formaterDatoForFrontend(fom)} –{' '}
        {tom != null ? <span>{formaterDatoForFrontend(tom)}</span> : <span>{isLast ? ' ' : '[Ikke valgt]'}</span>}
      </Detail>
      <OppholdskravStatusTag oppfylt={oppfylt != null ? oppfylt === JaEllerNei.Ja : null} />
    </HStack>
  );
};

type OppholdskrabStatusTagProps = {
  oppfylt: boolean | null | undefined;
};

const OppholdskravStatusTag = ({ oppfylt }: OppholdskrabStatusTagProps) => {
  if (oppfylt == null) {
    return null;
  }

  return (
    <Tag size="xsmall" variant={oppfylt ? 'success-moderate' : 'error-moderate'}>
      {oppfylt ? 'Oppfylt' : 'Ikke oppfylt'}
    </Tag>
  );
};
