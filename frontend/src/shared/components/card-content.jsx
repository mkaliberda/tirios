import React from 'react';

const CardContent = ({
  title,
  subtitle,
  actions,
  closeAction,
  children,
  className = '',
  contentClassName = '',
}) => {
  return (
    <section className={`mx-auto w-full max-w-5xl ${className}`.trim()}>
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(180deg,rgba(9,10,35,0.86),rgba(6,8,26,0.88))] p-6 shadow-[0_24px_90px_-35px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 -left-20 h-60 w-60 rounded-full opacity-75 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 88, 191, 0.35), rgba(255, 88, 191, 0) 70%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full opacity-80 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(79, 224, 255, 0.36), rgba(79, 224, 255, 0) 72%)',
          }}
        />

        {(title || subtitle) && (
          <header className="relative mb-6 border-b border-white/12 pb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-7">
                {title && (
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {title}
                </h1>
                )}
                {subtitle && <p className="mt-2 text-sm text-slate-200/80">{subtitle}</p>}
              </div>
              <div className="flex flex-3 items-center justify-end gap-2">
                {actions && <div className="w-full">{actions}</div>}
                {closeAction && <div className="shrink-0">{closeAction}</div>}
              </div>
            </div>
          </header>
        )}

        <div className={`relative ${contentClassName}`.trim()}>{children}</div>
      </div>
    </section>
  );
};

export default CardContent;
