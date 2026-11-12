import { ref, type Ref, computed, inject, watch } from 'vue'
import { defineStore } from 'pinia'

import { Lang, setCssVar } from 'quasar'

import { declareBootStore, setRegistration } from '../my-register-sw'

import { keyFromB64, fromUrl } from './util'

export type LangOption = { value: string, label: string, flag: string, props?: any }

export const useBootStore = defineStore('boot', () => {
  const appConfig:any = inject('appConfig')
  // const webpushkey: Ref<BufferSource | undefined> = ref(new Uint8Array([]) as BufferSource)
  const webpushkey: Ref<BufferSource | undefined> = ref(appConfig.WEBPUSH ? keyFromB64(fromUrl(appConfig.WEBPUSH)) as BufferSource : undefined)

  const defLangOption: LangOption = { value: 'en', label: 'English 🇬🇧',  flag: '🇬🇧' }
  const curLangOption: Ref<LangOption> = ref(defLangOption)
  const langOptions: Ref<LangOption[]> = ref(appConfig.LANGOPTIONS)

  let i18n:any, $q:any, $t:Function, myself: any

  const init = (_i18n: any, _$q: any) => {
    i18n = _i18n
    $t = _i18n.t
    $q = _$q

    const lo = getLangOption(appConfig.LANG)
    Lang.set(lo.props)
    i18n.locale.value = appConfig.LANG
    curLangOption.value = lo
    $q.dark.set(appConfig.DARK)
    setTheme()
    myself = useBootStore()
    declareBootStore(myself)
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

  const onAppUpdate = () => {
    newVersionReady.value = true
    newVersionDialog.value = true
  }

  const subJSON: Ref<string> = ref('')
  const errSubJSON: Ref<string> = ref('')

  // Gestion des permissions *********************************************
  const hasNet: Ref<boolean> = ref(true)

  const setNet = (_hasNet: boolean) => {
    hasNet.value = _hasNet
    setPermDialog()
  }

  const permState = ref(Notification.permission) // granted denied prompt
  watch(() => Notification.permission, (p) => {
    permState.value = p
    setPermDialog()
  })
  const permDialog: Ref<boolean> = ref(false)
  const setPermDialog = () => {
    permDialog.value = hasNet.value && webpushkey.value && (permState.value !== 'granted' || errSubJSON.value) ? true : false
  }

  const getSubJSON = async () => {
    // @ts-expect-error
    const [_err, _subJSON] = await setRegistration(webpushkey.value)
    errSubJSON.value = !_err ? '' : _subJSON
    subJSON.value = !_err ? _subJSON : ''
    console.log('subJSON: ', subJSON.value || errSubJSON.value)
    setPermDialog()
  }

  if (webpushkey.value) {
    if (hasNet.value) {
      if (permState.value === 'granted') {
        setTimeout(async () => { 
          await getSubJSON() }, 1)
        } 
      } else setPermDialog()
    watch(() => [hasNet.value, permState.value, subJSON.value], async() => {
      if (!errSubJSON.value && !subJSON.value && webpushkey.value)
        await getSubJSON()
    })
  }

  setPermDialog()

  console.log('Boot configuration done.')

  // Hooks de l'application à définir
  const onSwMessage = async (messageData: any)=> {
    console.log(messageData.type)
  }

  const onPushMessage = async (messageData: any)=> {
    console.log(messageData.type)
  }

  return {
    init, langOptions, curLangOption, setLocale, isDark, setDark,
    onAppUpdate, onSwMessage, onPushMessage,
    newVersionReady, newVersionDialog,
    hasNet, setNet, 
    permState, permDialog, errSubJSON, subJSON
  }
})