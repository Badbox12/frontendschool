// src/utils/cookies.ts
export function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined; // guard for server-side
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : undefined;
  }
  
  