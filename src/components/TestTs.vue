<template>
  <img alt="Vue logo" src="../assets/img/anonymous-w.svg" width="32" height="32" />
  <div class="font-title">Bonjour !</div>
  <div class="font-mono selx btn" @click="resetDh">{{ dx.subClass('roman').name + ' ' + dhs }}</div>

  <q-btn class="q-ma-sm primary" flat dense text-color="white" :label="darkClear" @click="swDark"/>

  <q-select class="q-ma-sm" filled dense style="width:200px"
    v-model="locOpt" :options="localeOptions" :label="$t('lang')" map-options/>

</template>

<script setup lang="ts" vapor>
import Stores from '../stores/all'
import { type LocaleOption, localeOptions, $t } from '../stores/boot-store'

import { dx } from '../src-fw/registry'
import { ref, type Ref, computed, watch } from 'vue'

const boot = Stores.boot

const locOpt: Ref<LocaleOption> = ref(boot.curLocaleOption)

const darkClear: Ref<string> = computed(() => $t(boot.isDark ? 'dark' : 'clear'))
const swDark = () => { boot.setDark(!boot.isDark) }

const dh: Ref<number> = ref(0)
const dhs: Ref<string> = computed(() => new Date(dh.value).toISOString())

const resetDh = () => { dh.value = Date.now() }

resetDh()

watch(locOpt, (lo) => { 
  boot.setLocale(lo.value) })

</script>

<style lang="scss" scoped>
@use '../css/app';
.primary { background-color: var(--q-primary);}
</style>