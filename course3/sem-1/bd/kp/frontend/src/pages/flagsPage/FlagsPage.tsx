import FlagList from "@/widgets/flagList"
import { useFlagStore } from "@/shared/store/flagStore"
import { Tabs } from "@/shared/ui"
import { useOrgStore } from "@/shared/store/orgStore"
import { TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { useEffect } from "react"
import { useGetOrgs, useGetUserOrgs } from "@/entities/organization/hooks"
import { useGetFlagsByOrgId } from "@/entities/flag/hooks"
import { useUserStore } from "@/shared/store/userStore"

export const FlagsPage = () => {
  const {user} = useUserStore();
  const {flags, setFlags} = useFlagStore();
  const {orgs, setOrgs, currentOrg, setCurrentOrg} = useOrgStore();
  const {data: userOrgs, isLoading: areUserOrgsLoading} = useGetUserOrgs((user!).id)
  const {data, isLoading} = useGetOrgs();
  const {flags: orgFlags, isLoading: areFlagsLoading} = useGetFlagsByOrgId(currentOrg.id);

  useEffect(() => {
    if (isLoading || !data) {
      return
    }

    setOrgs(data)
  }, [data, isLoading, setOrgs])

  useEffect(() => {
    if (!areFlagsLoading) {
      setFlags(orgFlags)
    }
  }, [areFlagsLoading, orgFlags, setFlags])

  const handleChangeTab = (orgId: number) => {
    const foundOrg = orgs?.find(org => org.id === orgId);

    if (foundOrg) {
      setCurrentOrg(foundOrg);
    }
  }

  return (
    <div className="lg:w-[90vmin] m-auto md:w-[95vmin]">
      {!areUserOrgsLoading && userOrgs && (
        <Tabs>
          <TabsList className="flex justify-between mt-5 mb-10">
            {userOrgs.map(org => (
              <TabsTrigger className="flex-1" key={org.id} value={String(org.id)} onClick={() => handleChangeTab(org.id)}>
                {org.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {userOrgs.map(org => (
            <TabsContent key={org.id} value={String(org.id)}>
              <FlagList flags={flags} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}