/// <reference types="svelte" />
/// <reference types="vite/client" />

type ObjectKeys<Obj> = Obj extends object
  ? (keyof Obj)[]
  : Obj extends number
  ? []
  : Obj extends Array<any> | string
  ? string[]
  : never;

interface ObjectConstructor {
  keys<ObjectType>(o: ObjectType): ObjectKeys<ObjectType>;
  entries<ObjType>(o: ObjType): [Unpacked<ObjectKeys<ObjType>>, ObjType[keyof ObjType]][];
}

interface Storage {
  getItem<T extends string>(key: string): T | null;
}

type Unpacked<ArrayLike> = ArrayLike extends (infer RootType)[] ? RootType : ArrayLike;

type Unpromisify<PromiseLike> = PromiseLike extends Promise<infer RootType>
  ? RootType
  : PromiseLike;

declare namespace React {
  interface HTMLAttributes<T> {
    class?: string;
  }
}

interface Array<T> {
  fill<T extends any>(value: T, start?: number | undefined, end?: number | undefined): T[];
}
