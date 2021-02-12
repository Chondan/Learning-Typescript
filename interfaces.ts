// ----- Interfaces -----
// One of TypeScript's core principles is that type checking focuses on the shape that values have.
// This is sometimes called "duck typing" or "structural subtyping".

// ----- Our First Interface -----
function printLabel(labelObj: { label: string }) {
	console.log(labelObj.label);
}
const myObj = { size: 10, label: "Size 10 Object"};
printLabel(myObj);

// We can write the same example again, this time using an interface to describe the requirement of having the 
// 'label' property that is a string.
interface LabeledValue {
	label: string;
}
function printAnotherLabel(labelObj: LabeledValue) {
	console.log(labelObj.label);
}
const anotherObj = { size: 10, label: "Size 10 Object" };
printAnotherLabel(anotherObj);
// Notice we didn't have to explicity say that the object we pass to 'printAnotherLabel' implements 
// this interface like we might have to in other languages. 
// Here, it's only the shape that matters. If the object we pass to the function meets the requirements listed, 
// then it's allowed.

// ----- Optional Properties -----
// Not all properties of an interface may be required. Some exist under certain conditions or may not be there at all. 
// These optional properties are popular when creating patterns like "option bags" where you pass an object to 
// a function that only has a couple of properties filled in.
interface SquareConfig {
	color?: string;
	width?: number;
}
function createSquare(config: SquareConfig): { color: string, area: number } {
	const { color, width } = config;
	let newSquare = { color: "white", area: 100 };
	if (config.color) {
		newSquare.color = color;
	}
	if (config.width) {
		newSquare.area = width ** 2;
	}
	return newSquare;
}
let mySquare = createSquare({ color: "black" });
console.log(mySquare);
// Interfaces with optional properties are written similar to other interfaces, with each optional property denoted 
// by '?' at the end of the property name in the declaration. 

// ----- Readonly properties -----
// Some properties should only be modified when an object is first created. 
// You can specify this by putting 'readonly' before the name of the property.
interface Point {
	readonly x: number;
	readonly y: number;
}
const p1: Point = { x: 10, y: 20 };
// TypeScript comes with a 'ReadonlyArray<T>' type that is the same as 'Array<T>' with all mutating methods removed, 
// so you can make sure you don't change your array after creation.
const numberArray: number[] = [1, 2, 3, 4];
const readonlyArray: ReadonlyArray<number> = numberArray;
console.log(readonlyArray);
const aaaa = readonlyArray as number[];
aaaa[0] = 111;
console.log(aaaa);

// ----- readonly vs const -----
// The easiest way to remember where to use 'readonly' or 'const' is to ask whether you're using 
// it on a variable or a property. Variable use 'const' whereas properties use 'readonly'.

// ----- Excess Property Checks -----
// Object literals get special treatment and undergo excess property checking when assigning them to other variables, 
// or passing them as arguments. If an object literal has any properties that the "target type" doesn't have, 
// you'll get an error.
// 1. Getting around these checks is actually really simple. The easiest method is to just use a type assertion.
const sq = createSquare({ width: 100, opacity: 1 } as SquareConfig);
// 2. However, a better approach might be to add a string index signature if you're sure that the object can 
// have some extra properties that are used in some special way. 
// If 'SquareConfig' can have 'color' and 'width' properties with the above types, but could aslo have
// any number of other properties, then we could define it like so:
interface AnotherSquareConfig {
	color?: string;
	width?: number;
	[propName: string]: any;
}
// 3. One final way to get around these checks, which might be a bit surprising, is to assing the object to 
// another variable: Since 'squareOptions' won't undergo excess property checks, the compiler won't give you an error.

// ----- Function Types -----
// In addition to describing an object with properties, interfaces are also capable of describing function types.
// To describe a function type with an interface, we give the interface a call signature.
// This is like a function declaration with only the parameter list and return type given. 
// Each parameter in the parameter list require both name and type. 
interface SearchFunc {
	(source: string, subString: string): boolean;
}
// Once defined, we can use this function type interface like we would other interfaces. 
const mySearch: SearchFunc = function (source: string, sub: string): boolean {
	const result = source.search(sub);
	return result > -1;
}
const isSubString = mySearch("Chondan", "Ch");
console.log("subString: " + isSubString);
// For function types to correctly type check, the names of the parameters do not need to match.

