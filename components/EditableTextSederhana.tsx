'use client';

import clsx from 'clsx';

interface EditableTextSederhanaProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  session?: string | undefined;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  multiline?: boolean;
  rows?: number;
}

export default function EditableTextSederhana({
  value,
  placeholder = '',
}: EditableTextSederhanaProps) {
  return (
    <span>
      {value || placeholder}
    </span>
  );
}
