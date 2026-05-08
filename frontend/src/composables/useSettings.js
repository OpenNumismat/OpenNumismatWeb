import { useLocalStorage } from "@vueuse/core";

export const imagePresentation = useLocalStorage('image-presentation', 'image')
export const statusPresentation = useLocalStorage('status-presentation', 'text_icon')
export const currentTheme = useLocalStorage('theme', 'light')
export const apiKey = useLocalStorage('apiKey', null )
export const serverUrl = useLocalStorage('serverUrl', null )
