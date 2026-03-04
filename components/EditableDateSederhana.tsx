'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

interface EditableDateSederhanaProps {
  value: string | Date;
  onChange: (value: string) => void;
  formatDisplay?: (date: string | Date) => string;
  session?: string | undefined;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  onCalendarClick?: () => void;
}
export default function EditableDateSederhana({
  value,
  onChange,
  formatDisplay,
  session,
  showPencil = false,
  setShowPencil,
  onCalendarClick,
}: EditableDateSederhanaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    if (onCalendarClick) {
      onCalendarClick();
    } else if (setShowPencil && !session) {
      setShowPencil(prev => !prev);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleClick called, onCalendarClick:', !!onCalendarClick);
    if (onCalendarClick) {
      onCalendarClick();
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

  const displayValue = isMounted && formatDisplay 
    ? formatDisplay(value) 
    : getDateString(value);

  const shouldShowInput = isMounted && !onCalendarClick && (showPencil || (session && isEditing));

  // Server render - simple span
  if (!isMounted) {
    return <span>{getDateString(value)}</span>;
  }

  return (
    <>
      {shouldShowInput ? (
        <input
          type="date"
          value={getDateString(value)}
          onDoubleClick={handleDoubleClick}
          onChange={handleChange}
          onBlur={handleBlur}
          className={clsx(
            'bg-transparent',
            'border',
            'border-white',
            'rounded',
            'px-2',
            'py-1',
            'text-white',
            'text-center',
            'text-[0.75rem]',
            'font-light',
            'outline-none',
            'focus:ring-1',
            'focus:ring-white'
          )}
          autoFocus
        />
      ) : (
        <span
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: 'pointer', userSelect: 'none' }}
          className={clsx(
            'text-[0.75rem]',
            'font-light',
            'hover:opacity-80'
          )}
        >
          {displayValue}
        </span>
      )}
    </>
  );
}
