import { ColumnDef } from "@tanstack/react-table"
import { Organization } from "@/shared/types/model/organization"

import { ActionsDropdown } from "./ActionsDropdown";
import { Button } from "@/shared/ui";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Имя
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: 'actions',
    header: 'Действия',
    id: "actions",
    cell: ({ row }) => {
      return <ActionsDropdown row={row} />
    },
  },
]
