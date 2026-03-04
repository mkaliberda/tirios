/* eslint-disable react/no-array-index-key */
import React from 'react';

const MainBgViceCity = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-dvh w-full overflow-hidden bg-[#05020d] ${className}`}>
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-48 h-[520px] w-[520px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-56 -right-56 h-[620px] w-[620px] rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      {/* Neon sun */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2">
        <div className="relative h-44 w-44 rounded-full bg-gradient-to-b from-yellow-200/80 via-pink-400/60 to-fuchsia-500/25 shadow-[0_0_40px_rgba(255,70,200,0.55),0_0_120px_rgba(0,255,255,0.22)]">
          {/* Sun stripes */}
          <div
            className="absolute inset-0 rounded-full opacity-70"
            style={{
              background:
                'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 8px, rgba(0,0,0,0.22) 10px, rgba(0,0,0,0.22) 14px)',
              maskImage: 'radial-gradient(circle at center, black 62%, transparent 73%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 62%, transparent 73%)',
            }}
          />
        </div>
      </div>

      {/* Horizon glow */}
      <div className="pointer-events-none absolute inset-x-0 top-[250px] h-28 bg-gradient-to-b from-fuchsia-500/25 via-cyan-400/10 to-transparent blur-xl" />

      {/* Grid floor */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              'linear-gradient(to top, rgba(0,255,255,0.18), transparent 60%),'
              + 'repeating-linear-gradient(to right, rgba(0,255,255,0.18) 0px, rgba(0,255,255,0.18) 1px, transparent 1px, transparent 44px),'
              + 'repeating-linear-gradient(to top, rgba(255,0,200,0.16) 0px, rgba(255,0,200,0.16) 1px, transparent 1px, transparent 40px)',
            transform: 'perspective(900px) rotateX(60deg)',
            transformOrigin: 'bottom',
          }}
        />
      </div>

      {/* Optional scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          background:
            'repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)',
        }}
      />

      {/* Put page content above the background */}
      <div className="relative z-10 min-h-dvh w-full p-6 pt-[20vh] text-white">{children}</div>
    </div>
  );
};

export default MainBgViceCity;
