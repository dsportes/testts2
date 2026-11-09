import { useBootStore } from '@/stores/boot-store'
import { useCounterStore } from '@/stores/counter'

export default class Stores {
  static get boot() { return useBootStore() }
  static get counter() { return useCounterStore() }
}
