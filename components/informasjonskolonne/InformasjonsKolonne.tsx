interface Props {
  className: string;
  behandlingsReferanse: string;
}

export const InformasjonsKolonne = ({ behandlingsReferanse, className }: Props) => {
  return <div className={className}>BehandlingsReferanse: {behandlingsReferanse}</div>;
};
