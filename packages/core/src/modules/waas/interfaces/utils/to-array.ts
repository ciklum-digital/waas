export function toArray(obj: any): any[] {
  if (!!obj) {
    return Array.isArray(obj) ? obj : [obj];
  }

  return [];
}
