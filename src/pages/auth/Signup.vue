<template>
  <div class="bg-login w-full h-full flex justify-center items-center bg-no-repeat bg-cover bg-[#ddd]">
    <div
      class="card bg-white w-[350px] md:w-[400px] lg:w-[450px] xl:w-[450px] h-[390px] shadow-2xl fixed inset-x-0 inset-y-0 m-auto mt-10 rounded-md">

      <div class="w-4/5 h-1/5 flex m-2 justify-center">
        <h1 class="w-3/5 md:4/5 lg:w-1/2 flex justify-center items-center  text-xl lg:text-2xl 3xl:text-3xl font-meduim">
          Cree un compte
        </h1>
      </div>

      <q-form @submit.prevent="signup" class="bg-white rounded px-8 pb-8 mb-4">
        <p class="text-base text-red-500">{{ error }}</p>
        <div class="mb-2">
          <q-input class="w-full" color="blue-5" label="Name" maxlength="255" v-model="credentials.name"
            lazy-rules :input-style="{ 'font-size': '17px' }"
            :rules="[(val) => (val && val.length > 0) || 'Remplir le name']">
            <template v-slot:prepend>
              <q-icon name="account_box" />
            </template>
          </q-input>
        </div>
        <div class="mb-2">
          <q-input class="w-full" color="blue-5" label="Email" maxlength="255" v-model="credentials.email"
            lazy-rules :input-style="{ 'font-size': '17px' }"
            :rules="[(val) => (val && val.length > 0) || 'Remplir l\'email']">
            <template v-slot:prepend>
              <q-icon name="account_box" />
            </template>
          </q-input>
        </div>
        <div class="mb-2">
          <q-input class="w-full" color="blue-5" :type="isPwd ? 'password' : 'text'" label="Mot de passe" maxlength="255"
            v-model="credentials.password" lazy-rules :input-style="{ 'font-size': '17px' }"
            :rules="[(val) => (val && val.length > 0) || 'Remplir le mot de passe']">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>
        <div class="mb-2">
          <q-input class="w-full" color="blue-5" :type="isPwd ? 'password' : 'text'" label="Mot de passe confirmation" maxlength="255"
            v-model="credentials.password_confirmation" lazy-rules :input-style="{ 'font-size': '17px' }"
            :rules="[(val) => (val && val.length > 0) || 'Remplir le mot de passe confirmation']">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>
        <div class="flex items-center justify-between mt-7 mb-2">
          <q-btn
            class="text-gray bg-blue-100 hover:text-white hover:bg-blue-500 py-2 px-4 rounded focus:outline-none focus:shadow-outline loading text-md"
            type="submit" :loading="isLoading">
            S'inscrire
          </q-btn>
        </div>
        <q-separator color="blue" />
        <div class="flex items-center justify-center mt-2">
          <p class="mr-2">Vous avez un compte ? </p>
          <a class="inline-block align-baseline font-bold text-md text-gray hover:text-blue-500" href="/login">
            Se connecter
          </a>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useQuasar } from 'quasar';
import { api } from "src/boot/axios";

const credentials = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});
const isPwd = ref(true);
const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);
const $q = useQuasar()
const error = ref('')

const signup = async () => {
    isLoading.value = true;
    api.post('api/v1/singup', credentials).then(res => {
      $q.notify({
          message: `The user has been created`,
          timeout: '1000',
          'position': 'top',
          color: 'green',
          icon: 'check'
        })
      router.push('/login')

    }).catch(err => {
      console.error(e);
    })
};


</script>
