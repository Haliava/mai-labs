import { create } from "zustand";

import { mockOrganizations } from "@/mocks/organization";
import { Organization } from "@/shared/types/model/organization";


export type OrgState = {
  orgs: Organization[] | null,
  currentOrg: Organization,
  setCurrentOrg: (org: Organization) => void,
  setOrgs: (orgs: Organization[]) => void,
}
export const useOrgStore = create<OrgState>((set) => ({
  orgs: null,
  currentOrg: mockOrganizations[0],
  setOrgs: (orgs) => set(() => ({
    orgs,
  })),
  setCurrentOrg: (org) => set(() => ({
    currentOrg: org,
  })),
}))