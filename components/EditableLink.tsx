'use client';

import clsx from 'clsx';

interface EditableLinkProps {
  value: string;
  onChange?: (value: string) => void;
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
  linkText = 'Open Link',
  linkIcon = 'fa-link',
  linkClassName = '',
}: EditableLinkProps) {
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
    linkClassName
  );

  if (!value) return null;

  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className={baseLinkClass}
      style={{ fontSize: '0.825rem', textDecoration: 'none' }}
    >
      {linkIcon && <i className={clsx('fa-solid', linkIcon, 'me-2')}></i>}
      {linkText}
    </a>
  );
}
