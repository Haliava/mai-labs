import { MoreHorizontal } from "lucide-react";

import { Button } from "@/shared/ui";
import { Row } from "@tanstack/react-table";
import { useModalStore } from "@/shared/store/modalStore";
import { Organization } from "@/shared/types/model/organization";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/shared/ui/dropdown-menu";
import { MODALS } from "@/shared/const/ui";

interface ActionsDropdownProps {
  row: Row<Organization>
}
 
export const ActionsDropdown = ({row}: ActionsDropdownProps) => {
  const org = row.original;
  const {openModal} = useModalStore();

  const handleEditButtonClick = () => {
    openModal({
      name: MODALS.EDIT_COMPANY,
      props: {
        org,
      },
    })
  }

  const handleDeleteButtonClick = () => {
    openModal({
      name: MODALS.DELETE_COMPANY,
      props: {
        org,
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Редактировать</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Действия</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleEditButtonClick}>Изменить данные о компании</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteButtonClick}>Удалить компанию</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
