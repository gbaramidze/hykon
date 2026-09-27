'use client';

import React, { useState } from 'react';

interface BrandLogoProps {
  brandName: string;
  className?: string;
}

const BRAND_FILE_MAP: Record<string, { src: string; width: number; height: number; alt: string }> = {
  hikvision: { src: '/images/brands/hikvision.svg', width: 160, height: 40, alt: 'Hikvision Official Logo' },
  uniview: { src: '/images/brands/uniview.png', width: 140, height: 40, alt: 'Uniview UNV Official Logo' },
  ajax: { src: '/images/brands/ajax.svg', width: 120, height: 36, alt: 'Ajax Systems Official Logo' },
  hilook: { src: '/images/brands/hilook.png', width: 130, height: 38, alt: 'HiLook Official Logo' },
  hiwatch: { src: '/images/brands/hiwatch.svg', width: 140, height: 40, alt: 'HiWatch Official Logo' },
  ezviz: { src: '/images/brands/ezviz.png', width: 130, height: 40, alt: 'EZVIZ Official Logo' },
  ruijie: { src: '/images/brands/ruijie.svg', width: 130, height: 38, alt: 'Ruijie Reyee Official Logo' },
  seagate: { src: '/images/brands/seagate.svg', width: 130, height: 36, alt: 'Seagate Official Logo' },
  'western-digital': { src: '/images/brands/western-digital.svg', width: 140, height: 36, alt: 'Western Digital Official Logo' },
  toshiba: { src: '/images/brands/toshiba.svg', width: 130, height: 32, alt: 'Toshiba Official Logo' },
  ubiquiti: { src: '/images/brands/ubiquiti.png', width: 130, height: 48, alt: 'Ubiquiti Official Logo' },
  unipos: { src: '/images/brands/unipos.png', width: 130, height: 48, alt: 'UniPOS Fire Security Logo' },
  bigbat: { src: '/images/brands/bigbat.png', width: 120, height: 44, alt: 'BigBat Battery Logo' },
  cdvi: { src: '/images/brands/cdvi.png', width: 120, height: 44, alt: 'CDVI Access Control Logo' },
  beninca: { src: '/images/brands/beninca.png', width: 140, height: 40, alt: 'Beninca Automation Logo' },
  dahua: { src: '/images/brands/dahua.svg', width: 130, height: 36, alt: 'Dahua Technology Official Logo' },
  mikrotik: { src: '/images/brands/mikrotik.svg', width: 130, height: 36, alt: 'MikroTik Official Logo' },
  'tp-link': { src: '/images/brands/tp-link.svg', width: 130, height: 36, alt: 'TP-Link Official Logo' },
  cisco: { src: '/images/brands/cisco.svg', width: 120, height: 36, alt: 'Cisco Official Logo' },
  zkteco: { src: '/images/brands/zkteco.png', width: 120, height: 40, alt: 'ZKTeco Official Logo' },
  gsn: { src: '/images/brands/gsn.png', width: 120, height: 40, alt: 'GSN Electronic Company Logo' },
  paradox: { src: '/images/brands/paradox.png', width: 130, height: 36, alt: 'Paradox Security Official Logo' },
  detnov: { src: '/images/brands/detnov.png', width: 130, height: 36, alt: 'Detnov Official Logo' },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({ brandName, className = 'h-7 w-auto' }) => {
  const [error, setError] = useState(false);
  const slug = (brandName || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

  const brandInfo = BRAND_FILE_MAP[slug] || (slug.includes('uniview') ? BRAND_FILE_MAP['uniview'] : null);

  if (brandInfo && !error) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src={brandInfo.src}
          alt={brandInfo.alt}
          className="max-h-full max-w-full object-contain filter transition-all duration-300 group-hover:scale-105"
          onError={() => setError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback if logo file is not in dictionary or failed to load
  return (
    <div className={`flex items-center justify-center font-mono font-extrabold text-sm tracking-wide text-zinc-800 group-hover:text-black ${className}`}>
      <span>{brandName}</span>
    </div>
  );
};
