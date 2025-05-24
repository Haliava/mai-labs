import { useEffect } from "react";

import OrgList from "@/widgets/orgList";
import { columns } from "@/widgets/orgList/columns";
import { useOrgStore } from "@/shared/store/orgStore";
import { useGetOrgs } from "@/entities/organization/hooks";
import { Button } from "@/shared/ui";
import { useModalStore } from "@/shared/store/modalStore";
import { MODALS } from "@/shared/const/ui";

export const OrganizationPage = () => {
  const {orgs, setOrgs} = useOrgStore();
  const {data, isLoading} = useGetOrgs();
  const {openModal} = useModalStore();
  console.log(orgs)

  const handleAddOrg = () => {
    openModal({
      name: MODALS.ADD_COMPANY,
      props: {}
    })
  }

  useEffect(() => {
    if (isLoading || !data) {
      return
    }

    setOrgs(data)
  }, [isLoading])
  // backend

  return (
    <div className="m-auto sm:w-[99vmin] md:w-[90vmin] lg:w-[70wmin] sm:mt-2 md:mt-10 lg: mt-20 flex flex-col gap-5">
      {orgs && <OrgList columns={columns} data={orgs} />}
      <Button variant="secondary" onClick={handleAddOrg}>
        <p>Добавить организацию</p>
      </Button>
    </div>
  );
}
