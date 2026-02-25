'use client';

import { useEffect } from 'react';

export default function AOSInit() {
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof AOS !== 'undefined') {
      // @ts-ignore
      AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
      });
    }
  }, []);

  return null;
}
