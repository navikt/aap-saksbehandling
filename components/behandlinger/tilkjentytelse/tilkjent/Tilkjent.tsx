import { TilkjentYtelseGrunnlag } from 'lib/types/types';

interface Props {
  grunnlag: TilkjentYtelseGrunnlag;
}
export const Tilkjent = ({ grunnlag }: Props) => {
  return (
    <div>
      {grunnlag?.perioder?.map((periode, index: number) => (
        <div key={index}>
          <div>Periode: {JSON.stringify(periode?.periode)}</div>
          <div>Tilkjent: {JSON.stringify(periode?.tilkjent)}</div>
          <div>----</div>
        </div>
      ))}
    </div>
  );
};
