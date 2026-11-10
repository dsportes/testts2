import { ref, type Ref, computed, inject, provide } from 'vue'
import { defineStore } from 'pinia'

import { Lang, setCssVar } from 'quasar'

import { myRegistration, setOnAppUpdate } from '../my-register-sw'

export type LangOption = { value: string, label: string, flag: string, props?: any }

export const useBootStore = defineStore('boot', () => {
  const appConfig:any = inject('appConfig')

  const defLangOption: LangOption = { value: 'en', label: 'English 🇬🇧',  flag: '🇬🇧' }
  const curLangOption: Ref<LangOption> = ref(defLangOption)
  const langOptions: Ref<LangOption[]> = ref(appConfig.LANGOPTIONS)

  let i18n:any, $q:any, $t:Function

  const init = (_i18n: any, _$q: any) => {
    i18n = _i18n
    $t = _i18n.t
    $q = _$q
    provide('i18n', _i18n)
    provide('$q', _$q)
    provide('$t', $t)

    const lo = getLangOption(appConfig.LANG)
    Lang.set(lo.props)
    i18n.locale.value = appConfig.LANG
    curLangOption.value = lo
    $q.dark.set(appConfig.DARK)
    setTheme()
  }

  const isDark: Ref<boolean> = computed(() => $q ? $q.dark.isActive : true)

  const getLangOption = (lang: string) : LangOption => {
    if (lang) for (const x of langOptions.value) if (x.value === lang) return x
    return defLangOption
  }
  
  const setLocale = (lang: string) => {
    if (lang === curLangOption.value.value) return
    for(const lo of langOptions.value) {
      if (lo.value === lang) {
        i18n.locale.value = lang
        curLangOption.value = lo
        Lang.set(lo.props)
      }
    }
  }

  const setDark = (dark: boolean) => {
    const d = isDark.value
    if ((d && dark) || (!d && !dark)) return
    $q.dark.set(dark)
    setTheme()
  }

  const setTheme = () => {
    const d = isDark.value
    const t = appConfig.THEMES as any
    for(const c in t) setCssVar(c, t[c][d ? 0 : 1])
  }

  const newVersionReady = ref(false)
  const newVersionDialog = ref(false)

  const setAppUpdated = () => {
    newVersionReady.value = true
    newVersionDialog.value = true
  }

  setOnAppUpdate(setAppUpdated)

  console.log('Boot configuration done.')

  return {
    // @ts-expect-error
    $t, $q, i18n,
    appConfig,
    init, langOptions, curLangOption, setLocale, isDark, setDark,
    newVersionReady, newVersionDialog,

  }
})