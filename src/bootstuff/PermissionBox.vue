<!-- Boîte d'affichage des permissions du browser 
 et d'erreur d'acquisition du token webpush -->
<template>
<q-dialog v-model="boot.permDialog" persistent>
<q-card class="pwsm">
  <q-toolbar class="tbp">
    <q-toolbar-title v-if="boot.errSubJSON" class="font-title fs-md">{{$t('PERM_err')}}</q-toolbar-title>
    <q-toolbar-title v-else class="font-title fs-md">{{$t('PERM_tit')}}</q-toolbar-title>
  </q-toolbar>

  <div class="q-pa-sm" v-if="boot.errSubJSON">
    <div class="font-title fs-md text-italic q-my-md">{{ $t(('PERM_errdet')) }}</div>
    <div class="font-mono fs-sm q-my-md">{{ boot.errSubJSON }}</div>
  </div>

  <div class="q-pa-sm" v-else>
    <div class="font-title fs-md text-italic q-my-md">{{ $t(('PERM_info1')) }}</div>

    <div class="font-def fs-md q-my-md">{{ $t(('PERM_info2')) }}</div>
  </div>

  <q-btn dense icon="close" flat color="warning" padding="none"
    class="font-mono fs-md"
    :label="$t('PERM_quit' + (boot.errSubJSON ? '3' : '1'))" 
    @click="coolBye"/>

  <q-btn dense icon="refresh" flat color="warning" padding="none"
    class="font-mono fs-md"
    :label="$t('PERM_quit' + (boot.errSubJSON ? '4' : '2'))" 
    @click="reloadPage"/>

</q-card>
</q-dialog>
</template>

<script setup lang="ts" vapor>
import { inject } from 'vue'
import { coolBye, reloadPage } from './util'
import { useBootStore } from './store'

const $t = inject('$t') as Function
const boot = useBootStore()

</script>

<style lang="scss" scoped>
@import '../css/app.scss';
</style>