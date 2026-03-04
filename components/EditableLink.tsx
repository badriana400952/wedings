'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface EditableLinkProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  session?: string | undefined;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  linkText?: string;
  linkIcon?: string;
  inputClassName?: string;
  linkClassName?: string;
}

export default function EditableLink({
  value,
  onChange,
  placeholder = 'https://...',
  session,
  showPencil = false,
  setShowPencil,
  linkText = 'Open Link',
  linkIcon = 'fa-link',
  inputClassName = '',
  linkClassName = '',
}: EditableLinkProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    if (session) {
      return;
    }
    if (setShowPencil) {
      setShowPencil(prev => !prev);
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (session) {
      e.preventDefault();
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (session) {
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const baseInputClass = clsx(
    'bg-transparent',
    'border',
    'border-gray-300',
    'dark:border-gray-600',
    'rounded-pill',
    'outline-none',
    'focus:outline-none',
    'focus:ring-0',
    'shadow-none',
    'text-center',
    'w-full',
    'px-3',
    'py-1',
    'text-sm',
    inputClassName
  );

  const baseLinkClass = clsx(
    'btn',
    'btn-outline-auto',
    'btn-sm',
    'shadow',
    'rounded-pill',
    'px-3',
    'py-1',
    'text-gray-900',
    'dark:text-white',
    'border-gray-900',
    'dark:border-white',
    'hover:bg-gray-900',
    'hover:text-white',
    'dark:hover:bg-white',
    'dark:hover:text-gray-900',
    session ? 'cursor-pointer' : '',
    linkClassName
  );

  const shouldShowInput = showPencil || (session && isEditing);

  return (
    <>
      {shouldShowInput ? (
        <input
          type="url"
          value={value}
          placeholder={placeholder}
          onDoubleClick={handleDoubleClick}
          onChange={handleChange}
          onBlur={handleBlur}
          className={baseInputClass}
          autoFocus
        />
      ) : (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className={baseLinkClass}
          style={{ fontSize: '0.825rem', textDecoration: 'none' }}
        >
          {linkIcon && <i className={clsx('fa-solid', linkIcon, 'me-2')}></i>}
          {linkText}
        </a>
      )}
    </>
  );
}
