import { ref, type Ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { setCssVar } from 'quasar'
import theme from '../app/theme'

import { Lang } from 'quasar'
import langFr from 'quasar/lang/fr'
// import langDe from 'quasar/lang/de'

export type LocaleOption = { value: string, label: string, flag: string, props?: any }
export let i18n: any
export let $q: any
export let $t: any
export const localeOptions: LocaleOption[] = [
  { value: 'en', label: 'English 🇬🇧',  flag: '🇬🇧' },
  { value: 'fr', label: 'Français 🇫🇷', flag: '🇫🇷', props: langFr }
]

export const useBootStore = defineStore('boot', () => {

  const getLocaleOption = (lang: string) : LocaleOption => {
    if (lang) for (const x of localeOptions) if (x.value === lang) return x
    // @ts-expect-error
    return localeOptions[0]
  }

  // @ts-expect-error
  const curLocaleOption: Ref<LocaleOption> = ref(localeOptions[0])

  const init = (_i18n: any, _q: any, dark: boolean) => {
    i18n = _i18n
    $q = _q
    $t = i18n.t
    curLocaleOption.value = getLocaleOption(i18n.locale.value)
    if (curLocaleOption.value.props) Lang.set(curLocaleOption.value.props)
    $q.dark.set(dark)
    setTheme()
  }
  
  const setLocale = (lang: string) => {
    if (lang === curLocaleOption.value.value) return
    for(const lo of localeOptions) {
      if (lo.value === lang) {
        i18n.locale.value = lang
        curLocaleOption.value = lo
        if (curLocaleOption.value.props) Lang.set(curLocaleOption.value.props)
      }
    }
  }

  const isDark = computed(() => 
    $q.dark.isActive)

  const setDark = (dark: boolean) => {
    const d = isDark.value
    if ((d && dark) || (!d && !dark)) return
    $q.dark.set(dark)
    setTheme()
  }

  const setTheme = () => {
    const d = isDark.value
    const t = theme as any
    for(const c in t) setCssVar(c, t[c][d ? 0 : 1])
  }

  return {
    init, curLocaleOption, getLocaleOption, setLocale, isDark, setDark
  }
})