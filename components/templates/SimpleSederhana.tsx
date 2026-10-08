import React, { useEffect, useState } from 'react';
import KirigamiPastel from '../templateC/KirigamiPastel';
import useTemplateWedings from '@/hooks/useTemplateWweding';

interface SimpleSederhanaProps {
  guestName: string | null;
  isAdminView?: boolean;
  adminId?: string;
  templateWedingData?: any;
}

export default function SimpleSederhana({
  guestName,
  isAdminView = false,
  adminId,
  templateWedingData: initialData,
}: SimpleSederhanaProps) {
  const { templateWeding, handleGetTemplateWeding } = useTemplateWedings();
  const [data, setData] = useState<any>(initialData || null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else if (adminId) {
      handleGetTemplateWeding(adminId);
    }
  }, [adminId, initialData]);

  useEffect(() => {
    if (!initialData && templateWeding?.id) {
      setData(templateWeding);
    }
  }, [templateWeding, initialData]);

  return (
    <KirigamiPastel
      adminId={adminId}
      guestName={guestName}
      templateWedingData={data}
      isAdminView={isAdminView}
    />
  );
}