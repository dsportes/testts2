<template>
  <div class="row items-center justify-between q-pa-sm">
    <q-btn color="negative" padding="none" size="md" icon="close" @click="coolBye"/>
    <div>{{ $t('hello') + ' ' + $t('world') + ' - ' + appConfig.APPNAME + ' / ' + appConfig.BUILD}}</div>
  </div>

  <img alt="Vue logo" src="../assets/img/anonymous-w.svg" width="32" height="32" />
  <div class="font-title">Bonjour !</div>
  <div class="font-mono selx btn" @click="resetDh">{{ dx.subClass('roman').name + ' ' + dhs }}</div>

  <q-btn class="q-ma-sm primary" flat dense text-color="white" 
    :label="darkClear" @click="swDark"/>

  <q-select class="q-ma-sm" filled dense style="width:200px"
    v-model="locOpt" :options="boot.langOptions" :label="$t('lang')" map-options/>

  <q-btn class="q-ma-sm primary" flat dense text-color="white" 
    label="Show Notification" @click="showNotif"/>

</template>

<script setup lang="ts" vapor>
import { inject } from 'vue'
import Stores from '../stores/all'
import { type LangOption } from '../bootstuff/store'
import { coolBye } from '../bootstuff/util'

import { dx } from '../src-fw/registry'
import { ref, type Ref, computed, watch } from 'vue'

import { showNotification } from '@/my-register-sw'

const appConfig: any = inject('appConfig')
const $t = inject('$t') as Function

const boot = Stores.boot

const locOpt: Ref<LangOption> = ref(boot.curLangOption)
watch(locOpt, (lo) => { boot.setLocale(lo.value) })

const darkClear: Ref<string> = computed(() => $t(boot.isDark ? 'dark' : 'clear'))
const swDark = () => { boot.setDark(!boot.isDark) }

const dh: Ref<number> = ref(0)
const dhs: Ref<string> = computed(() => new Date(dh.value).toISOString())

const resetDh = () => { dh.value = Date.now() }

const showNotif = async () => {
  const href = window.location.href
  await showNotification('My fair notification', { body: 'coucou', data: { url: href }})
}

resetDh()

</script>

<style lang="scss" scoped>
@use '../css/app';
.selx:hover { background-color: $secondary; color: black }
.selx { cursor:pointer !important; background-color: var(--q-primary); }
.btn { border:1px solid black; padding: 2px; }
.primary { background-color: var(--q-primary);}
</style>