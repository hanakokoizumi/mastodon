import type { ButtonHTMLAttributes, FC } from 'react';

import classNames from 'classnames';

import classes from './button.module.scss';

type Variant = 'primary' | 'ghost' | 'quiet';

export const Button: FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
> = ({ variant = 'primary', className, type = 'button', ...props }) => (
  <button
    // eslint-disable-next-line react/button-has-type -- set correctly via TS
    type={type}
    className={classNames(classes.root, classes[variant], className)}
    {...props}
  />
);
