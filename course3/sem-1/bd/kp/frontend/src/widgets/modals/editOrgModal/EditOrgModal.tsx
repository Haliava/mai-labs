/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { MODALS } from "@/shared/const/ui";
import { Button } from "@/shared/ui/button";
import { useModalStore } from "@/shared/store/modalStore"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/shared/ui/dialog";
import { Organization, Setting } from "@/shared/types/model/organization";
import { useEditOrgData, useGetEmployeesByOrgId, useGetSettingsByOrgId } from "@/entities/organization/hooks";
import { toast } from "@/shared/hooks/use-toast";
import { useUserStore } from "@/shared/store/userStore";
import { useOrgStore } from "@/shared/store/orgStore";
import { getOrganizations } from "@/entities/organization/api";

export type EditOrgModalProps = {
  org: Organization;
}

const MODAL_NAME = MODALS.EDIT_COMPANY;

export const EditOrgModal = ({org}: EditOrgModalProps) => {
  const {user} = useUserStore()
  const {setOrgs, orgs} = useOrgStore()
  const {openModals, closeModal} = useModalStore();
  const formRef = useRef<HTMLFormElement>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const {id, name} = org;      
  // backend
  const {data: employees, isLoading: isEmployeesLoading} = useGetEmployeesByOrgId(id);
  // backend
  const {data: settings, isLoading: isSettingsLoading} = useGetSettingsByOrgId(id);
  const {mutate, hasErrors, isPending} = useEditOrgData(id);
  const [formFields, setFormFields] = useState<Map<keyof Organization, any>>(
    new Map(Object.entries(org)) as Map<keyof Organization, any>
  );
  const [formSettings, setFormSettings] = useState(new Map<string, string>());
  const [formEmployees, setFormEmployees] = useState<number[]>([])

  useEffect(() => {
    if (!isPending && wasSubmitted) {
      if (hasErrors) {
        toast({
          title: 'Ошибка',
        })
      } else {
        if (user) {
          getOrganizations().then(res => setOrgs(res))
        }
        closeModal(MODAL_NAME);
      }
    }
  }, [isPending, hasErrors, wasSubmitted, closeModal])

  useEffect(() => {
    if (!isSettingsLoading && settings) {
      settings.forEach(({setting_key, setting_value}) => {
        setFormSettings(prev => prev.set(setting_key, setting_value))
      })
    }
  }, [isSettingsLoading])

  useEffect(() => {
    if (!isEmployeesLoading && employees) {
      setFormEmployees(employees)
    }
  }, [isEmployeesLoading])

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeModal(MODAL_NAME);
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setWasSubmitted(true);
    // backend
    mutate({
      org: Object.fromEntries(formFields.entries()) as Organization,
      employees: undefined,
      settings: Array.from(formSettings.entries()).map(
        entry => ({id: entry[0], setting_key: entry[1], setting_value: entry[2]})
      ) as unknown as Setting[],
    });
  }

  return (
    <Dialog open={openModals.has(MODAL_NAME)} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#FFF9ED]">
        <form ref={formRef} onSubmit={handleSubmit}>
          <DialogHeader>
            <h2>Редактирование компании {name}</h2>
          </DialogHeader>
            {org && Object.entries(org).map(([key]) => (
              <>
                <Label key={key + 1} htmlFor={key}>{key}</Label>
                <Input className="border-0 bg-[#EDF2FF] focus-visible:ring-[#E8EDFE] focus-visible:shadow-sm focus-visible:ring-offset-0"
                  key={key + 2}
                  id={key}
                  type="text"
                  value={formFields.get(key as keyof Organization)}
                  onChange={(e) => setFormFields(prev => structuredClone(prev).set(key as keyof Organization, e.target.value))}
                />
              </>
            ))}
            {!isSettingsLoading && settings && settings.length > 0 && (
              <div className="mt-2">
                <p>Настройки</p>
                {settings.map(({id, setting_key}) => (
                  <>
                    <Label key={setting_key} htmlFor={setting_key}>{setting_key}</Label>
                    <Input className="border-0 bg-[#EDF2FF] focus-visible:ring-[#E8EDFE] focus-visible:shadow-sm focus-visible:ring-offset-0"
                      key={setting_key + 1}
                      id={setting_key}
                      type="text"
                      value={formSettings.get(setting_key)}
                      onChange={(e) => setFormSettings(prev => structuredClone(prev).set(setting_key, e.target.value))}
                    />
                  </>
                ))}
              </div>
            )}
          <DialogFooter>
            <Button className="bg-[#EDF2FF] hover:bg-[#E8EDFE] mt-5" type="submit">
              <p>Обновить</p>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}