import { FastSettArbeidsevnePeriode } from 'components/fastsettarbeidsevneperiodeform/FastsettArbeidsevnePeriodeForm';
import { formaterDato } from 'lib/utils/date';
interface Props extends FastSettArbeidsevnePeriode {
  onDelete: (id: string) => void;
}
export const FastsettArbeidsevnePeriodeListItem = ({ onDelete, id, fraDato }: Props) => {
  return (
    <li>
      {formaterDato(fraDato)}
      <button type={'button'} onClick={() => onDelete(id)}>
        slett
      </button>
    </li>
  );
};
