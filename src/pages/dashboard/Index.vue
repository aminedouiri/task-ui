<template>
  <div class="w-full flex justify-center h-full mt-20 mb-20 items-center" v-if="showPage">
    <div class="w-[95%] lg:w-[90%]">
      <q-table title="Utilisateurs" :rows="tasks" :columns="columns" row-key="id" separator="cell" :rows-per-page-options="[0]"
        :pagination="paginationOptions" :loading="isLoadingTable">
        <template v-slot:top>
            <div class="w-full flex justify-center">
              <q-btn color="primary" icon="add" no-caps size="md" dense @click="handleShowModalTask(null)" class="w-fit h-fit">
                <q-tooltip class="text-sm" :offset="[5, 5]"> Add new task </q-tooltip>
              </q-btn>
              <p class="text-base self-center flex flex-1 justify-center">Tasks</p>
              <q-input v-model="search" placeholder="Search..." dense outlined label-color="black" class="w-[30%] lg:w-[25%]" :loading="isLoadingSearch"
                :debounce="500" />
            </div>
        </template>
        <template v-slot:body-cell-action="props">
            <q-td :props="props" class="flex justify-center flex-col">
              <q-btn flat dense icon="edit" color="warning" @click="handleShowModalTask(props.row.id)" :loading="isLoadingEdit[props.row.id]">
                <q-tooltip class="text-sm" :offset="[5, 5]"> Update task </q-tooltip>
              </q-btn>
              <q-btn flat dense icon="delete" color="red" @click="deleteTask(props.row.id)">
                <q-tooltip class="text-sm" :offset="[5, 5]"> Delete task </q-tooltip>
              </q-btn>
            </q-td>
        </template>
        <template v-slot:pagination>
          <div class="flex items-center gap-2 mx-4">
            <label>Lignes par page</label>
            <q-select v-model="pagination.per_page" :options="[10, 15, 25, 50]" outlined dense flat />
          </div>
          <q-pagination v-model="pagination.page" color="black" :min="1" :max="pagination.lastPage" :input="true" />
        </template>
      </q-table>
    </div>
  </div>

  <Modal :show="showAddModalTask" :title="titleModal" @close="showAddModalTask = false">
      <template v-slot:body>
        <q-form @submit.prevent="handleTaskEvent(task.id)" class="px-1 py-1 pl-2 pr-2 m-2 space-y-2">
          <q-input v-model="task.title" label="Title*" maxlength="255" outlined label-color="black"
          :rules="[(val) => (val !== null && val !== '') || 'The title is required.']" />
          <q-input v-model="task.description" label="Description*" maxlength="255" outlined label-color="black" type="textarea" autogrow
          :rules="[(val) => (val !== null && val !== '') || 'The description is required.']" />
          <q-input v-model="task.due_date" label="Email" maxlength="255" outlined type="date" label-color="black"
          :rules="[(val) => (val !== null && val !== '') || 'The Due date is required.']" />
          <div class="flex justify-start border border-gray-500 border-solid items-center p-2 mb-5">
            <p>Task is completed :</p>
            <q-radio v-model="task.completed" val="1" label="Yes" />
            <q-radio v-model="task.completed" val="0" label="Non" />
          </div>
          <div class="flex justify-end mt-2">
            <q-btn type="submit" icon="save" color="green">
              <q-tooltip class="text-sm" :offset="[5, 5]"> Save </q-tooltip>
            </q-btn>
          </div>
        </q-form>
      </template>
  </Modal>

  <q-inner-loading :showing="visible" color="primary" />

</template>

<script setup>
import { onBeforeMount, ref, reactive, watch, onMounted } from "vue";
import Modal from 'src/components/Modal.vue';
import { api } from "src/boot/axios";
import { LocalStorage, useQuasar } from "quasar";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from "src/stores/auth";

const tasks = ref([]);
const isLoadingEdit = ref([]);
const showAddModalTask = ref(false);
const visible = ref(false);
const showPage = ref(false);
const $q = useQuasar();
const pagination = reactive({
      per_page: 10,
      page: 1,
      lastPage: 1
});
const paginationOptions = ref({ page: pagination.page , per_page: pagination.per_page});
const task = reactive({
      id: '',
      title: '',
      description: '',
      completed: 0,
      status: '',
      due_date: '',
});
const initialTask = { ...task };
const handleAdd = ref(false);
const titleModal = ref('');
const search = ref('');
const isLoadingSearch = ref(false);
const isLoadingTable = ref(false);
const authStore = useAuthStore();
const user = LocalStorage.getItem('user');

