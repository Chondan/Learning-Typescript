// ----- Generics -----
// A major part of software engineering is building components that not only have well-defined and 
// consistent APIs, but are also reusable.
// Components that are capable of working on the data of today as well as the data of tomorrow will give you
// the most flexible capabilities for building up large software systems.

// In language like C# and Java, one of the main tools in the toolbox for creating reusable components is 
// 'generics', that is, being able to creat a component that can work over a variety of types 
// rather than a single one.
// This allows users to consume these components and use their own types.

// ----- Hello World of Generics -----
// To start off, let's do the 'hello world' of generics: the indentity function. 
// The indentity function is a function that will return back whatever is passed in.
function indentity(arg: number): number {
	return arg;
}
function indentity2(arg: any): any {
	return arg;
}
// While using 'any' is certainly generic in that it will cause the function to accept any and all types 
// for the type of 'arg', we actually losing the information about what that type was when the function returns.

// Instead, we need a way of capturing the type of the argument is such a way that we can also use it to 
// denote what is being returned. 
// Here, we will use a 'type variable', a special kind of variable that works on types rather than values.
function indentity3<T>(arg: T): T {
	return arg;
}
// Once we've written the generic indentity function, we can call it one of two ways. 
// The first way is to pass all of the arguments, including the type argument, to the function. 
const output = indentity3<string>("myString");
console.log(output);
// The second way is also perhaps the most common. Here we use type argument inference
// that is, we want the compiler to set the value of 'T' for us automatically based on the type of the 
// argument we pass in:
const output2 = indentity3("myString");
console.log(output2);
// Type argument inference can be a helpful tool to keep code shorter and more readable, 
// you may need to explicitly pass in the type arguments as we did in the previous example 
// when the compiler fails to infer the type, as many happen in more complex examples.

// ----- Working with Generic Type Variables -----
function loggingLength<T>(arg: T[]): number {
	return arg.length;
}
console.log(loggingLength([1, 2, 3, 4, 5]));
function loggingLength2<T>(arg: Array<T>): number {
	return arg.length;
}
console.log(loggingLength2([1, 2, 3, 4, 5]));

// ----- Generic Types -----
// The type of generic functions is just like those of non-generic functions, with the type parameter listed first, 
// similarly to function declarations:
const myIdentity: <T>(arg: T) => T = indentity3;
// We could also have used a diffenret name for the generic type parameter in the type.
const myIdentity2: <U>(arg: U) => U = indentity3;
// We can also write the generic type as a call signature of an object literal type.
const myIdentity3: { <T>(arg: T): T } = indentity3;
console.log(myIdentity3("Hello World"));
// Which leads us to writing our first generic interface. 
interface GenericIndentityFn {
	<T>(arg: T): T;
	name: string;
}
const myIdentity4: GenericIndentityFn = myIdentity3;
// We may want to move the generic parameter to be a parameter of the whole interface.
interface GenericIndentityFn2<T> {
	(arg: T): T;
	greet(): string;
}
const myFunc = <T>(arg: T) => arg;
myFunc.greet = () => "Hello, How are you?";
const myIdentity5: GenericIndentityFn2<string> = myFunc;
console.log(myIdentity5("Hey"));
console.log(myIdentity5.greet());
console.log(myIdentity5.name);

// ----- Generic Classes -----
class GenericNumber<T> {
	zeroValue: T;
	add: (x: T, y: T) => T;
}
const myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) {
	return x + y;
}
console.log(myGenericNumber.add(10, 15));

// ----- Generic Constraints -----
// You may sometimes want to write a generic function that works on a set of types where you have
// knowledge about what capabilities that set of types will have.
function loggingIdentity<T>(arg: T): T {
	// console.log(arg.length);
	return arg;
}
// Instead of working with any and all types, we'd like to constrain this function to work with any and 
// all types that also have the '.length' property.
// We must list our requirement as a constraint on what T can be.
// To do so, we'll create an interface that describes our constraint.
interface Lengthwise {
	length: number;
}
function loggingIdentity2<T extends Lengthwise>(arg: T): T {
	console.log(arg.length);
	return arg;
}
console.log(loggingIdentity2(['12', '12']));
// Because the generic function is now constrained, it will no longer work over any and all types.
// Instead, we need to pass in values whose type has all the required properties.
console.log(loggingIdentity2({ length: 10, value: 3 }));

// ----- Using Type Parameters in Generic Constraints ----
// You can declare a type parameter that is constrained by another type parameter.
function getProperty<T, K extends keyof T>(obj: T, key: K) {
	return obj[key];
}
const x = { a: 1, b: 2, c: 3, d: 4 };
console.log(getProperty(x, 'a'));
// console.log(getProperty(x, 'm'));

// ----- Using Class Types in Generics -----
function create<T>(c: { new (): T }): T {
	return new c();
}
class BeeKeeper {
	hasMask: boolean;
}
class Animal {
	numLegs: number;
}
const animal = create(Animal);
animal.numLegs = 4;
console.log(animal.numLegs);