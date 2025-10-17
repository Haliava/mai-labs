import { ReactNode } from 'react';

import * as icons from '@/shared/assets/icons';

export type TIcon = keyof typeof icons;
export type CustomComponentProps = {
  children?: ReactNode | string;
  className?: string;
};
