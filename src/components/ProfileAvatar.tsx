'use client';

import { User } from 'lucide-react';

interface ProfileAvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export default function ProfileAvatar({ 
  src, 
  name, 
  size = 'md', 
  className = '',
  showBorder = false
}: ProfileAvatarProps) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Generate initials from name
  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const borderClass = showBorder ? 'ring-2 ring-white ring-offset-2' : '';

  return (
    <div className={`${sizeClasses[size]} ${borderClass} rounded-full overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || 'Profile'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, hide it and show fallback
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : name ? (
        <div className={`${textSizes[size]} font-medium text-gray-600 bg-gradient-to-br from-blue-400 to-purple-500 text-white w-full h-full flex items-center justify-center`}>
          {getInitials(name)}
        </div>
      ) : (
        <User className={`${iconSizes[size]} text-gray-400`} />
      )}
    </div>
  );
}