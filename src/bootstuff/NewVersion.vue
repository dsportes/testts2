  <!-- Information / option d'installation d'une nouvelle version -->
<template>
  <q-dialog v-model="boot.newVersionDialog" persistent>
    <q-card class="pwsm">
      <q-toolbar class="tbp">
        <q-btn icon="close" flat size="md" color="warning" padding="none"
          class="font-mono" :label="$t('later')"
          @click="boot.newVersionDialog = false"/>
        <q-toolbar-title class="font-title fs-md">{{$t('NEWV_tit1')}}</q-toolbar-title>
      </q-toolbar>

      <div class="q-pa-sm">
        <div class="font-title fs-md q-my-md">{{$t('NEWV_tit2')}}</div>
        <div class="column q-my-md items-center">
          <div class="font-title fs-md text-bold">{{$t('NEWV_opt1')}}</div>
          <q-btn class="font-mono fs-md q-mt-sm" icon="system_update" flat color="primary" padding="none"
            :label="$t('clickhere')" @click="reloadPage"/>
        </div>
        <div class="column q-my-md items-center">
          <div class="font-title fs-md q-my-sm text-italic">{{$t('NEWV_opt2')}}</div>
          <q-btn class="font-mono fs-md q-mt-sm" flat icon="close"  padding="none"
            color="primary" :label="$t('gotit')" @click="boot.newVersionDialog = false"/>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts" vapor>
import { inject } from 'vue'
import { reloadPage } from './util'
import { useBootStore } from './store'

const $t = inject('$t') as Function
const boot = useBootStore()

</script>

<style lang="scss" scoped>
@use '../css/app';
</style>