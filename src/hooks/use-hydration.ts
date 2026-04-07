'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns true on the client after hydration, false during SSR.
 * Uses useSyncExternalStore to safely detect client-side rendering
 * without causing hydration mismatches.
 */
export function useHydration(): boolean {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}
