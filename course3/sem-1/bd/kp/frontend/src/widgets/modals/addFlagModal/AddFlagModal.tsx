import { useEffect, useRef, useState } from "react";

import { MODALS } from "@/shared/const/ui";
import { useToast } from "@/shared/hooks/use-toast";
import { Label } from "@radix-ui/react-label";
import { Flag } from "@/shared/types/model/flag"
import { useOrgStore } from "@/shared/store/orgStore";
import { flagFieldToString } from "@/shared/lib/utils";
import { useAddFlagToOrg } from "@/entities/flag/hooks";
import { useModalStore } from "@/shared/store/modalStore"
import { Button, Dialog, Input, Switch } from "@/shared/ui";
import { getFlagsByOrgId } from "@/entities/flag/api";
import { useFlagStore } from "@/shared/store/flagStore";

const MODAL_NAME = MODALS.ADD_FLAG;

export const AddFlagModal = () => {
  const {setFlags} = useFlagStore();
  const {openModals, closeModal} = useModalStore();
  const {currentOrg} = useOrgStore();
  const {mutate, isPending, data} = useAddFlagToOrg();
  const {toast} = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const flag: Omit<Flag, 'id'> = {
    description: '',
    name: '',
    status: false,
    organizationId: currentOrg.id,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formFields, setFormFields] = useState<Map<keyof Flag, any>>(new Map(Object.entries(flag)) as Map<keyof Flag, any>);

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

  const handleSubmit: React.FormEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    console.log(Object.fromEntries(formFields.entries()));
    mutate(Object.fromEntries(formFields.entries()) as Flag);
  }

  return (
    <Dialog.Dialog open={openModals.has(MODAL_NAME)} onOpenChange={handleOpenChange}>
      <form ref={formRef}>
        <Dialog.DialogContent className="bg-[#FFF9ED]">
          <Dialog.DialogHeader>
            <h2>Создание нового флага</h2>
          </Dialog.DialogHeader>
          {Object.entries(flag).map(([key]) => {
            if (key as keyof Flag === 'status') {
              return (
                <>
                  <Label key={key + 1} htmlFor={key}>{flagFieldToString[key as keyof Flag]}</Label>
                  <div className="flex align-middle gap-2">
                    <Switch
                      key={key + 2}
                      id={key}
                      checked={formFields.get(key as keyof Flag)}
                      onCheckedChange={(e) => setFormFields(prev => structuredClone(prev).set(key as keyof Flag, e))}
                    />
                    <p>{formFields.get(key as keyof Flag) ? 'Активен': 'Неактивен'}</p>
                  </div>
                </>
              )
            }

            return (
              <>
                <Label key={key + 1} htmlFor={key}>{flagFieldToString[key as keyof Flag]}</Label>
                <Input className="border-0 bg-[#EDF2FF] focus-visible:ring-[#E8EDFE] focus-visible:shadow-sm focus-visible:ring-offset-0"
                  key={key + 2}
                  id={key}
                  type="text"
                  value={formFields.get(key as keyof Flag)}
                  onChange={(e) => setFormFields(prev => structuredClone(prev).set(key as keyof Flag, e.target.value))}
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