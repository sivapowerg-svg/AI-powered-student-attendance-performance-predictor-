import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  avatarUrl?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  size = 'md', 
  className = '', 
  avatarUrl 
}) => {
  // Compute initials
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'ST';

  // Deterministic aesthetic gradient selection based on name hash
  const gradients = [
    'from-indigo-600 to-purple-600 text-white',
    'from-blue-600 to-cyan-600 text-white',
    'from-emerald-600 to-teal-600 text-white',
    'from-violet-600 to-fuchsia-600 text-white',
    'from-rose-500 to-amber-500 text-white',
    'from-amber-600 to-orange-600 text-white',
    'from-sky-600 to-indigo-600 text-white',
    'from-teal-600 to-emerald-600 text-white',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradient = gradients[Math.abs(hash) % gradients.length];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-20 h-20 text-xl',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl font-bold tracking-tight shadow-xs bg-gradient-to-tr ${gradient} ${sizeClasses[size]} ${className}`}
      title={name}
      aria-label={name}
    >
      <span className="select-none font-semibold">{initials}</span>
    </div>
  );
};
