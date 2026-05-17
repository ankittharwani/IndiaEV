export function fmt(n) {
  const abs = Math.abs(n);
  if (abs >= 10000000) return '₹' + (n / 10000000).toFixed(1) + 'Cr';
  if (abs >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  return '₹' + Math.round(n / 1000) + 'K';
}

export const fmtKm = (n) => n.toLocaleString('en-IN') + ' km';

export const fmtPct = (n) => n.toFixed(1) + '%';
