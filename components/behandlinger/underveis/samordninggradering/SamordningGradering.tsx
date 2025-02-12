import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';
import { CurrencyExchangeIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { SamordningGraderingGrunnlag } from 'lib/types/types';

interface Props {
  grunnlag: SamordningGraderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const SamordningGradering = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  console.log(behandlingVersjon + '::' + readOnly);
  return (
    <VilkårsKort heading="Samordning" steg="SAMORDNING_GRADERING" icon={<CurrencyExchangeIcon fontSize={'1.5rem'} />}>
      {grunnlag.ytelser.map((ytelse) => (
        <section key={ytelse.ytelseType} style={{ marginBottom: '1rem' }}>
          <div>Ytelse: {ytelse.ytelseType}</div>
          <div>Kilde: {ytelse.kilde}</div>
          <div>Saksreferanse: {ytelse.saksRef}</div>
          <table>
            <thead>
              <tr>
                <th>Fra og med</th>
                <th>Til og med</th>
                <th>Gradering</th>
                <th>Kronesum</th>
              </tr>
            </thead>
            <tbody>
              {ytelse.ytelsePerioder.map((periode) => (
                <tr key={periode.fom}>
                  <td>{formaterDatoForVisning(periode.fom)}</td>
                  <td>{formaterDatoForVisning(periode.tom)}</td>
                  <td>{periode.gradering}</td>
                  <td>{/*periode.kronesum*/}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </VilkårsKort>
  );
};
