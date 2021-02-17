// Types by Inference
let helloWorld: string = "Hello World";

// Defining Types
interface User {
	name: string;
	id: number;
}
const user: User = {
	name: "Chondan",
	id: 1,
}

class UserAccount {
	name: string;
	id: number;

	constructor(name: string, id: number) {
		this.name = name;
		this.id = id;
	}
}

const anotherUser: User = new UserAccount("Chondan", 1);

// use interfaces to annotate parameters and return values to functions
let users: Array<User> = [user, { name: "Mane", id: 2 }];
function getAdminUser(): User {
	return users[0];
}
function deleteUser(user: User) {
	users = users.filter(u => u.id !== user.id);
}

// Composing Types -> create complex types by combining simple ones
// Unions
type Mybool = true | false;

function getLength(obj: string | string[]) {
	return obj.length;
}
console.log(getLength("Chondan"));

// A popular use-case for union types is to describe the set of string or numbers literal that a value is allowed to be
type WindowState = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
const isLock: LockStates = "locked";
console.log(isLock);

// make a function return different values depending on whether it is passed a string or an array
function wrapInArray(obj: string | string[]) {
	if (typeof obj === "string") {
		return [obj];
	}
	return obj;
}
console.log(wrapInArray("Chondan"));

// Generics -> provide variables to types.
// e.g. An array without generices could contain anything.
// An array with generics can describe the values that the array contains.
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
const numbers: NumberArray = [1, 2, 3, 4];
const person: ObjectWithNameArray = [ { name: "Chondan" }, { name: "Salah" }];

// you can declare your own types that use generics
interface Backpack<Type> {
	add: (obj: Type) => void;
	get: () => Type;
}

declare const backpack: Backpack<string>;

// Structural Type System -> type checking focuses on the shape that value have
// This is sometimes called "duck typing" or "structural typing"
// In a structural type system, if two objects have the same shape, they are considered to be of the same type
interface Point {
	x: number;
	y: number;
}

function logPoint(p: Point) {
	console.log(`${p.x}, ${p.y}`);
}
const point = { x: 12, y: 26 };
logPoint(point);
// The 'point' variable is never declared to be a 'Point' type.
// However, Typescript compares the shape of 'point' to the shape of 'Point' in the type-check.
// They have the same shape, so the code pass. 
const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3);
// The shape-matching only requires a subset of the object's field to match.

class VirtualPoint {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
const newPoint = new VirtualPoint(13, 56);
logPoint(newPoint);