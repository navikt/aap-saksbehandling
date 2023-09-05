interface Props {
  className: string;
  saksId: string;
}

export const InformasjonsKolonne = ({ saksId, className }: Props) => {
  return <div className={className}>SaksId: {saksId}</div>;
};
