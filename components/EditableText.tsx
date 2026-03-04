'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  session?: string | undefined;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  inputClassName?: string;
  spanClassName?: string;
  multiline?: boolean;
  rows?: number;
}

export default function EditableText({
  value,
  onChange,
  placeholder = 'Isi teks',
  session,
  showPencil = false,
  setShowPencil,
  inputClassName = '',
  spanClassName = '',
  multiline = false,
  rows = 3,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    // Jika user logged in (session ada), tidak bisa double click untuk edit
    if (session) {
      return;
    }
    // Toggle showPencil mode untuk guest
    if (setShowPencil) {
      setShowPencil(prev => !prev);
    }
  };

  const handleClick = () => {
    // Hanya admin yang bisa klik untuk edit
    if (session) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (session) {
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const baseInputClass = clsx(
    'bg-transparent',
    'border-none',
    'outline-none',
    'focus:outline-none',
    'focus:ring-0',
    'shadow-none',
    'text-center',
    'w-full',
    inputClassName
  );

  const baseSpanClass = clsx(
    session ? 'cursor-pointer hover:opacity-80' : '',
    spanClassName
  );

  // Show input if: showPencil mode OR admin is editing
  const shouldShowInput = showPencil || (session && isEditing);

  return (
    <>
      {shouldShowInput ? (
        multiline ? (
          <textarea
            value={value}
            placeholder={placeholder}
            onDoubleClick={handleDoubleClick}
            onChange={handleChange}
            onBlur={handleBlur}
            className={baseInputClass}
            autoFocus
            rows={rows}
          />
        ) : (
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onDoubleClick={handleDoubleClick}
            onChange={handleChange}
            onBlur={handleBlur}
            className={baseInputClass}
            autoFocus
          />
        )
      ) : (
        <span
          onClick={handleClick}
          className={baseSpanClass}
        >
          {value || placeholder}
        </span>
      )}
    </>
  );
}
