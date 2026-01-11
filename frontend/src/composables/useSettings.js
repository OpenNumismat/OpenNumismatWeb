import { useLocalStorage } from "@vueuse/core";

export const imagePresentation = useLocalStorage('image-presentation', 'image')
export const statusPresentation = useLocalStorage('status-presentation', 'full')
export const currentTheme = useLocalStorage('theme', 'light')
