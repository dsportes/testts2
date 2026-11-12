class Descriptor {
  svc: string
  docCl: string
  option: string

  // @ts-expect-error
  clazz: Function

  subClasses: Map<string, Function> = new Map()
  subClass (subCl: string) : Function | undefined {
    return this.subClasses.get(subCl)
  }

  constructor (svc: string, docCl: string, option: string) {
    this.svc = svc
    this.docCl = docCl
    this.option = option
  }

}

class Registry {
  static constructors = new Map<string, Function>()

  static register (clazz: Function, descriptor: Descriptor) {
    this.constructors.set(descriptor.svc+ '/' + descriptor.docCl, clazz)
    const cl = clazz as any
    descriptor.clazz = clazz
    cl._descriptor = descriptor
  }

  static registerSubClass (clazz: Function, parentClazz: Function, subCl: string) {
    const pc = parentClazz as any
    const d : Descriptor = (parentClazz as any)['_descriptor'] as Descriptor
    d.subClasses.set(subCl, clazz)
    const cl = clazz as any
    cl._parentClazz = pc
    cl._subCl = subCl
  }

  static newD (svc: string, docCl: string, subCl?: string) {
    const cl = this.constructors.get(svc + '/' + docCl) as any
    const d = cl.descriptor
    if (subCl) {
      const scl = d.subClasses.get(subCl)
      return new scl()
    } else {
      return new d.clazz()
    }
  }

  static getDescriptor (svc: string, docCl: string) {
    const cl = this.constructors.get(svc + '/' + docCl) as any
    return cl.descriptor || cl.parentClazz.descriptor
  }
}

abstract class Doc {
  private static _descriptor: Descriptor
  private static _subCl: string
  private static _parentClazz: Function
  static get descriptor () : Descriptor {
    return this._descriptor || (this._parentClazz as any)['_descriptor']
  }
  static get subCl () : string {
    return this._subCl || ''
  }
  static get parentClazz() : Function | undefined {
    return this._parentClazz || undefined
  }

  get descriptor () { return (this.constructor as any)['descriptor'] }

}

class AX extends Doc {
  pseudo: string = ''
}
Registry.register(AX, new Descriptor('AS2', 'Auteur', 'option A'))

class Livre extends Doc {
  titre: string = ''
}
Registry.register(Livre, new Descriptor('AS2', 'Livre', 'option L'))

class Auteur_roman extends AX {
  best: string = ''
}
Registry.registerSubClass(Auteur_roman, AX, 'roman')

const da2 = AX.descriptor
const cln = AX.descriptor.clazz.name
const das = AX.subCl
const dap = AX.parentClazz

const a1 = Registry.newD('AS2', 'Auteur') as AX
a1.pseudo = 'Simone'

const a2 = Registry.newD('AS2', 'Auteur', 'roman') as Auteur_roman
a2.pseudo = 'Zola'
a2.best = 'La bête'
const a2d = a2.descriptor

const daz = Auteur_roman.descriptor
const saz = Auteur_roman.subCl
const paz = Auteur_roman.parentClazz as Function

export const dx = Registry.getDescriptor('AS2', 'Auteur')
const cl = dx.subClass('roman')

export const test = () => {
  console.log('Dans test', a2.best)
  console.log('Dans test', paz.name)
}