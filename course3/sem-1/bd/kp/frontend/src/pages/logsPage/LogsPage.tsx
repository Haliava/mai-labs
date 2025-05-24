import { useLogs } from "@/entities/log/hooks";
import LogList from "@/widgets/logList";
import { columns } from "@/widgets/logList/columns";

 
export const LogsPage = () => {
  // backend
  const {isLoading, logs} = useLogs();

  return (
    <div className="m-auto sm:w-[99vmin] md:w-[90vmin] lg:w-[70wmin] sm:mt-2 md:mt-10 lg: mt-20">
      {!isLoading && logs && <LogList columns={columns} data={logs} />}
    </div>
  );
}
