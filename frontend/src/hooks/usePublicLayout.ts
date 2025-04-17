import { useContext } from 'react';
import {
  PublicAccessLayoutContext,
  PublicAccessLayoutContextType,
} from '../layouts/skeleton/publicAccessLayout/PublicAccessLayout.tsx';

// Hook pro snadný přístup ke kontextu publicAccessLayout
export const usePublicLayout = (): PublicAccessLayoutContextType => {
  const context = useContext(PublicAccessLayoutContext);

  if (context === undefined) {
    throw new Error('usePublicLayout must be used within a publicAccessLayout');
  }

  return context;
};
