import React from 'react';

const ItemTextCard = ({ title, text }) => {
  return (
    <div className="min-h-16 rounded-xl border border-white/14 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-300/80">{title}</p>
      <p className="mt-1 text-lg text-slate-100/95">{text}</p>
    </div>
  );
};

export default ItemTextCard;
