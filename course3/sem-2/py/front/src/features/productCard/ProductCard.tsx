import { Product } from "@/shared/types/entity"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardFooter } from "@/shared/ui/card"
import phone from '@/shared/assets/images/phone.png';
import { Icon } from "@/shared/ui/icon";
import { useToast } from "@/shared/hooks/useToast";

export type ProductCardProps = {
  product: Product
}

export const ProductCard = ({product}: ProductCardProps) => {
  const {toast} = useToast();
  const {id, name, price, delivery} = product;

  const showToast = () => {
    toast({
      title: 'Продукт добавлен в корзину!'
    })
  }

  return (
    <Card className="flex flex-col relative border-none">
      <CardContent className="flex flex-col p-0">
        <img className="w-full" src={phone} />
        <p className="text-[rgb(36,36,36,.64)] text-[13px]">#{id}</p>
        <div className="flex gap-2 items-center">
          <Icon size={24} icon="flame" />
          <p className="text-[#FF4E4E] text-[22px] font-bold">{price}</p>
          <p className="text-[rgb(36,36,36,.64)] text-[13px]">/</p>
          <p className="text-[rgb(36,36,36,.64)] line-through text-[13px]">{price * 10}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Icon size={24} icon="check" />
          <p className="text-[22px] uppercase line-clamp-1">{name}</p>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <Button className="bg-[#FF9012] w-full flex justify-center items-center rounded-sm" onClick={showToast}>
          <Icon size={18} icon="car" />
          <p className="text-white text-[18px]">{delivery}</p>
        </Button>
      </CardFooter>
    </Card>
  )
}