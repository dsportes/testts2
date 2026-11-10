<template>
  <div>{{ $t('hello') + ' ' + $t('world') + ' - ' + appConfig.BUILD}}</div>
  <test-ts />
</template>

<script setup lang="ts" vapor>
import { ref, type Ref, inject, provide } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import Stores from './stores/all'

import { test } from './src-fw/registry'
import TestTs from './components/TestTs.vue'

const appConfig: Ref<any> = ref(inject('appConfig'))
const i18n = useI18n()
const $q = useQuasar()
const $t = i18n.t

const boot = Stores.boot
boot.init(i18n, $q)

// import { ref, type Ref, computed } from 'vue'
console.log($t('hello'), $t('world'))

test()

</script>

<style lang="scss" scoped>
@use './css/app';

</style>