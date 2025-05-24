import dog from '@/shared/assets/dog.jpg';
import { useNavigate } from 'react-router';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-[100vw] h-16 flex justify-center items-center shadow-2xl shadow-[#EDFFF9] rotate-180">
      <img className="h-[75%] rotate-180 cursor-pointer transition-all rounded-none hover:h-[78%]" src={dog} alt="glf-dog" onClick={() => navigate('/')} />
    </div>
  );
}