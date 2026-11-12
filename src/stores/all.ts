import { useBootStore } from '@/bootstuff/store'
// import { useCounterStore } from '@/stores/counter'

export default class Stores {
  static get boot() { return useBootStore() }
  // static get counter() { return useCounterStore() }
}
