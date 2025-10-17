import { BASE_API_URL } from "../consts/api";

export const getRecommendedProducts = (jwt: string, productCount: number = 5): Promise<number[]> => {
  console.log(jwt)
  return fetch(`${BASE_API_URL}/recommendation?quantity=${productCount}`, {
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
    method: 'GET',
  }).then(res => res.json());
}