const columns = [
  { name: 'action', label: 'Action', align: 'center'},
  { name: 'title', label: 'Title', field: (row) => row.title, align: 'center', sortable: true },
  { name: 'description', label: 'Description', field: (row) => row.description, align: 'center', sortable: true },
  { name: 'completed', label: 'Completed', field: (row) => row.completed, align: 'center', sortable: true },
  { name: 'due_date', label: 'Due Date', field: (row) => row.due_date, align: 'center', sortable: true },
];

const fetchTasks = async (beforeMount = false, loading = false) => {
  if(loading == true) { visible.value = true; }
  await api.get('/api/v1/tasks', {params: {page: pagination.page, per_page: pagination.per_page, lastPage: pagination.lastPage, search: search.value}})
          .then(res => {
            const data = res.data.data;
            tasks.value = data.tasks;
            const pag = data.pagination;
            Object.assign(pagination, pag);
            if(beforeMount === true) showPage.value = true;
          })
          .catch(err => {
            console.error('error :', err);
          });
  if(loading == true) { visible.value = false; }
};


const handleShowModalTask = async (id = null) => {
  if(id == null) {
    titleModal.value = 'Add a task';
    handleAdd.value = true;
    Object.assign(task, initialTask);
    showAddModalTask.value = true;
  }
  else {
    titleModal.value = `Update task n°: ${id}`;
    handleAdd.value = false;
    isLoadingEdit.value[id] = true;
    await api.get(`/api/v1/tasks/${id}`)
          .then(res => {
            const data = res.data.data;
            Object.assign(task, data);
            isLoadingEdit.value[id] = false;
            showAddModalTask.value = true;
          })
          .catch(err => {
            console.error('err ', err);
          })
  }
};

const handleTaskEvent = async (id) => {
  showAddModalTask.value = false;
  isLoadingTable.value = true
  if(handleAdd.value == true) {
    await api.post('/api/v1/tasks', task)
          .then(res => {
            fetchTasks();
          })
          .catch(err => {
            console.error('err :', err);
          });
  }
  else {
    await api.put(`/api/v1/tasks/${id}`, task)
            .then(res => {
              fetchTasks();
            })
            .catch(err => {
              console.error('err ', err);
            });
  }
  fetchTasks(false);
  isLoadingTable.value = false
}

const deleteTask = (id) => {
  $q.dialog({
        title: 'Confirmation',
        message: 'Would you like to delete this task?',
        cancel: true,
        persistent: true
      }).onOk(() => {
         deleteTaskFromDB(id);
         fetchTasks(false);
      });

};

const deleteTaskFromDB = async (id) => {
  await api.delete(`/api/v1/tasks/${id}`)
          .then(res => {
            fetchTasks()
          })
          .catch(err => {
            console.error('err ', err);
          });
}

watch(pagination, async() => {
    isLoadingTable.value = true;
    await fetchTasks(true);
    isLoadingTable.value = false;
});

onBeforeMount(async () => {
  fetchTasks(true, true);
});


watch(() => search.value, async() => {
  isLoadingSearch.value = true;
  await fetchTasks(false);
  isLoadingSearch.value = false;
});

window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'local',
    cluster: 'mt1',
    encrypted: true,
    wsHost: 'localhost',
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    authEndpoint : 'http://localhost:8000/api/v1/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    }
});

onMounted(() => {
  window.Echo.private(`tasks.${user.id}`).listen('TaskCreatedEvent', (e) => {
    $q.notify({
          message: `${e.message} title : ${e.task.title}`,
          timeout: '2000',
          'position': 'top-left',
          color: 'green',
          icon:'check'
        })
  })
  window.Echo.private(`tasks.${user.id}`).listen('TaskUpdatedEvent', (e) => {
    $q.notify({
          message: `${e.message} title : ${e.task.title}`,
          timeout: '2000',
          'position': 'top-left',
          color: 'green',
          icon: 'check'
        })
  })

  window.Echo.private(`tasks.${user.id}`).listen('TaskDeletedEvent', (e) => {
    $q.notify({
          message: `${e.message} title : ${e.task.title}`,
          timeout: '2000',
          'position': 'top-left',
          color: 'green',
          icon: 'check'
        })
  })

});

</script>
