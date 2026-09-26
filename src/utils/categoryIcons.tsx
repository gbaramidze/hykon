import React from 'react';
import {
  Camera,
  Video,
  Server,
  Cpu,
  ShieldAlert,
  KeyRound,
  HardDrive,
  Network,
  Wifi,
  Zap,
  Wrench,
  Cable,
  Laptop,
  Smartphone,
  Tv,
  Layers,
  ShieldCheck,
  Radio,
  Lock,
  Box
} from 'lucide-react';

export const getCategoryIcon = (
  iconName?: string,
  categoryIdOrSlug?: string,
  className = 'w-4 h-4'
): React.ReactNode => {
  // Direct iconName matching
  switch (iconName) {
    case 'Camera':
      return <Camera className={className} />;
    case 'Video':
      return <Video className={className} />;
    case 'Server':
      return <Server className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'KeyRound':
      return <KeyRound className={className} />;
    case 'HardDrive':
      return <HardDrive className={className} />;
    case 'Network':
      return <Network className={className} />;
    case 'Wifi':
      return <Wifi className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Cable':
      return <Cable className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Tv':
      return <Tv className={className} />;
  }

  // Fallback pattern matching by category id / slug / name
  if (categoryIdOrSlug) {
    const key = categoryIdOrSlug.toLowerCase();
    if (key.includes('ip-cam') || key.includes('ip-კამერ')) return <Camera className={className} />;
    if (key.includes('analog') || key.includes('ანალოგ')) return <Video className={className} />;
    if (key.includes('nvr') || key.includes('ქსელურ')) return <Server className={className} />;
    if (key.includes('dvr') || key.includes('xvr')) return <Cpu className={className} />;
    if (key.includes('alarm') || key.includes('სიგნალიზაც')) return <ShieldAlert className={className} />;
    if (key.includes('access') || key.includes('domofon') || key.includes('დაშვებ')) return <KeyRound className={className} />;
    if (key.includes('storage') || key.includes('disk') || key.includes('მყარი')) return <HardDrive className={className} />;
    if (key.includes('switch') || key.includes('poe') || key.includes('სვიჩ')) return <Network className={className} />;
    if (key.includes('router') || key.includes('wifi') || key.includes('როუტერ')) return <Wifi className={className} />;
    if (key.includes('power') || key.includes('kveba') || key.includes('კვებ')) return <Zap className={className} />;
    if (key.includes('bracket') || key.includes('samagr') || key.includes('სამაგრ')) return <Wrench className={className} />;
    if (key.includes('cable') || key.includes('kabel') || key.includes('კაბელ')) return <Cable className={className} />;
  }

  return <Camera className={className} />;
};
