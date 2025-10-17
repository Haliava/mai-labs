import { getRecommendedProducts } from "../api/product";
import { useUserStore } from "../store/userStore";
import { useQuery } from '@tanstack/react-query';
import { generateProductFromId } from "../utils/generateProductFromId";

export const useProducts = (productCount = 5) => {
  const {user} = useUserStore();
  const {data, isPending, refetch} = useQuery({
    queryKey: ['products'],
    queryFn: () => getRecommendedProducts(user!.jwt, productCount)
      .then(ids => ids.map(id => generateProductFromId(id)))
      .catch(() => {
        localStorage.clear();
        window.location.reload();
      }),
    enabled: Boolean(user?.jwt),
  })

  return {
    data, isPending, getProducts: refetch,
  }
}