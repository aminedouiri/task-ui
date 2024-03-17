<template>
  <q-layout view="lHh Lpr lff">
    <!------------------------------------------------------------------------------------------ header  ------------------------------------------------------------------------------------>
    <q-header elevated class="header_normal text-white">
      <q-toolbar>
        <div class=" w-full flex " >

      </div>
        <q-space />
        <q-btn
          round
          dense
          flat
          color="white"
          class="mr-8"
          icon="notifications"
        >
          <q-badge color="red" text-color="white" floating size="20px">5</q-badge>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-card class="text-center no-shadow no-border">
                <q-btn
                  label="View All"
                  style="max-width: 120px !important"
                  flat
                  dense
                  class="text-indigo-8"
                ></q-btn>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn flat rounded icon="account_circle" size="20px"   class="mr-8">
          <q-menu class="min-w-min"  style="width: 230px;">
            <div class="column no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="../assets/user.png" />
                </q-avatar>

                <div class="text-base q-mt-md q-mb-xs text-black">{{ nomPrenom }}</div>
              </div>

              <q-separator class="q-my-md" />
              <q-btn
              class="bg-primary-800 font-black  text-black bg-blue-100"
                icon="logout"
                label="Logout"
                push
                size="12px"
                v-close-popup
                @click="logout"
              />
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "src/stores/auth";
import { useRouter } from "vue-router";
import { LocalStorage } from "quasar";

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
    let res = await authStore.logout();
    if(res === true)
    router.push('/login')
}

const typeCompte = ref('');
const nomPrenom = ref('');
const user = LocalStorage.getItem('user');
nomPrenom.value = user.name

</script>

<style>
  .header_dark {
    background: linear-gradient(145deg, rgb(61, 14, 42) 15%, rgb(14, 43, 78) 70%);
  }
  .logo {
    max-height: 60px;
  }

  .tab-active {
    background-color: rgb(12, 73, 130);
  }

  .q-item-hoverable:hover {

    background-color: rgb(12, 73, 130)S;
    color: #00A9FF;
  font-size: larger;
  }

  .q-item-hoverable2:hover {

  background-color: rgb(12, 73, 130)S;
  color: #00A9FF;
  }
</style>
