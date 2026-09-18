import { useId } from 'react';

export function BrandMark() {
  const maskId = useId();

  return <svg className="brand-mark" viewBox="11 181 1481 900" aria-hidden="true" focusable="false">
    <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1500" height="1125">
        <image href="/images/varun-logo.png" width="1500" height="1125" />
      </mask>
    </defs>
    <rect x="11" y="181" width="1481" height="900" fill="#1e242a" mask={`url(#${maskId})`} />
  </svg>;
}
