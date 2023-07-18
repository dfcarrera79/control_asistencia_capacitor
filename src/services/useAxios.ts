import { axios } from '../boot/axios';
import { deducirMensajeError } from '../utils/AppUtils';
import { useAuthStore } from '../stores/auth';

export function useAxios() {
  const authStore = useAuthStore();

  const get = async (url: string, params: object) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${authStore.getURLApi}${url}`,
        params,
        headers: authStore.getHttpHeaders,
      });
      return response.data;
    } catch (error) {
      return {
        error: 'S',
        mensaje: deducirMensajeError(error),
        objetos: [],
      };
    }
  };

  const post = async (url: string, params: object, jsonData: object) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${authStore.getURLApi}${url}`,
        params,
        data: jsonData,
        headers: {
          ...authStore.getHttpHeaders,
          'Content-Type': 'application/json', // Set the Content-Type header to specify JSON data
        },
      });
      return response.data;
    } catch (error) {
      return {
        error: 'S',
        mensaje: deducirMensajeError(error),
        objetos: [],
      };
    }
  };

  const put = async (url: string, params: object, jsonData: object) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: `${authStore.getURLApi}${url}`,
        params,
        data: jsonData,
        headers: {
          ...authStore.getHttpHeaders,
          'Content-Type': 'application/json', // Set the Content-Type header to specify JSON data
        },
      });
      return response.data;
    } catch (error) {
      return {
        error: 'S',
        mensaje: deducirMensajeError(error),
        objetos: [],
      };
    }
  };

  return {
    get,
    post,
    put,
  };
}
