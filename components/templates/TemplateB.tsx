import React from 'react';
import TamanRahasia from '../template3/TamanRahasia';

interface TemplateBProps {
  adminId?: string;
  guestName?: string | null;
  templateWedingData?: any;
  isAdminView?: boolean;
}

const TemplateB: React.FC<TemplateBProps> = ({
  adminId,
  guestName,
  templateWedingData,
  isAdminView,
}) => {
  return (
    <TamanRahasia
      adminId={adminId}
      guestName={guestName}
      templateWedingData={templateWedingData}
      isAdminView={isAdminView}
    />
  );
};

export default TemplateB;