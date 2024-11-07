//import 'reflect-metadata'

//const Injectable = (key: string) => (target: Function) => {
//  Reflect.defineMetadata(key, 'value', target)
//  const meta = Reflect.getMetadata(key, target)
//  console.log(meta)
//}

//const Inject = (key: string) => (target: Function) => {
//  Reflect.defineMetadata(key, 'value', target)
//  const meta = Reflect.getMetadata(key, target)
//  console.log(meta)
//}

//const Prop = (target: Object, name: string) => {
//  Reflect.defineMetadata('key', 'value', target)
//  const meta = Reflect.getMetadata('key', target)
//  console.log(meta)
//}

//@Injectable('C')
//export class C {
//  @Prop prop: number
//}

//@Injectable('D')
//export class D {
//  @Prop prop: number
//  constructor(@Inject('C') c: C) {}
//}
