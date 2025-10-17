import ProductCard from "@/features/productCard";
import { useProducts } from "@/shared/hooks/useProducts"
import { useSearchStore } from "@/shared/store/searchStore";
import { Product } from "@/shared/types/entity";
import { Button } from "@/shared/ui/button";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react"

const PRODUCT_COUNT = 100

export const IndexPage = () => {
  const {data, isPending} = useProducts(PRODUCT_COUNT);
  const {query} = useSearchStore()
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!data || isPending) {
      return
    }

    console.log(data)
    setProducts(data);
  }, [isPending])

  const handlePaginationButtonClick = () => {
    setPage(prev => prev + 1)
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(216px,auto))] gap-[4vmin] mb-5">
      {isPending && <Loader className="m-auto animate-spin duration-200" />}
      {products?.filter(product => !query || product.name.toLowerCase().includes(query)).filter((_, i) => i <= page * 10).map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      {!isPending && products?.filter(product => !query || product.name.toLowerCase().includes(query)).length > 0 && (
        <Button className="bg-[#FF9012] min-h-[400px]" onClick={handlePaginationButtonClick}>
          <p className="text-5xl rotate-90">Показать ещё</p>
        </Button>
      )}
      {!isPending && products?.filter(product => !query || product.name.toLowerCase().includes(query)).length <= 0 && (
        <p className="text-5xl col-span-full">Ничего не найдено</p>
      )}
    </div>
  )
}