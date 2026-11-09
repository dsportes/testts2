<template>
  <div>{{ $t('hello') + ' ' + $t('world') }}</div>
  <test-ts />
</template>

<script setup lang="ts" vapor>
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import Stores from './stores/all'
import { $t } from './stores/boot-store'

import { test } from './src-fw/registry'
import TestTs from './components/TestTs.vue'

const boot = Stores.boot
boot.init(useI18n(), useQuasar(), true)

// import { ref, type Ref, computed } from 'vue'
console.log($t('hello'), $t('world'))

test()

</script>

<style lang="scss" scoped>
@use './css/app';

</style>