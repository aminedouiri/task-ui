import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/auth'
import axios from 'axios'
import { LocalStorage} from 'quasar';
import { useRouter } from 'vue-router';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
 })


export default boot(({ app }) => {
  const router = useRouter()
  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api

  api.interceptors.request.use(
    async (config) => {
      const authStore = useAuthStore();
      const token = authStore.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401 && error.response.data.message === 'Unauthenticated.') {
        LocalStorage.clear()
        router.push('/login');
      }

      return Promise.reject(error);
    }
  );

})

export { api }
