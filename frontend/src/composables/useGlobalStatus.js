import {computed, ref} from "vue";

export function useGlobalStatus() {
  const isLoading = ref(false);
  const status = ref(null);

  const error = ref(null);
  const hasError = computed({
    get: () => !!error.value,
    set: (value) => {
      if (!value) error.value = null;
    }
  });

  const warning = ref(null);
  const hasWarning = computed({
    get: () => !!warning.value,
    set: (value) => {
      if (!value) warning.value = null;
    }
  });

  const startLoading = async (new_status = null) => {
    error.value = null;
    status.value = new_status;
    isLoading.value = true;
  }

  const finishLoading = async () => {
    isLoading.value = false;
  }

  const clear = async () => {
    isLoading.value = false;
    status.value = null;
    error.value = null;
    warning.value = null;
  }

  return {
    startLoading,
    finishLoading,
    clear,
    hasError,
    hasWarning,
    isLoading,
    status,
    error,
    warning,
  }
}
