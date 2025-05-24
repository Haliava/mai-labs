/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Flag } from "../types/model/flag"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const appearTransition = (delay: number) => ({
  from: { opacity: 0, translateY: window.innerHeight },
  enter: { opacity: 1, translateY: 0 },
  leave: { opacity: 0 },
  config: { tension: 400, friction: 50 },
  trail: delay,
})

export const flagFieldToString: Record<keyof Flag, string> = {
  id: 'ID',
  description: 'Описание',
  name: 'Название',
  organizationId: 'ID компании',
  status: 'Значение',
}

export const flattenObject = (obj: any, key?: string): any => {
  return Object.entries(obj).reduce((flatten, [entryKey, entry]: any) => {
    let targetKey = entryKey;
    if (key) {
      targetKey = `${key}[${entryKey}]`;
    }
    if (Array.isArray(entry)) {
      return {
        ...flatten,
        ...entry.reduce((flattenEntry, entryItem, index) => {
          return {
            ...flattenEntry,
            ...flattenObject({ [index]: entryItem }, targetKey),
          };
        }, {}),
      };
    }
    if (typeof entry === 'object') {
      if (entry instanceof Blob || entry === null) {
        return {
          ...flatten,
          [targetKey]: entry,
        };
      }
      return {
        ...flatten,
        ...flattenObject(entry, targetKey),
      };
    }
    return {
      ...flatten,
      [targetKey]: entry,
    };
  }, {});
};
