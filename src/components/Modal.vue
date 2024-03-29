<template>
  <teleport to="body">
    <transition leave-active-class="duration-200">

      <div v-if="show" class="flex justify-center items-center fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50 " scroll-region>
        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div v-if="show" class="fixed inset-0 transform transition-all" @click="close">
            <div class="absolute inset-0 bg-black/50" />
          </div>
        </transition>
        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div v-if="show" class=" my-6 bg-white h-fit w-full rounded-lg overflow-auto shadow-xl transform transition-all sm:w-full mx-auto " :class="maxWidthClass">
            <div class="flex w-full my-4 pb-2 border-b ">
              <label class="mx-4 text-xl">
                {{ props.title }}
              </label>
              <div @click="close" class="fixed p-1 right-4 cursor-pointer hover:bg-gray-400 hover:bg-opacity-25 hover:rounded-full">
                <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div class="flex flex-col mx-4 my-4 ">
              <div class="overflow-auto " :style="{ 'max-height': $q.screen.height * 0.95 + 'px' }">
                <slot v-if="$slots.body" name="body" />
              </div>

            </div>
          </div>
        </transition>
      </div>



    </transition>
  </teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useQuasar } from "quasar";
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  minWidth: {
    type: String,
    default: 'lg',
  },
  maxWidth: {
    type: String,
    default: '2xl',
  },
  closeable: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'Title'
  },
});
const emits = defineEmits([
  'close',
]);
watch(
  () => props.show,
  () => {
    if (props.show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = null;
    }
  }
);

const close = () => {
  if (props.closeable) {
    emits('close');
  }
};

const closeOnEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    close();
  }
};

const $q = useQuasar()
onMounted(() => {
  document.addEventListener('keydown', closeOnEscape)
});

onUnmounted(() => {
  document.removeEventListener('keydown', closeOnEscape);
  document.body.style.overflow = null;
});

const sizes = reactive({
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  '6xl': 'sm:max-w-6xl',
  '7xl': 'sm:max-w-7xl',
})

const maxWidthClass = computed(() => {
  return sizes[props.maxWidth];
});
const minWidthClass = computed(() => {
  return sizes[props.minWidth];
});

</script>
