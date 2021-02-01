interface Point {
    x: number;
    y: number;
}

function logPoint(p: Point) {
    console.log(`${p.x}, ${p.y}`);
}

const p = {
    x: 10,
    y: 10,
    z: 10,
};

logPoint(p);

let str: 'hello' = 'hello';

let tuple = ['hello', 123];
tuple = [123, 'hello'];


function printLabel(labelObj: { label: string, size: number }) {
    console.log(labelObj.label);
}

const myObj = {
    size: 10,
    label: 'hh'
};

printLabel(myObj);

let myAdd: (x: number, y: number) => number = function(x: number, y: number): number {
    return x + y;
};


let suits = ['hearts', 'spades', 'clubs', 'diamonds'];

function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
function pickCard(x: any): any {
    if (typeof x === 'object') {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }

    else if (typeof x === 'number') {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

interface Lengthwise {
    length: number;
}

function logginIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

function myFn<T extends { length: number }>(arg: T): T {
    console.log(arg.length);
    return arg;
}

namespace mySpace {
    let x: number;
}

type mySpace = {
    y: number;
};