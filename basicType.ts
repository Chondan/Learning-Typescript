import { number as myNumber } from './module';

// ----- Module -----
const copyNumber: number = myNumber;
console.log(copyNumber);

// ----- Boolean -----
let isDone: boolean = false;

// Number
let decimal: number = 6;
let hex: number = 0xf00d;

// ----- String -----
let color: string = "blue";
color = 'red';
// template string
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}. I am ${age} years old`;
let phrase: string = 
	"Hello, " +
	"How are you doing?";

// ----- Array ------
// Array types can be written in one of two ways. 
// 1. use the type of the elements followed by '[]'
// 2. use a generic array type -> 'Array<elemType>'
type myType = "one" | "two";
const numbers: Array<myType> = ["one", "two"];
let list: number[] = [1, 2, 3];

// ----- Tuple -----
//express an array with a fixed number of elements whose types are known, but need not be the same.
let x: [string, number];
x = ["hello", 10];
// When accessing an element with a known index, the correct type is retrieved. 
console.log(x[0].substring(1));

// ----- Enum -----
// a way of giving more friendly names to sets of numeriv values.
enum Color {
	Red=1,
	Green=2,
	Blue=4,
}
// By default, enums begin numbering their members starting at 0.
// You can change this by manually setting the value of one of its members.
// or, even manually set all the values in the enum. 
let c: Color = Color.Green;
console.log(c);
// you can also go from a numeric value to the name of that value in the enum.
// For example, if we had the value 2 but weren't sure what that mapped to in the 'Color' enum above,
// we could look up the corresponding name.
let colorName: string = Color[4];
console.log(colorName);

// ----- Unknown -----
// We may need to describe the type of variables that we do not know when we are writing an application.
// These values may come from dynamic content - e.g. from the user - or we may want to intentionally accept all values in our API. 
// In these cases, we want to provide a type that tells the compiler and future readers that this 
// variable could by anything. so we give it the 'unknown' type.
let notSure: unknown = 4;
notSure = "maybe a string instead";
console.log(notSure);
// If you have a variable with an unknown type, you can narrow it to something more specific by 
// doing 'typeof' checks, comparison checks, or more advanced type.
declare const maybe: unknown;

// ----- Any -----
// In some situations, not all type information is available or its declaration would take an 
// inappropriate amount of effort. 
// These may occur for values from code that has been written without TypeScript or a 3rd party library.
declare function getValue(key: string): any;
// The 'any' type is powerful way to work with existing JavaScript, allowing you to gradually opt-in 
// and opt-ot of type checking during compilation.

// Unlike 'unknown', variables of type 'any' allow you to access arbitrary properties, 
// even ones that don't exist.
let looselyTyped: any = 4;
// looselyTyped.ifItExists();
looselyTyped.toFixed();

// The 'any' will continue to propagate through your objects.
let obj: any = {};
let childObj = obj.a;
childObj = 10;
console.log(childObj);
childObj = "ten";
console.log(childObj);

// After all, remember that all the convenience of 'any' comes at the cost of losing type safety.
// Type safetyp is one of the main motivations for using TypeScript and you should try to avoid 
// using 'any' when not necessary.

// ----- Void -----
// 'void' is a little like the opposite of 'any': the absence of having any type at all. 
// You may commonly see this as the return type of functions that do not return a value.
function warnUser(): void {
	console.log("This is my warning message");
}
warnUser();
// Declaring variables of type 'void' is not useful because you can only assign 'null' or 
// 'undefined' to them.
let unusable: void = undefined;
unusable = null;
console.log(unusable);

// ----- Null and Undefined
// In TypeScript, both 'undefined' and 'null' actually have their types named 'undefined' and 
// 'null' respectively. 
// Much like 'void', they're not extremely useful on their own.
let u: undefined = undefined;
let n: null = null;
// By dafault 'null' and 'undefined' are subtypes of all other types. 
// That means you can assing 'null' and 'undefined' to something like 'number'
const myNum: number = null;
console.log(`My number is ${myNum}`);
// However, when using the '--strictNullChecks' flag, 
// 'null' and 'undefined' are only assignable to 'unknown', 'any' and their respective types.

// ----- Never -----
// The 'never' type represents the type of values that never occur.
// For instance, 'never' is the return type for a function expression or an arrow function 
// expression that always throws an exception or one that never returns.
function error(message: string): never {
	throw new Error(message);
}

// ----- Object -----
// 'object' is a type that represents the non-primitive type, 
// i.e. anything that is not 'number', 'string', 'boolean', 'bigint', 'symbol', 'null', or 'undefined'.
declare function create(o: object | null): void;

// ----- Type assertions -----
// Sometimes you'll end up in a situation where you'll know more about a value than TypeScript does.
// Usually, this will happen when you know the type of some entity could be more specific than its current type.
// Type assertions are a way to tell the compiler "trust me, I know what I'm doing."
// A type assertion is like a type cast in other languages, but it performs no special checking or restructuring data.
// Type assertions have two forms.
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;
console.log(`The length of '${someValue}' is ${strLength}`);
let strLength2: number = (<string>someValue).length;
console.log(`The length of '${someValue}' is also ${strLength2}`);
// The two samples are equivalent. Using one over the other is mostly a choice of preference; 
// however, when using TypeScript with JSX, only 'as'-style assertions are allowed.