import { useQuery } from "@tanstack/react-query"
import { getLogs } from "./api"
import { useEffect, useState } from "react"
import { LogEntry } from "@/shared/types/model/log"

export const useLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>()
  const {data, isLoading} = useQuery({
    queryKey: ['logs'],
    queryFn: () => getLogs(),
  })
  // backend
  useEffect(() => {
    if (isLoading || !data) {
      return
    }

    data.json().then(res => setLogs(res))
  }, [data, isLoading])

  return {
    logs, isLoading,
  }
}