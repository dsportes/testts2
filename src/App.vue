<template>
  <home-page/>
  <new-version v-if="nv"/>
  <permission-box v-if="pb"/>
</template>

<script setup lang="ts" vapor>
import { inject, provide, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useBootStore } from './bootstuff/store'
import { setup } from './bootstuff/util'
import HomePage from './components/HomePage.vue'
import NewVersion from './bootstuff/NewVersion.vue'
import PermissionBox from './bootstuff/PermissionBox.vue'

import { test } from './src-fw/registry'

const appConfig: any = inject('appConfig')
const i18n = useI18n()
const $q = useQuasar()
const $t = i18n.t

const boot = useBootStore()
boot.init(i18n, $q)
setup(boot, $t, appConfig)

test()

provide('i18n', i18n)
provide('$t', $t)
provide('$q', $q)

const pb = computed(() => boot.permDialog)
const nv = computed(() => boot.newVersionDialog)

</script>

<style lang="scss" scoped>
@use './css/app';

</style>