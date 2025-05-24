import { useEffect, useRef, useState } from "react";

import { MODALS } from "@/shared/const/ui";
import { Label } from "@radix-ui/react-label";
import { useToast } from "@/shared/hooks/use-toast";
import { Button, Dialog, Input } from "@/shared/ui";
import { flagFieldToString } from "@/shared/lib/utils";
import { useModalStore } from "@/shared/store/modalStore"
import { useAddOrg } from "@/entities/organization/hooks";
import { Organization } from "@/shared/types/model/organization";

const MODAL_NAME = MODALS.ADD_COMPANY;

export const AddOrgModal = () => {
  const {openModals, closeModal} = useModalStore();
  const {mutate, isPending, data} = useAddOrg();
  const {toast} = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const org: Omit<Organization, 'id'> = {
    name: '',
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formFields, setFormFields] = useState<Map<keyof Organization, any>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Map(Object.entries(org)) as Map<keyof Organization, any>
  );

  useEffect(() => {
    if (!isPending && data !== undefined) {
      console.log(data)
      if (!data?.ok) {
        toast({
          title: 'Ошибка',
          description: `${data?.status}: ${data?.statusText}`,
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

  const handleSubmit: React.FormEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    console.log(Object.fromEntries(formFields.entries()));
    mutate(Object.fromEntries(formFields.entries()) as Organization);
  }

  return (
    <Dialog.Dialog open={openModals.has(MODAL_NAME)} onOpenChange={handleOpenChange}>
      <form ref={formRef}>
        <Dialog.DialogContent className="bg-[#FFF9ED]">
          <Dialog.DialogHeader>
            <h2>Создание новой компании</h2>
          </Dialog.DialogHeader>
          {Object.entries(org).map(([key]) => {
            return (
              <>
                <Label key={key + 1} htmlFor={key}>{flagFieldToString[key as keyof Organization]}</Label>
                <Input className="border-0 bg-[#EDF2FF] focus-visible:ring-[#E8EDFE] focus-visible:shadow-sm focus-visible:ring-offset-0"
                  key={key + 2}
                  id={key}
                  type="text"
                  value={formFields.get(key as keyof Organization)}
                  onChange={(e) => setFormFields(prev => structuredClone(prev).set(key as keyof Organization, e.target.value))}
                />
              </>
          )})}
          <Dialog.DialogFooter>
            <div className="flex justify-end gap-2">
              <Button className="bg-green-100 hover:bg-green-200 mt-5" onClick={handleSubmit} type="submit">
                <p>Создать</p>
              </Button>
              <Button className="bg-[#EDF2FF] hover:bg-[#E8EDFE] mt-5" onClick={handleCancel} type="button">
                <p>Отмена</p>
              </Button>
            </div>
          </Dialog.DialogFooter>
        </Dialog.DialogContent>
      </form>
    </Dialog.Dialog>
  )
}