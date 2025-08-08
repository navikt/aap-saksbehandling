import { useContext } from 'react';
import { ProduksjonsstyringFilterContext } from 'components/produksjonsstyring/allefiltereprovider/ProduksjonsstyringFilterProvider';

export function useProduksjonsstyringFilter() {
  const context = useContext(ProduksjonsstyringFilterContext);
  if (!context) {
    throw Error('useProduksjonsstyringFilter må brukes innenfor ProduksjonsstyringFiltereProvider');
  }

  return context;
}
