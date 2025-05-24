import { useEffect, useState } from "react";

import { MODALS } from "@/shared/const/ui";
import { useToast } from "@/shared/hooks/use-toast";
import { Button, Dialog, Select } from "@/shared/ui";
import { useOrgStore } from "@/shared/store/orgStore";
import { useUserStore } from "@/shared/store/userStore";
import { useModalStore } from "@/shared/store/modalStore";
import { useAddUserToOrg } from "@/entities/organization/hooks";

const MODAL_NAME = MODALS.ADD_EXISTING_ORG;

export const AddExistingOrgModal = () => {
  const {openModals, closeModal} = useModalStore();
  const {orgs} = useOrgStore();
  const {user} = useUserStore();
  const {toast} = useToast();
  const {mutate, data, isPending} = useAddUserToOrg();
  const [selectValue, setSelectValue] = useState<string>('');

  useEffect(() => {
    if (!isPending && data !== undefined) {
      if (data?.error) {
        toast({
          title: 'Ошибка',
          description: `${data.error}`,
        })
      } else {
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

  const handleAddOrg = () => {
    // backend 
    mutate({userId: user!.id, orgId: +selectValue})
  }

  return (
    <Dialog.Dialog open={openModals.has(MODAL_NAME)} onOpenChange={handleOpenChange}>
      <Dialog.DialogContent className="bg-[#FFF9ED]">
        <Dialog.DialogHeader>
          <h2>К какой организации Добавить текущего пользователя?</h2>
        </Dialog.DialogHeader>
        <Select.Select onValueChange={setSelectValue} value={selectValue}>
          <Select.SelectTrigger className="w-full">
            <Select.SelectValue placeholder="Организация" />
          </Select.SelectTrigger>
          <Select.SelectContent>
            {orgs && orgs.map(org => (
              <Select.SelectItem key={org.id} value={String(org.id)}>{org.name}</Select.SelectItem>
            ))}
          </Select.SelectContent>
        </Select.Select>
        <div className="flex justify-end gap-2">
          <Button className="bg-green-100 hover:bg-green-200 mt-5" onClick={handleAddOrg} type="button">
            <p>Добавить</p>
          </Button>
          <Button className="bg-[#EDF2FF] hover:bg-[#E8EDFE] mt-5" onClick={handleCancel} type="button">
            <p>Отмена</p>
          </Button>
        </div>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  )
};