'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

interface EditableDateProps {
  value: string | Date;
  onChange: (value: string) => void;
  formatDisplay?: (date: string | Date) => string;
  session?: string | undefined;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  onCalendarClick?: () => void; // Callback untuk buka calendar modal
  className?: string;
  inputClassName?: string;
  spanClassName?: string;
}

export default function EditableDate({
  value,
  onChange,
  formatDisplay,
  session,
  showPencil = false,
  setShowPencil,
  onCalendarClick,
  className = '',
  inputClassName = '',
  spanClassName = '',
}: EditableDateProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Convert Date to string format for input[type="date"]
  const getDateString = (date: string | Date): string => {
    if (!date) return '';
    
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return '';
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  const handleDoubleClick = () => {
    if (session) {
      return;
    }
    if (setShowPencil) {
      setShowPencil(prev => !prev);
    }
  };

  const handleClick = () => {
    if (session) {
      // Jika ada onCalendarClick, gunakan calendar modal
      if (onCalendarClick) {
        onCalendarClick();
      } else {
        // Jika tidak, gunakan native date input
        setIsEditing(true);
      }
    }
  };

  const handleBlur = () => {
    if (session) {
      setIsEditing(false);
    }
    if (setShowPencil && showPencil) {
      setShowPencil(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Prevent hydration mismatch by using simple format on server
  const displayValue = isMounted && formatDisplay 
    ? formatDisplay(value) 
    : getDateString(value);

  const baseInputClass = clsx(
    'bg-transparent',
    'border',
    'border-white',
    'rounded',
    'px-2',
    'py-1',
    'outline-none',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-white',
    'text-center',
    'w-full',
    'text-white',
    inputClassName
  );

  const baseSpanClass = clsx(
    session ? 'cursor-pointer hover:opacity-80' : '',
    spanClassName
  );

  const shouldShowInput = isMounted && (showPencil || (session && isEditing && !onCalendarClick));

  // Prevent hydration mismatch - always render span on server with minimal classes
  if (!isMounted) {
    return (
      <div>
        <span className={spanClassName}>
          {getDateString(value)}
        </span>
      </div>
    );
  }

  return (
    <div>
      {shouldShowInput ? (
        <input
          type="date"
          value={getDateString(value)}
          onDoubleClick={handleDoubleClick}
          onChange={handleChange}
          onBlur={handleBlur}
          className={baseInputClass}
          autoFocus
        />
      ) : (
        <span
          onClick={handleClick}
          className={baseSpanClass}
        >
          {displayValue}
        </span>
      )}
    </div>
  );
}
