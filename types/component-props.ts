import { ITemplateWeding } from "@/prisma/schema.types";

export interface BaseComponentProps {
  payload: ITemplateWeding;
  setPayload: React.Dispatch<React.SetStateAction<ITemplateWeding>>;
  session?: any;
  showPencil?: boolean;
  setShowPencil?: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit?: () => void;
  loading?: boolean
}
