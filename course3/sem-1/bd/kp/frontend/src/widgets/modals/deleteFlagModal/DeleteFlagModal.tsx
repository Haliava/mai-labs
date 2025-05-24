import { useEffect } from "react";

import { MODALS } from "@/shared/const/ui";
import { Button } from "@/shared/ui/button";
import { Flag } from "@/shared/types/model/flag"
import { toast } from "@/shared/hooks/use-toast";
import { useDeleteFlag } from "@/entities/flag/hooks";
import { getFlagsByOrgId } from "@/entities/flag/api";
import { useOrgStore } from "@/shared/store/orgStore";
import { useFlagStore } from "@/shared/store/flagStore";
import { useModalStore } from "@/shared/store/modalStore"
import { Dialog, DialogContent, DialogHeader } from "@/shared/ui/dialog";

export type DeleteFlagModalProps = {
  flag: Flag;
}

const MODAL_NAME = MODALS.DELETE_FLAG;

export const DeleteFlagModal = ({flag}: DeleteFlagModalProps) => {
  const {setFlags} = useFlagStore();
  const {currentOrg} = useOrgStore();
  const {openModals, closeModal} = useModalStore();
  const {mutate, data, isPending} = useDeleteFlag();
  const {id} = flag ?? {id: 1};

  useEffect(() => {
    if (!isPending && data !== undefined) {
      console.log(data)
      if (!data?.ok) {
        toast({
          title: 'Ошибка',
          description: `${data?.status}: ${data?.statusText}`,
        })
      } else {
        getFlagsByOrgId(currentOrg.id).then(res => res.json()).then(res => setFlags(res))
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
    mutate(id);
  }

  return (
    <Dialog open={openModals.has(MODAL_NAME)} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#FFF9ED]">
        <DialogHeader>
          <h2>Вы уверены, что хотите удалить флаг #{id}?</h2>
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