import { Input, Label, Button, Badge } from "@/shared/ui";
import { useUserStore } from "@/shared/store/userStore";
import { ROLES } from "@/shared/types/model/permission";
import { useModalStore } from "@/shared/store/modalStore";
import { MODALS } from "@/shared/const/ui";
import { useEffect } from "react";
import { useGetEmployeesByOrgId, useGetOrgs, useGetUserOrgs } from "@/entities/organization/hooks";
import { useOrgStore } from "@/shared/store/orgStore";

export const ProfilePage = () => {
  const {user} = useUserStore();
  const {openModal} = useModalStore();
  const {data, isLoading} = useGetOrgs();
  const {orgs, setOrgs} = useOrgStore();
  const {data: userOrgs, isLoading: isUserOrgsLoading} = useGetUserOrgs(user!.id);
  const {email, password, role} = user!;
  const isAdmin = role === ROLES.ADMIN;
  const shouldDisplayOrgList = !isUserOrgsLoading && !isLoading && orgs && userOrgs;

  useEffect(() => {
    if (isLoading || !data) {
      return;
    }

    setOrgs(data);
  }, [isLoading])

  const handleAddOrganization = () => {
    openModal({
      name: MODALS.ADD_EXISTING_ORG,
      props: {

      },
    });
  }

  return (
    <div className="flex flex-col gap-5 sm:w-[100vmin] sm:mt-0 lg:w-[80vmin] lg:mt-10 m-auto">
      <div>
        <div className="flex gap-2 items-center">
          <Label htmlFor={email}>Email</Label>
          <Input className="border-0 bg-[#EDF2FF] focus-visible:ring-[#E8EDFE] focus-visible:shadow-sm focus-visible:ring-offset-0"
            id={email}
            type="text"
            defaultValue={email.toString()}
          />
          <Badge className="h-[50%]" variant={isAdmin ? 'destructive' : 'outline'}>
            <p>{isAdmin ? 'Администратор': 'Обычный пользователь'}</p>
          </Badge>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Label htmlFor={password}>Пароль</Label>
        <Input className="border-0 bg-[#EDF2FF] focus-visible:ring-[#E8EDFE] focus-visible:shadow-sm focus-visible:ring-offset-0"
          id={password}
          type="password"
          defaultValue={password.toString()}
        />
      </div>
      <div className="flex gap-2 items-center">
        <Label htmlFor={password}>Причастен к организациям:</Label>
        {shouldDisplayOrgList && userOrgs.map(({id}) => {
          return (
            <Badge variant="secondary" key={id}>
              <p>{orgs.find(orgItem => orgItem.id === id)?.name}</p>
            </Badge>
          )
        })}
      </div>
      <Button disabled={!isAdmin} onClick={handleAddOrganization}>
        Добавить к организации
      </Button>
    </div>
  )
}