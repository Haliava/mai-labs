import { AccessControls } from "@/shared/types/model/permission";

export const mockAccessControls: AccessControls[] = [
  {id: 1, organization_id: 1, permissions: 'all', user_id: 1},
  {id: 2, organization_id: 1, permissions: 'none', user_id: 2},
  {id: 3, organization_id: 2, permissions: 'all', user_id: 1},
]
