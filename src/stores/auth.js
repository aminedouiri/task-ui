import { defineStore } from 'pinia';
import {api} from "boot/axios";
import { LocalStorage } from "quasar";

export const useAuthStore = defineStore('Auth', {

  state: () => ({
    token: LocalStorage.getItem('token'),
    user: LocalStorage.getItem('user')
  }),
  getters: {
    getToken: (state) => state.token
  },
  actions: {
    async login(credentials){
      let result = '';
      await api
        .post('/api/v1/login', {
          email: credentials.email,
          password: credentials.password,
        }
        )
        .then(async (res) => {
            this.token = res.data.data.token
            LocalStorage.set('token', this.token)
            await this.getUser();
            result = 'connected';
        })
        .catch(err => {
          console.error(err);
          if(err.message == 'Network Error')
            result = 'Network Error!';
          else
            result = err.response.data.message;

        });
        return result;
    },
    async getUser(){
      await api
        .get('/api/v1/user')
        .then((res) => {
          this.user = res.data.data
          LocalStorage.set('user', this.user)
        })
        .catch(err => {
          console.error(err)
        })
    },
    async logout(){
      let result = false;
      await api
            .post('/api/v1/logout')
            .then(res => {
              result = true;
              this.setProperty('token');
              this.setProperty('user');
              LocalStorage.clear();
            })
            .catch(err => console.error(err));

      return result;
    },
    setProperty(key, val){
      this[key] = val
      if(val)
        LocalStorage.set(key, val)
      else
        LocalStorage.remove(key)
    }
  },
});
