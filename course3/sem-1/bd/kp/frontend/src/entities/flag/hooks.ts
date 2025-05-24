import { Flag } from "@/shared/types/model/flag";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/shared/store/userStore";

import { createFlag, deleteFlag, editFlag, getFlagsByOrgId } from "./api";
import { useEffect, useState } from "react";
import { useFlagStore } from "@/shared/store/flagStore";

export const useGetFlagsByOrgId = (orgId: number) => {
  const {data, isLoading, refetch} = useQuery({
    queryKey: ['flags', orgId],
    queryFn: () => getFlagsByOrgId(orgId),
  });
  const [flags, setFlags] = useState<Flag[]>([])

  useEffect(() => {
    if (!isLoading) {
      data?.json().then(res => {
        setFlags(res);
      })
    }
  }, [data, isLoading])
  // backend
  return {
    flags, isLoading, refetch,
  }
}

export const useAddFlagToOrg = () => {
  const {user} = useUserStore();
  const {data, isPending, mutate} = useMutation({
    mutationFn: (flag: Flag) => createFlag(flag, user!),
  })
  // backend
  return {
    data, mutate, isPending
  }
}

export const useDeleteFlag = () => {
  const {user} = useUserStore();
  const {setFlags} = useFlagStore();
  const {data, isPending, mutate} = useMutation({
    mutationFn: (id: number) => deleteFlag(id, user!),
  })

  useEffect(() => {
    if (!isPending) {
      data?.json().then(res => {
        setFlags(res);
      })
    }
  }, [data, isPending, setFlags])

  // backend
  return {
    data, mutate, isPending
  }
}

export const useEditFlag = () => {
  const {user} = useUserStore();
  const {data, isPending, mutate} = useMutation({
    mutationFn: (flag: Flag) => editFlag(flag, user!),
  })

  return {
    data, mutate, isPending
  }
}