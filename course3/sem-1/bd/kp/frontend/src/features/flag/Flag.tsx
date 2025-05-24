import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { MODALS, flagStatusToColorMap } from "@/shared/const/ui";
import { PERMISSIONS, ROLES } from "@/shared/types/model/permission";
import { Pen, Trash } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/shared/ui/button";
import { ButtonLabel } from "@/shared/ui/buttonLabel";
import { DeleteFlagModalProps } from "@/widgets/modals/deleteFlagModal/DeleteFlagModal";
import { EditFlagModalProps } from "@/widgets/modals/editFlagModal/EditFlagModal";
import { Flag as TFlag } from "@/shared/types/model/flag";
import { useModalStore } from "@/shared/store/modalStore";
import { useUserStore } from "@/shared/store/userStore";

export type FlagProps = {
  item: TFlag
}
 
export const Flag = ({item}: FlagProps) => {
  const {description, id, name, organizationId, status} = item;
  const {user, userPermissions} = useUserStore();
  const [showControlElements, setShowControlElements] = useState(false);
  const {openModal} = useModalStore();
  const hasEditPermission = useMemo(() => (
    user.role === ROLES.ADMIN || userPermissions.find(perm => perm.organizationId === organizationId)?.permissions.includes(PERMISSIONS.ALL)
  ), [user.role, userPermissions, organizationId])
  const hasDeletePermission = useMemo(() => (
    user.role === ROLES.ADMIN || userPermissions.find(perm => perm.organizationId === organizationId)?.permissions.includes(PERMISSIONS.ALL)
  ), [user.role, userPermissions, organizationId])

  const handleMouseEnter = () => {
    setShowControlElements(true);
  }

  const handleMouseLeave = () => {
    setShowControlElements(false);
  }

  const handleOpenEditModal = () => {
    openModal({
      name: MODALS.EDIT_FLAG,
      props: {
        flag: item,
      } as EditFlagModalProps
    })
  }

  const handleOpenDeleteModal = () => {
    openModal({
      name: MODALS.DELETE_FLAG,
      props: {
        flag: item,
      } as DeleteFlagModalProps
    })
  }

  // useEffect(() => {
  //   if (organizationId) {
  //     notificationService.subscribeToOrg(organizationId);
  //   }

  //   return () => {
  //     if (organizationId) {
  //       notificationService.unsubscribeFromOrg(organizationId);
  //     }
  //   };
  // }, [organizationId]);

  return (
    <Card className="[&_*]:glow:bg-[#EDFFF9] relative grid grid-rows-[1fr min-content min-content] w-full h-full bg-[] shadow-lg shadow-[#EDFFF9] border-none" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <CardHeader>
        <CardTitle className="flex justify-between gap-2">
          <h3 className="block">{name}</h3>
          <h3 className="block">{`#${id}`}</h3>
        </CardTitle>
        <CardDescription>
          <p>{description}</p>
          <div className={`bg-transparent bottom-[20%] left-[2.5vmin] flex gap-5 transition-all absolute opacity-${showControlElements ? '100' : '0'} ${showControlElements ? 'z-10' : '-z-50'}`}>
            <Button className={`${hasEditPermission ? '': 'hidden'} bg-[#EDF2FF] hover:bg-[#E8EDFE] w-24 h-24 p-0`} onClick={handleOpenEditModal}>
              <Pen className="bg-transparent w-24 h-24" />
            </Button>
            <Button className={`${hasDeletePermission ? '': 'hidden'} bg-[#FFEDF3] hover:bg-[#FCE1E0] w-24 h-24`} onClick={handleOpenDeleteModal}>
              <Trash className="bg-transparent w-52 h-52" />
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
      </CardContent>
      <CardFooter>
        <ButtonLabel color={flagStatusToColorMap[Number(status)]}>
          <p className={`${status ? 'text-green-300' : 'text-red-300'} text-2xl uppercase`}>{status ? 'Активен': 'Не активен'}</p>
        </ButtonLabel>
      </CardFooter>
    </Card>
  );
}
