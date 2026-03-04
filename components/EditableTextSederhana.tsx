'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface EditableTextSederhanaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  session?: string | undefined;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  multiline?: boolean;
  rows?: number;
}

export default function EditableTextSederhana({
  value,
  onChange,
  placeholder = 'Isi teks',
  session,
  showPencil = false,
  setShowPencil,
  multiline = false,
  rows = 3,
}: EditableTextSederhanaProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    if (session) return;
    if (setShowPencil) {
      setShowPencil(prev => !prev);
    }
  };

  const handleClick = () => {
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
            className={clsx(
              'bg-transparent',
              'border-none',
              'outline-none',
              'focus:outline-none',
              'focus:ring-0',
              'text-center',
              'w-full',
              'text-white'
            )}
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
            className={clsx(
              'bg-transparent',
              'border-none',
              'outline-none',
              'focus:outline-none',
              'focus:ring-0',
              'text-center',
              'w-full',
              'text-white'
            )}
            autoFocus
          />
        )
      ) : (
        <span
          onClick={handleClick}
          className={clsx(session ? 'cursor-pointer hover:opacity-80' : '')}
        >
          {value || placeholder}
        </span>
      )}
    </>
  );
}
