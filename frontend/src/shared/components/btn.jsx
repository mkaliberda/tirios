/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Link } from 'react-router-dom';

const SIZE_CLASSES = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
  icon: 'h-11 w-11',
};

const VARIANT_CLASSES = {
  primary:
    'border border-cyan-300/35 bg-cyan-400/10 font-medium text-cyan-100 hover:bg-cyan-400/20',
  secondary:
    'border border-white/25 bg-white/8 font-medium text-slate-100 hover:bg-white/14',
  text: 'border border-transparent bg-transparent p-0 font-medium text-slate-100 hover:text-cyan-200',
  icon: 'border border-white/25 bg-white/8 text-white/90 hover:bg-white/14',
};

const Btn = ({
  children,
  className = '',
  size = 'md',
  to,
  type = 'button',
  variant = 'secondary',
  disabled = false,
  ...props
}) => {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.secondary;
  const classes = [
    'inline-flex cursor-pointer items-center justify-center rounded-lg transition disabled:cursor-not-allowed',
    sizeClass,
    variantClass,
    className,
  ]
    .join(' ')
    .trim();

  if (to) {
    return (
      <Link className={classes} disabled={disabled} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    // eslint-disable-next-line react/button-has-type
    <button className={classes} type={type} {...props} disabled={disabled}>
      {children}
    </button>
  );
};

export default Btn;
