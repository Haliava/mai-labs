import { useEffect, useRef, useState } from "react";

import { Switch, Input, Label, Dialog, Button } from "@/shared/ui";
import { MODALS } from "@/shared/const/ui";
import { Flag } from "@/shared/types/model/flag"
import { useEditFlag, useGetFlagsByOrgId } from "@/entities/flag/hooks";
import { useToast } from "@/shared/hooks/use-toast";
import { flagFieldToString } from "@/shared/lib/utils";
import { useModalStore } from "@/shared/store/modalStore"
import { useFlagStore } from "@/shared/store/flagStore";
import { useOrgStore } from "@/shared/store/orgStore";
import { getFlagsByOrgId } from "@/entities/flag/api";

export type EditFlagModalProps = {
  flag: Flag;
}

const MODAL_NAME = MODALS.EDIT_FLAG;

export const EditFlagModal = ({flag}: EditFlagModalProps) => {
  const {currentOrg} = useOrgStore();
  const {openModals, closeModal} = useModalStore();
  const formRef = useRef<HTMLFormElement>(null);
  const {toast} = useToast();
  const {mutate, data, isPending} = useEditFlag();
  const {id} = flag;
  const {flags, isLoading: areFlagsLoading} = useGetFlagsByOrgId(currentOrg.id);
  const {setFlags} = useFlagStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formFields, setFormFields] = useState<Map<string, any>>(new Map(Object.entries(flag)));

  useEffect(() => {
    if (!isPending && data !== undefined && !areFlagsLoading) {
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
  }, [isPending, data, areFlagsLoading, flags])

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeModal(MODAL_NAME);
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // backend
    mutate(Object.fromEntries(formFields.entries()) as Flag);
    console.log(formFields);
  }

  const handleCancel = () => {
    closeModal(MODAL_NAME);
  }

  return (
    <Dialog.Dialog open={openModals.has(MODAL_NAME)} onOpenChange={handleOpenChange}>
      <form ref={formRef}>
        <Dialog.DialogContent className="bg-[#FFF9ED]">
          <Dialog.DialogHeader>
            <h2>Редактирование флага #{id}</h2>
          </Dialog.DialogHeader>
          {Object.entries(flag).map(([key]) => {
            if (key as keyof Flag === 'organizationId') {
              return;
            }

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
                <p>Изменить</p>
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