export function mapRettighetsTypeTilTekst(
  rettighetsType:
    | 'BISTANDSBEHOV'
    | 'SYKEPENGEERSTATNING'
    | 'STUDENT'
    | 'ARBEIDSSØKER'
    | 'VURDERES_FOR_UFØRETRYGD'
    | null
    | undefined
) {
  switch (rettighetsType) {
    case 'BISTANDSBEHOV':
      return '§ 11-6';
    case 'SYKEPENGEERSTATNING':
      return '§ 11-13';
    case 'STUDENT':
      return '§ 11-14';
    case 'ARBEIDSSØKER':
      return '§ 11-17';
    case 'VURDERES_FOR_UFØRETRYGD':
      return '§ 11-18';
    default:
      return '-';
  }
}
