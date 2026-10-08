'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

interface EditableDateProps {
  value: string | Date;
  onChange?: (value: string) => void;
  formatDisplay?: (date: string | Date) => string;
  session?: string | undefined;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  onCalendarClick?: () => void;
  className?: string;
  inputClassName?: string;
  spanClassName?: string;
}

export default function EditableDate({
  value,
  formatDisplay,
  spanClassName = '',
}: EditableDateProps) {
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

  const displayValue = isMounted && formatDisplay 
    ? formatDisplay(value) 
    : getDateString(value);

  return (
    <div>
      <span className={clsx(spanClassName)}>
        {displayValue}
      </span>
    </div>
  );
}
