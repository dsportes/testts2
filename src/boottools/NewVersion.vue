  <!-- Information / option d'installation d'une nouvelle version -->
<template>
  <q-dialog v-model="boot.newVersionDialog" persistent>
    <q-card class="pwsm">
      <q-toolbar class="tbp">
        <q-btn icon="close" flat size="md" color="warning" padding="none"
          :label="$t('later')"
          @click="boot.newVersionDialog = false"/>
        <q-toolbar-title class="font-title fs-md">{{$t('NEWV_tit1')}}</q-toolbar-title>
      </q-toolbar>

      <div class="q-pa-sm">
        <div class="titre-md q-my-md">{{$t('NEWV_tit2')}}</div>
        <div class="row q-my-sm justify-between items-center">
          <div class="titre-md text-bold">{{$t('NEWV_opt1')}}</div>
          <q-btn icon="system_update" flat color="primary"  padding="none"
            :label="$t('clickhere')" @click="reloadPage"/>
        </div>
        <div class="row q-my-sm justify-between items-start">
          <div class="col titre-md q-my-sm text-italic">{{$t('NEWV_opt2')}}</div>
          <q-btn class="col-auto q-ml-sm" flat icon="close"  padding="none"
            color="primary" :label="$t('gotit')" @click="boot.newVersionDialog = false"/>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts" vapor>
import { inject } from 'vue'
import { reloadPage } from './util'
import Stores from '../stores/all'

const $t = inject('$t') as Function
const boot = Stores.boot

</script>

<style lang="scss" scoped>
@use '../css/app';
</style>