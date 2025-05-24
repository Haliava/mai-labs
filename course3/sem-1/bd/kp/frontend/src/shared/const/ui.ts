import { LabelColors } from "../types/ui";

export const flagStatusToColorMap: Record<string, LabelColors> = {
  0: LabelColors.DANGER,
  1: LabelColors.OK,
}

export enum MODALS {
  EDIT_FLAG = 'EDIT_FLAG',
  DELETE_FLAG = 'DELETE_FLAG',
  ADD_FLAG = 'ADD_FLAG',
  ADD_EXISTING_ORG = 'ADD_EXISTING_ORG',
  ADD_COMPANY = 'ADD_COMPANY',
  EDIT_COMPANY = 'EDIT_COMPANY',
  DELETE_COMPANY = 'DELETE_COMPANY',
}
