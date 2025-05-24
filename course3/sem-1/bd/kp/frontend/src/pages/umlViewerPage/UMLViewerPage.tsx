import ImageViewer from "@/widgets/imageVewer";
import uml from '@/shared/assets/uml.svg';
import { useState } from "react";
import { useNavigate } from "react-router";

export const UMLViewerPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  }

  return (
    <div className="bg-[#1B1B1B]">
      <ImageViewer className="bg-[#1B1B1B]" image={uml} visible={isOpen} onClose={handleClose} />
    </div>
  );
}
