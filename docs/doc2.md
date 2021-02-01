# Handbook

<!-- TOC -->

- [Handbook](#handbook)
    - [Functions](#functions)
    - [Literal Types](#literal-types)
    - [Unions and Intersection Types](#unions-and-intersection-types)
        - [Intersection Types](#intersection-types)
    - [Classes](#classes)
        - [Public, private and protected modifiers](#public-private-and-protected-modifiers)
        - [Abstract Classes](#abstract-classes)
    - [Enums](#enums)
    - [Generics 泛型](#generics-泛型)
        - [Generic Classes](#generic-classes)
        - [Generic Constraints](#generic-constraints)
        - [Using Type Parameters in Generic Constraints](#using-type-parameters-in-generic-constraints)

<!-- /TOC -->

## Functions

默认情况下，实参和形参的个数及类型需要对得上。    

可选参数：    

```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName) return firstName + ' ' + lastName;
    return firstName;
}
```     

rest 参数：    

```ts
function buildName(firstName: string, ...restName: string[]) {
    return firstName + ' ' + restName.join(' ');
}
```     

重载：    

```ts
function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
```     

## Literal Types

简单来说貌似意思就是字符串、数字和布尔类型的值，也可以作为一种类型，允许出现在任何类型可以出现的
位置，相当于我们不光把一个变量的类型限制死，连值也限制了。   

```ts
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
    return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}
```      

## Unions and Intersection Types

union 类型相当于一种类型的枚举，一个变量可能有多种类型，这里就把所有类型罗列出来。    

如果我们有一个变量是 union 类型，则我们只能访问 union 中所有类型均有的成员：   

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
pet.layEggs();

// Only available in one of the two possible types
pet.swim();
Property 'swim' does not exist on type 'Bird | Fish'.
  Property 'swim' does not exist on type 'Bird'.
```     

### Intersection Types

交叉类型类似于 union 类型，不同的是 union 类型我们只能访问所有类型均有的成员，而 intersectin
类型则假设我们可以访问所有类型上的所有成员。    

## Classes

### Public, private and protected modifiers

```ts
class Animal {
    public name: string;

    public constructor(theName: string) {
        this.name = theName;
    }

    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```    

ts 是支持 js 原生的私有属性的：   

```ts
class Animal {
  #name: string;
  constructor(theName: string) {
    this.#name = theName;
  }
}
```    

然后它也有它自己 private 语法：   

```ts
class Animal {
  private name: string;
}
```     

一般来说，ts 会认为两个成员相同的类型是兼容的，但是这个条件只适用于 public 成员，如果有 private
和 protected 成员，这个情况就会复杂一点。    

protected 成员和 private 的区别是，protected 成员在子类中是可以访问的，注意是在类中，而不是
在类的实例中，实例是访问不了的。    

如果把一个构造函数声明成 `protected` 的话，那么这个类就无法被实例化，只能被继承。    

可以把属性声明成 readonly，这样的属性必须在声明时或构造函数中初始化。    

参数属性：   

```ts
class Octopus {
  readonly numberOfLegs: number = 8;
  constructor(readonly name: string) {}
}
```     

在构造函数的参数声明中添加了访问描述符或者 readonly 的都算参数属性。    

### Abstract Classes

抽象类是可以包含成员的实现的。    

```ts
abstract class Animal {
    abstract makeSound(): void;

    move(): void {
        console.log('roaming the earth...');
    }
}
```      

不过抽象方法是不能定义具体实现的。    

```ts
abstract class Department {
    constructor(public name: string) {}

    printName(): void {
        console.log('Department name: ' + this.name);
    }

    abstract printMeeting(): void;
}

class AccountingDepartment extends Department {
    constructor() {
        super('Accounting the Auditing');
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports');
    }
}
```     

## Enums

数字枚举值有一条限制是，没有初始化的枚举值要么在第一位，要么必须跟在用数字常量初始化的枚举值
或其他常量枚举值的后面。所以，下面的定义是不合法的：    

```ts
enum E {
  A = getSomeValue(),
  B,
}
```    

除了数字枚举值后还支持字符串枚举值，字符串枚举值必须用字符串字面量初始化或者用其他枚举成员初始化。    

```ts
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}
```    

严格来说，字符串和数字是可以混用的，但不建议。    

其实可以混用这里就解释了为什么数字枚举值为什么一般来说要进行初始化，因为你不初始化就不好判断这
到底是个字符串还是数字值。   

枚举类型在运行时是以真实对象存在的。     

const enums，常量枚举值应该是为了提升性能存在的，这种枚举值的代码会在编译的时候就删除掉，然后
直接用值在使用的地方替换了，估计因为这个原因，那么它的成员理论上来说必须在编译时就能计算出来。   

```ts
const enum Enum {
  A = 1,
  B = A * 2,
}
```     

## Generics 泛型

type variable, 一种特殊类型的变量作用于类型而不是值。   

```ts
function identity<T>(arg: T): T {
    return arg;
}
```    

调用这个泛型函数的方式有两种，第一种是把泛型类型传入：    

```ts
let output = identity<string>('myString');
```   

另一种就是不传泛型累ing，让系统自动判断设置。    

```ts
let output = identity('myString');
```     

泛型函数的类型：   

```ts
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;

let myIdentity2: { <T>(arg: T): T } = identity;
```     

泛型 interface:   

```ts
interface GenericIdentityFn {
    <T>(arg: T): T;
}

let myIdentity3: GenericIdentityFn = identity;
```    

还有另一种写法，是把泛型参数提出来，这样整个 interface 的成员都可以看到泛型参数了：   

```ts
interface GenericIdentityFn<T> {
    (arg: T): T;
}

let myIdentity3: GenericIdentityFn<number> = identity;
```     

注意这里写法和上面的细微不同，在声明具体的 interface 实例时，必须传入具体的泛型类型，也就是
上面的 `<number>` 是不可省略的。    

### Generic Classes

要是没学过其他语言的泛型，这里还真有点不好理解：    

```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericeNumber = new GenericNumber<number>();
```    

### Generic Constraints

```ts
interface Lengthwise {
    length: number;
}

function loggingInentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

loggingInentity('hhhhh');

const testArg = {
    length: 5,
    name: 'hello',
};

loggingInentity(testArg);

loggingInentity({
    length: 6,
    name: 123,
});
```    

注意这里最后一个例子直接传了一个对象字面量，带有 Lengthwise 中未声明的属性是允许的，但是如果
去掉泛型，直接把参数和返回值声明成 Lengthwise 类型的话，name 属性就不允许了。    

### Using Type Parameters in Generic Constraints

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}
```     


