export const BLOCK_KEY = 'swissBLOCKRender';
export const ALLOW_KEY = 'swissALLOWRender';

export function condition(condition: any): string {
  return condition ? `${ALLOW_KEY}-${Math.random().toString(36)}` : BLOCK_KEY;
}
