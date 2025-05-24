import { ColumnDef } from "@tanstack/react-table"
import { LogEntry } from "@/shared/types/model/log";

export const columns: ColumnDef<LogEntry>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'user_id',
    header: 'Id пользователя',
  },
  {
    accessorKey: 'feature_flag_id',
    header: 'Id флага',
  },
  {
    accessorKey: 'action',
    header: 'Действие',
  },
  {
    accessorKey: 'timestamp',
    header: 'Дата',
  },
]
