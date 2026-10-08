'use client';

import clsx from 'clsx';

interface EditableTextProps {
  value: string;
  onChange?: (value: string) => void;
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
  placeholder = '',
  spanClassName = '',
}: EditableTextProps) {
  return (
    <span className={clsx(spanClassName)}>
      {value || placeholder}
    </span>
  );
}
