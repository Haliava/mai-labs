import { useMutation, useQuery } from "@tanstack/react-query"
import {
  addUserToOrganization,
  createOrganization,
  deleteOrganization,
  editOrganization,
  getEmployeesByOrgId,
  getOrganizations,
  getOrgSettings,
  getUserOrgs,
  removeUserFromOrganization,
  updateOrgSettings
} from "./api"
import { Organization, Setting } from "@/shared/types/model/organization"
import { useEffect, useState } from "react"
import { useOrgStore } from "@/shared/store/orgStore"

export const useGetOrgs = () => {
  const {setOrgs} = useOrgStore()
  const {data, isLoading} = useQuery({
    queryKey: ['orgs'],
    queryFn: () => getOrganizations()
  })

  useEffect(() => {
    if (!isLoading && data) {
      setOrgs(data)
    }
  }, [data, isLoading, setOrgs])

  return {
    data, isLoading,
  }
}

export const useAddOrg = () => {
  const {setOrgs} = useOrgStore();
  const {data, isPending, mutate} = useMutation({
    mutationKey: ['orgs'],
    mutationFn: (org: Organization) => createOrganization(org),
    onSuccess: () => {
      getOrganizations().then(res => setOrgs(res))
    }
  })

  return {
    data, isPending, mutate
  }
}

export const useAddUserToOrg = () => {
  const {data, isPending, mutate} = useMutation({
    mutationKey: ['orgs'],
    mutationFn: ({orgId, userId}: {orgId: number, userId: number}) => addUserToOrganization(orgId, userId),
    onSuccess: () => {

    }
  })
  
  return {
    data, isPending, mutate,
  }
}

export const useGetEmployeesByOrgId = (id: number) => {
  const {data, isLoading} = useQuery({
    queryKey: ['orgs', id],
    queryFn: () => getEmployeesByOrgId(id),
  })
  return {
    data, isLoading
  }
}

export const useGetUserOrgs = (id: number) => {
  const {orgs} = useOrgStore();
  const {data, isLoading} = useQuery({
    queryKey: ['user-orgs', orgs],
    queryFn: () => getUserOrgs(id),
  })
  return {
    data, isLoading
  }
}

export const useDeleteOrg = () => {
  const {data, isPending, mutate} = useMutation({
    mutationKey: ['orgs'],
    mutationFn: (orgId: number) => deleteOrganization(orgId),
  })
  return {
    data, isPending, mutate,
  }
}

export const useGetSettingsByOrgId = (id: number) => {
  const {data, isLoading} = useQuery({
    queryKey: ['org-settings', id],
    queryFn: () => getOrgSettings(id),
  })
  return {
    data, isLoading
  }
}

type TUseEditOrgDataMutationFnProps = {
  org?: Organization,
  settings?: Setting[],
  employees?: number[],
}
export const useEditOrgData = (orgId: number) => {
  const {setOrgs} = useOrgStore();
  const [hasErrors, setHasErrors] = useState(false)
  const {mutate, isPending} = useMutation({
    mutationKey: ['orgs'],
    mutationFn: async ({employees, org, settings}: TUseEditOrgDataMutationFnProps) => {
      if (org) {
        editOrganization(org);
      }

      if (employees) {
        const currentEmployeesIds = await getEmployeesByOrgId(orgId);
        for (let i = 0; i < currentEmployeesIds.length; i++) {
          if (!employees.includes(currentEmployeesIds[i])) {
            removeUserFromOrganization(orgId, currentEmployeesIds[i])
          }

          if (!currentEmployeesIds.includes(employees[i])) {
            addUserToOrganization(orgId, employees[i])
          }
        }
      }

      if (settings) {
        console.log(settings)
        updateOrgSettings(orgId, settings)
      }
    },
    onError: () => {
      setHasErrors(true)
    },
    onSuccess: () => {
      setHasErrors(false)
      getOrganizations().then(res => setOrgs(res))
    },
  })

  // useEffect(() => {

  // }, [])

  return {
    hasErrors, mutate, isPending
  }
}
