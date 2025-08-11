import { useContext } from 'react';
import { ProduksjonsstyringFilterContext } from 'context/ProduksjonsstyringFilterContext';

export function useProduksjonsstyringFilter() {
  const context = useContext(ProduksjonsstyringFilterContext);
  if (!context) {
    throw Error('useProduksjonsstyringFilter må brukes innenfor ProduksjonsstyringFiltereProvider');
  }

  return context;
}
