import type { FC, HTMLAttributes } from 'react';

import classNames from 'classnames';

type Props = HTMLAttributes<HTMLSpanElement>;

/** Decorative call-room pulse orb for empty states. */
export const NightcordSignal: FC<Props> = ({ className, ...props }) => (
  <span
    className={classNames('empty-column-indicator__signal', className)}
    aria-hidden='true'
    {...props}
  />
);
