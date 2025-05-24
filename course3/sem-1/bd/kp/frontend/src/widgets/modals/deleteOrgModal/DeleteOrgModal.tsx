import { useEffect } from "react";

import { MODALS } from "@/shared/const/ui";
import { Button } from "@/shared/ui/button";
import { toast } from "@/shared/hooks/use-toast";
import { useModalStore } from "@/shared/store/modalStore"
import { Dialog, DialogContent, DialogHeader } from "@/shared/ui/dialog";
import { Organization } from "@/shared/types/model/organization";
import { useDeleteOrg } from "@/entities/organization/hooks";
import { useOrgStore } from "@/shared/store/orgStore";
import { getOrganizations } from "@/entities/organization/api";
import { useUserStore } from "@/shared/store/userStore";

export type DeleteOrgModalProps = {
  org: Organization;
}

const MODAL_NAME = MODALS.DELETE_COMPANY;

export const DeleteOrgModal = ({org}: DeleteOrgModalProps) => {
  const {user} = useUserStore();
  const {setOrgs} = useOrgStore();
  const {openModals, closeModal} = useModalStore();
  const {data, isPending, mutate} = useDeleteOrg();

  useEffect(() => {
    if (!isPending && data !== undefined) {
      if (!data?.ok) {
        toast({
          title: 'Ошибка',
          description: `${data?.status}: ${data?.statusText}`,
        })
      } else {
        if (user) {
          getOrganizations().then(res => setOrgs(res))
        }
        closeModal(MODAL_NAME);
      }
    }
  }, [isPending, data])

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeModal(MODAL_NAME);
    }
  }

  const handleCancel = () => {
    closeModal(MODAL_NAME);
  }

  const handleDelete = () => {
    // backend
    mutate(org.id);
  }

  return (
    <Dialog open={openModals.has(MODAL_NAME)} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#FFF9ED]">
        <DialogHeader>
          <h2>Вы уверены, что хотите удалить компанию {org.name}?</h2>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button className="bg-[#FFEDF3] hover:bg-[#FCE1E0] mt-5" onClick={handleDelete} type="button">
            <p>Удалить</p>
          </Button>
          <Button className="bg-[#EDF2FF] hover:bg-[#E8EDFE] mt-5" onClick={handleCancel} type="button">
            <p>Отмена</p>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}