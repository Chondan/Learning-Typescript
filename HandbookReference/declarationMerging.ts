import { Observable } from './observable';

// ----- Declaration Merging -----
// "Declaration Merging" means that the compiler mergets two separate declarations declared with the same
// name into a single definition.

// ----- Basic Concepts -----
// In TypeScript, a declaration creates entities in at least one of three groups: 
// namespace, type, or value.

// ----- Merging Interfaces -----
interface Box {
	height: number;
	width: number;
}
interface Box {
	scale: number;
}
const box: Box = { height: 5, width: 6, scale: 1.5 };
// Non-function members of the interfaces should be unique. If they are not unique, they 
// must be of the same type.

// For function members, each function member of the same name is treated as describing an overload 
// of the same function.
// Of note, too, is that in the case of interface 'A' merging with later interface 'A',
// the second interface will have a higher precedence that the first.
interface Animal {
	name: string;
}
interface Sheep {
	name: string;
}
interface Cloner {
	clone(animal: Animal): Animal;
}
interface Cloner {
	clone(animal: Sheep): Sheep;
}
// The two interfaces will merge to creat a single declaration as so:
interface Cloner {
	clone(animal: Sheep): Sheep;
	clone(animal: Animal): Animal;
}
// Notice that the elements of each group maintains the same order, but the groups themselves are
// merged with later overload sets ordered first.

// One exceptioni to this rule is specialized signatures. If a signature has a parameter whose 
// type is a single string literal type (e.g. not a union of string literals), then it will 
// be bubbled toward the top of its merged overload list. 

// ----- Merging Namespaces -----
// Similarly to interface, namspaces of the same name will also merge their members.
// Since namespaces create both a namespace and a value, we need to understand how both merge.
namespace Animals {
	export class Zebra {}
	export interface Legged {
		size: string;
	}
}
namespace Animals {
	export interface Legged {
		numberOfLegs: number;
	}
	export class Dog {}
}

const leg: Animals.Legged = { numberOfLegs: 10, size: "Big" };
// Non-exported members are only visible in the original (un-merged) namespace.
// This means that after merging, merged members that came from other declarations 
// cannot see non-exported members.

namespace Animals {
	let haveMuscles = true;
	export function animalsHaveMuscles() {
		return haveMuscles;
	}
}
namespace Animals {
	export function doAnimalsHaveMuscle() {
		// return haveMuscles; // Error, because haveMuscles is not accessible here.
	}
}

// ----- Merging Namespaces with Classes, Functions, and Enums -----
// This gives the user a way of describing inner classes.
class Album {
	label: Album.AlbumLabel = class {};
}
namespace Album {
	export class AlbumLabel {}
}
// In addition to the pattern of innner classes, you may also be familiar with the JavaScript 
// practice of creating a function and then extending the function further by adding properties
// onto the function.
function buildLabel(name: string): string {
	return buildLabel.prefix + name  +buildLabel.suffix;
}
namespace buildLabel {
	export let suffix = "";
	export let prefix = "Hello, ";
}
console.log(buildLabel("Sam Smith"));
// Similarly, namespaces can be used to extend enums with static members.
enum Color {
	red = 1,
	green = 2,
	blue = 4
}
namespace Color {
	export function mixColor(colorName: string) {
		switch (colorName) {
			case "yellow":
				return Color.red + Color.green;
				break;
			case "white":
				return Color.red + Color.green + Color.blue;
				break;
			default:
				return "";
		}
	}
}
console.log(Color.mixColor("yellow"));

// ----- Disallowed Merges ----
// Not all merges are allowed in TypeScript, Currently, classes can not merge with other classes 
// or with variables.

// ----- Module Augmentation -----
// ALthough JavaScript modules do not support merging, you can patch existing objects by importing
// and the nupdating them.
Observable.prototype.hello = function() {
	console.log("Hello");
}
// This works fine in TypeScript too, but the compiler doesn't know about 'Observable.prototype.hello'.
// You can use module augmentation to tell the compiler about it.
declare module './observable' {
	interface Observable<T> {
		hello(): void;
	}
}
new Observable().hello();
// The mogule name is resolved the same way as module specifier in 'import/export'.
// Then the declarations in an augmentation are merged as if they were declared in the same file 
// as the original.

// ----- Global aumentation -----
// You can also add declarations to the global scope from inside a module.
declare global {
	interface Array<T> {
		toObservable(): Observable<T>;
	}
}
Array.prototype.toObservable = function() {
	return new Observable<string>();
}
// Global augmentations have the same behavior and limits as module augmentations.