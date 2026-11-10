<template>
  <home-page/>
</template>

<script setup lang="ts" vapor>
import { ref, type Ref, inject } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import Stores from './stores/all'
import HomePage from './components/HomePage.vue'
import { test } from './src-fw/registry'
import { setup } from './boottools/util'

const appConfig: Ref<any> = ref(inject('appConfig'))
const i18n = useI18n()
const $q = useQuasar()
const $t = i18n.t

const boot = Stores.boot
boot.init(i18n, $q)
setup(boot, $t, appConfig)

console.log($t('hello'), $t('world'))

test()

</script>

<style lang="scss" scoped>
@use './css/app';

</style>