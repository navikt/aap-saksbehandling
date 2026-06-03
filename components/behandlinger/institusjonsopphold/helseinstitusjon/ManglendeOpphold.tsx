import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { KelvinAlert } from 'components/alert/KelvinAlert';

export const ManglendeOpphold = () => {
  return (
    <VilkårsKort heading={'§ 11-25 Helseinstitusjon'} steg={'DU_ER_ET_ANNET_STED'}>
      <KelvinAlert aria-label={'Institusjonsopphold'} variant={'info'}>
        Brukeren har et institusjonsopphold, men brukeren kan enten ha barnetillegg, eller at oppholdet varer for kort
        til at AAP kan reduseres.
      </KelvinAlert>
    </VilkårsKort>
  );
};
