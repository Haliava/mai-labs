import { MODALS } from "@/shared/const/ui";
import { useModalStore } from "@/shared/store/modalStore";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader } from "@/shared/ui/card";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const AddFlagCard = () => {
  const [showControlElements, setShowControlElements] = useState(false);
  const {openModal} = useModalStore();

  const handleMouseEnter = () => {
    setShowControlElements(true);
  }

  const handleMouseLeave = () => {
    setShowControlElements(false);
  }

  const handleOpenAddModal = () => {
    openModal({
      name: MODALS.ADD_FLAG,
      props: {

      },
    })
  }

  return (
    <Card className="[&_*]:glow:bg-[#EFFFED] relative w-full h-full bg-[] shadow-lg shadow-[#EFFFED] border-none" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <CardHeader className="h-full flex items-center justify-center">
        <h1 className="text-2xl font-extrabold">Добавить новый флаг</h1>
      </CardHeader>
      <div className={`bg-transparent bottom-[20%] left-[30%] flex gap-5 transition-all absolute opacity-${showControlElements ? '100' : '0'} ${showControlElements ? 'z-10' : '-z-50'}`}>
        <Button className={`${showControlElements ? '': 'hidden'} bg-[#EDF2FF] hover:bg-[#E8EDFE] w-24 h-24 p-0`} onClick={handleOpenAddModal}>
          <PlusIcon className="bg-transparent w-24 h-24" />
        </Button>
      </div>
    </Card>
  );
}
