import { useEffect } from 'react';

export function useOnMount(callback: () => void): void {
  useEffect(callback, []);
}
