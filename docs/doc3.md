# Handbook Reference

<!-- TOC -->

- [Handbook Reference](#handbook-reference)
    - [Advanced Types](#advanced-types)
        - [Type Guards and Differentiating Types](#type-guards-and-differentiating-types)
        - [User-Defined Type Guards](#user-defined-type-guards)
        - [Type Aliases](#type-aliases)
        - [Index Types](#index-types)
        - [Index types and index signatures](#index-types-and-index-signatures)
        - [Mapped types](#mapped-types)
        - [Conditional Types](#conditional-types)
    - [Utility Types](#utility-types)
        - [`Partial<Type>`](#partialtype)
        - [`Readonly<Type>`](#readonlytype)
        - [`Record<Keys, Type>`](#recordkeys-type)
        - [`Pick<Type, Keys>`](#picktype-keys)
        - [`Omit<Type, Keys>`](#omittype-keys)
        - [`Exclude<Type, ExcludedUnion>`](#excludetype-excludedunion)
        - [`Extract<Type, Union>`](#extracttype-union)
        - [`NonNullable<Type>`](#nonnullabletype)
        - [`Parameters<Type>`, `ConstructorParameters<Type>`](#parameterstype-constructorparameterstype)
        - [`ReturnType<Type>`](#returntypetype)
        - [`InstanceType<Type>`](#instancetypetype)
        - [`Required<Type>`](#requiredtype)

<!-- /TOC -->

## Advanced Types

### Type Guards and Differentiating Types

前面提到过，在访问 union 类型实例的成员时，只能访问大家共有的成员。如果希望访问特有的成员，可能
需要使用类型断言 type assertion：    

```ts
interface Bird {
    fly(): void;
    layEggs(): void;
}

interface Fish {
    swim(): void;
    layEggs(): void;
}

declare function getSmallPet(): Fish | Bird;

let pet = getSmallPet();
let fishPet = pet as Fish;
let birdPet = pet as Bird;

if (fishPet.swim) {
    fishPet.swim();
} else if (birdPet.fly) {
    birdPet.fly();
}
```    

不过，一般情况下我们不希望在代码库中看到这样的代码。    

### User-Defined Type Guards

type guard 是某种表达式，会在运行时执行以确保在部分作用域中的保证。   

**Using type predicates**    

如果想要定义了 type guard，我们需要定义一个返回类型是 type predicate 的函数：   

```ts
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

let pet1 = getSmallPet();

if (isFish(pet)) {
    pet.swim();
} else {
    pet.fly();
}
```    

`pet is Fish` 就是 type predicate，基本上格式就是 `parameterName is Type`，`parameterName`
是当前函数的参数名称。    

注意在上面的代码中，ts 不仅知道在 if 分支中 pet 是 Fish 类型，同时也会知道 else 分支中，由于
pet 不是 Fish，所以它一定是 Bird。    

**Using the in operator**    

`in` 运算符同样也可以扮演一个缩小类型范围的表达式的角色。    

```ts
function move(pet: Fish | Bird) {
    if ('swim' in pet) {
        return pet.swim();
    }
    return pet.fly();
}
```     

所以我仍然没理解什么是 type guard。   

### Type Aliases

Type aliases 为一种类型创建了一个新的名字。   

```ts
type Second = number;

let timeInSecond: number = 10;
let time: Second = 10;
```    

type aliases 也可以是泛型的：    

```ts
type Container<T> = { value: T };
```    

### Index Types

```ts
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
    return propertyNames.map(n => o[n]);
}

interface Car {
    manufacturer: string;
    model: string;
    year: number;
}

let taxi: Car = {
    manufacturer: 'Toyota',
    model: 'Camry',
    year: 2014,
};

let makeAndModel: string[] = pluck(taxi, ['manufacturer', 'model']);
let modelYear = pluck(taxi, ['model', 'year']);
```    

上面这个例子引入了一种新的类型运算符，`keyof T`，index type query operator，对于任意的类型
`T`，`keyof T` 是 T 类型所有 public 属性名的 union 类型，例如：    

```ts
let carProps: keyof Car;
// let carProps: 'manufaceurer' | 'model' | 'year'
```    

所以上面 `K extends keyof T` 是指 K extends 了一个 union 类型？这个东西是只允许在泛型中
这么写吗，经测试一般情况下 interface 只能 extends 其他的 interface 或者 class。   

需要注意的是这里 `keyof Car` 并不是用了 `string` 类型，而是字面量类型 `'manufaceurer' | 'model' | 'year'`。    

引入的第二种运算符是 `T[K]`, indexed access operator。这个就更看不懂了。。。。。    

### Index types and index signatures

`keyof` 和 `T[K]` 是与 index signatures 打交道的。一个 index signature 参数类型一定是
string 或者 number。如果有 string index signature，则 `keyof T` 是 `string | number`。   

如果我们有 number index signature，则 `keyof T` 是 number。    

```ts
interface Dictionary<T> {
    [key: number]: T;
}

let key: keyof Dictionary<number>;
//      let keys: number;
let numberValue: Dictionary<number>[42];
//      let numberValue: number;
```    

话说之前见到的是 `[propName: string]: number`，所以其实这种一种格式，而键名是自定义的，propName,
key 或者其他的。所以这里也没理解这个东西和上面的两个运算符有什么关系。。。。    


### Mapped types

一种常见的需求是定义一个新的接口，把一个旧接口的所有属性变成可选或者只读：    

```ts
type Partial1<T> = {
    [P in keyof T]?: T[P];
};

type Readonly1<T> = {
    readonly [P in keyof T]: T[P];
}
```    

这种语法描述了一种类型而不是一个成员，如果想要添加成员，需要使用 intersection type:   

```ts
type PartialWithNewMember<T> = {
    [P in keyof T]?: T[P];
} & { newMember: boolean }
```     

最简单的一种用法：   

```ts
type Keys = 'option1' | 'option2';
type Flags = { [K in Keys]: boolean; }
```    

越来越看不懂了。。。。     

### Conditional Types

```ts
T extends U ? X : Y
```     

上面的类型意思是，如果 T 对于 U 是可赋值的，则类型是 X，否则是 Y。    

```ts
declare function f<T extends boolean>(x: T): T extends true ? string : number;

let x = f(Math.random() < .5);
//   let x: string | number
```     

剩下的略了，实在看不懂。。。     

## Utility Types

ts 提供了一些 utility type 方便进行一些常用类型转换。    

### `Partial<Type>`

创建一个类型，这个类型将所有 `Type` 类型的属性设置为可选的，即返回一个给定类型所有子集类型的类型。   

```ts
interface Todo {
    title: string;
    description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
    return {
        ...todo,
        ...fieldsToUpdate,
    };
}

const todo1 = {
    title: 'organize desk',
    description: 'clear clutter',
};

const todo2 = updateTodo(todo1, {
    description: 'throw out trash',
});
```     

### `Readonly<Type>`    

类似于上面的，将 `Type` 类型的所有类型设置为可读的类型。    

```ts
interface Todo2 {
    title: string;
}

const todo3: Readonly<Todo2> = {
    title: 'delete inactive users',
};

todo3.title = 'hello'; // error
```    

### `Record<Keys, Type>`

构建一个对象类型，属性键是 `Keys` 类型，属性值是 `Type` 类型，用来将属性键的类型映射到另一种
类型上。     

```ts
interface PageInfo {
    title: string;
}

type Page = 'home' | 'about' | 'contact';

const nav: Record<Page, PageInfo> = {
    about: { title: 'about' },
    contact: { title: 'contact' },
    home: { title: 'home' },
};
```    

注意这个和下面例子的顺序不一样，这个是 Keys 在前，下面的都是 Type 在前。   

### `Pick<Type, Keys>`

构建一个类型，这个类型从 `Type` 中选出 `Keys` 的一个子集。     

```ts
interface Todo4 {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Pick<Todo4, 'title' | 'completed'>;

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
};
```     

### `Omit<Type, Keys>`

构建一个类型，这个类型从 `Type` 中剔除了 `Keys` 中的属性。    

```ts
interface Todo5 {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview2 = Omit<Todo5, 'description'>;

const todo4: TodoPreview2 = {
    title: 'Clean room',
    completed: false,
};
```     

### `Exclude<Type, ExcludedUnion>`

构建一个类型，这个类型会把 `Type` 中所有的 union 类型中所有对于 `ExcludedUnion` 可赋值的类型
剔除掉。相当于选中从 union Type 中踢掉 ExcludedUnion 的类型。这个 Type 应该是个 union 吧。   

```ts
type T0 = Exclude<'a' | 'b' | 'c', 'a'>;
// type T0 = 'b' | 'c';

type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>;
// type T1 = 'c'
```    

### `Extract<Type, Union>`

这个和上面的类似，不同的是提出所有对于 Union 可赋值的类型。    

```ts
type T3 = Extract<'a' | 'b' | 'c', 'a' | 'f'>;
// type T3 = 'a'

const t3: T3 = 'a';
```     

### `NonNullable<Type>`

构建一个类型，从 Type 中剔除 null 和 undefined。应该是等价于 `Exclude<Type, null | undefined>`。   

```ts
type T4 = NonNullable<string | number | undefined>;
// type T4 = string | number
```    

### `Parameters<Type>`, `ConstructorParameters<Type>`

这个看不懂，就不介绍了。    

### `ReturnType<Type>`    

类似于类型等价于函数 `Type` 的返回值类型。    

### `InstanceType<Type>`

看不懂。    

### `Required<Type>`

这里好理解，就是要求 `Type` 的所有属性都是必要的。     

