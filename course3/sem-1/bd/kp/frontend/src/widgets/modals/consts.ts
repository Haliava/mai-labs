import { MODALS } from "@/shared/const/ui";
import { EditFlagModal, AddFlagModal, DeleteFlagModal } from ".";
import AddExistingOrgModal from "./addExistingOrgModal";
import EditOrgModal from "./editOrgModal";
import DeleteOrgModal from "./deleteOrgModal";
import AddOrgModal from './addOrgModal';

export const modalComponents: Record<any, any> = {
  [MODALS.EDIT_FLAG]: EditFlagModal,
  [MODALS.DELETE_FLAG]: DeleteFlagModal,
  [MODALS.ADD_FLAG]: AddFlagModal,
  [MODALS.ADD_EXISTING_ORG]: AddExistingOrgModal,
  [MODALS.EDIT_COMPANY]: EditOrgModal,
  [MODALS.DELETE_COMPANY]: DeleteOrgModal,
  [MODALS.ADD_COMPANY]: AddOrgModal,
}