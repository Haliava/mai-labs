import { API_BASE_URL } from "@/shared/const/envVars"

export const getLogs = () => {
  return fetch(`${API_BASE_URL}/logs/`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'GET',
  })
}