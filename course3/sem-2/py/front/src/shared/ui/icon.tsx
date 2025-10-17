import React from 'react';

import * as icons from '@/shared/assets/icons';
import { TIcon } from '@/shared/types/ui';

export type TIconProps = {
  className?: string;
  icon: TIcon;
  size?: number;
  color?: string;
};

export const Icon = React.forwardRef<SVGSVGElement, TIconProps>(
  ({ icon, size, color = 'black', className }: TIconProps, ref) => {
    const IconElement = icons[icon];

    return <IconElement width={0} height={0} style={{width: size, height: 'auto'}} className={className} ref={ref} color={color} stroke={color} />;
  },
);