// ----- Indexable Types -----
// Similarly to how we can use interfaces to describe function types, we can also describe types that we
// can 'index into' like 'a[0]', or 'ageMap["daniel"]'. 
// Indexable types have an index signature that describes the types we can use to index into the object,
// along with the corresponding return types when indexing.
interface StringArray {
	[a: number]: string;
}
const myArray: StringArray = ["Bob", "Fred"];
const myStr: string = myArray[0];
// There are two types of supported index signatures: string and number. 
// It is possible to support both types of indexers, but the type returned from a numeric indexer 
// must be a subtype of the type returned from the string indexer. 
// This is because when indexing with a 'number', JavaScript will actually convert that to a 'string'
// before indexing into an object. That means that indexing with 100 (a number) is the same thing as indexing with 
// '100' (a string), so the two need to be consistent.
interface Animal {
	name: string;
}
interface Dog extends Animal {
	breed: string;
}
interface Okay {
	[x: number]: Dog;
	[x: string]: Animal;
}
let obj: Okay = {};
obj[1] = { name: "name", breed: "breed" };
console.log(obj['1']);
// While string index signatures are a powerful way to describe the 'dictionary' pattern, 
// they also enforce that all properties match their return type. This is because a string index declares
// that 'obj.property' is also available as 'obj["property"]'.
// In the following example, name's type does not match the string index's type, and the type checker gives an error:
interface NumberDictionary {
	[index: string]: number;
	length: number;
	// name: string;
}
// However, properties of different types are acceptable if the index signature is a union of the property types:
interface NumberOrStringDictionary {
	[index: string]: number | string;
	length?: number;
	name?: string;
}
// Finally, you can make index signatures 'readonly' in order to prevent assignment to their indices.
interface ReadonlyStringArray {
	readonly [index: number]: string;
}
let myArr: ReadonlyStringArray = ["Alice", "Bob"];
// myArr[2] = "Mallory";

// ----- Class Types -----
// --- Implementing an interface ---
// One of the most common uses of interfaces in languages like C# and Java, that of explicity enforcing that a 
// class meets a particular contract.
interface ClockInterface {
	currentTime: Date;
}
class Clock implements ClockInterface {
	currentTime: Date = new Date();
	constructor(h: number, m: number) {}
}
// You can also describe methods in an interface that are implemented in the class.
interface ClockInterfaceWithMethod {
	currentTime: Date;
	setTime(d: Date): void;
}
class ClockWithMethod implements ClockInterfaceWithMethod {
	currentTime: Date = new Date();
	setTime(d: Date) {
		this.currentTime = d;
	}
	constructor(h: number, m: number) {}
}
const clock: ClockWithMethod = new ClockWithMethod(10, 10);
clock.setTime(new Date("2025-01-01"));
console.log(clock.currentTime);
// Interface describe the public side of the class, rather than both the public and private side.
// This prohibits you from using them to check that a class also has particular types for the private 
// side of the class instance.
// --- Difference between the static and instance sides of classes ---
// When working with classes and interfaces, it helps to keep in mind that a class has two types: 
// the type of the static side and the type of the instance side.
// You may notice that if you create an interface with a construct signature and try to create a class that 
// implements this interface you get an error.
interface ClockConstructor {
	new (hour: number, minute: number): ClockInterface2;
}
interface ClockInterface2 {
	tick(): void;
}
function createClock(
	ctor: ClockConstructor,
	hour: number,
	minute: number
): ClockInterface2 {
	return new ctor(hour, minute);
}
class DigitalClock implements ClockInterface2 {
	constructor(h: number, m: number) {}
	tick() {
		console.log("beep beep");
	}
}
const digital = createClock(DigitalClock, 12, 30);
digital.tick();
// Another simple way is to use class expressions:
const AnalogClock: ClockConstructor = class Clock2 implements ClockInterface2 {
	constructor(h: number, m: number) {}
	tick() {
		console.log("tick tock");
	}
}
const analog: ClockInterface2 = new AnalogClock(12, 30);
analog.tick();
// ----- Extending Interfaces -----
// Like classes, interfaces can extend each other. This allows you to copy the members of one interface into another, 
// which gives you more flexibility in how you separate your interfaces into reusable components.
interface Shape {
	color: string;
}
interface Square extends Shape {
	sideLength: number;
}
const square = {} as Square;
square.color = "blue";
square.sideLength = 10;
console.log(square);
// An interface can extend multiple interfaces, creating a combination of all of the interfaces.
interface PenStroke {
	penWidth: number;
}
interface AnotherSquare extends Shape, PenStroke {
	sideLength: number;
}
const anotherSquare = {} as AnotherSquare;
anotherSquare.color = "blue";
anotherSquare.sideLength = 10;
anotherSquare.penWidth = 5.0;
console.log(anotherSquare);
// ----- Hybrid Types -----
// Interfaces can describe the rich types present in real world JavaScript. 
// Becauase of JavaScript's dynamic and flexible nature, you may occasionally encounter an object that 
// works as a combination of some of the types described above.
interface Counter {
	(start: number): string;
	interval: number;
	reset(): void;
}
function getCounter(): Counter {
	const counter = function (start: number) {} as Counter;
	counter.interval = 123;
	counter.reset = function() {};
	return counter;
}
const c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
// ----- Interfaces Extending Classes -----
// When an interface type extends a class type it inherits the members of the class but not their implementations. 
// It is as if the interface had declared all of the members of the class without providing an implementation. 
// Interfaces inherit even the private and protected members of a base class. 
// This mean that when you creat an interface that extends a class with private or protected members, 
// that interface type can only be implemented by that class or a subclass of it.
class Control {
	private state: any;
}
interface SelectableControl extends Control {
	select(): void;
}
class Button extends Control implements SelectableControl {
	select() {}
}
class TextBox extends Control {
	select() {}
}
// Within the 'Control' class it is possible to access the 'state' private member through an instance of 
// 'SelectableControl'. Effectively, a 'SelectableControl' acts like a 'Control' that is known to have a 
// 'select' method.