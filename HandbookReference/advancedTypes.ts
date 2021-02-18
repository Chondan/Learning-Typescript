import { add } from '../libs/add/index';

const sum = add(10, 15);
console.log(sum);

// ----- Advanced Types -----
// ----- Type Guards and Differentiating Types -----
interface Fish {
	swim: string;
}
interface Bird {
	fly: string;
}

function getSmallPet(): Fish | Bird {
	const fish = { swim: "swim" };
	const bird = { fly: "fly" };
	return Math.random() > 0.5 ? fish : bird;
}
const pet = getSmallPet();

if ("swim" in pet) console.log(pet.swim);
if ("fly" in pet) console.log(pet.fly);

// To get the same code working via property accessors, we'll need to use a type assertion.
const fishPet = pet as Fish;
const birdPet = pet as Bird;

if (fishPet.swim) console.log(fishPet);
else if (birdPet.fly) console.log(birdPet);

// ----- User-Defined Type Guards -----
// It would be much better if once we performed the check, we could konw the type of 'pet' withing each branch.
// TypeScript has something called a type guard. A type guard is some expression that performs a runtime 
// check that guarantees the type in some scope.
// --- Using type predicates ---
function isFish(pet: Fish | Bird): pet is Fish {
	return (pet as Fish).swim !== undefined;
}
// 'pet is Fish' is our type predicate in this example.
if (isFish(pet)) console.log(pet.swim);
else console.log(pet.fly);
// --- Using the in operator ---
// The 'in' operator also acts as a narrowing expression for types.
function move(pet: Fish | Bird) {
	if ("swim" in pet) return pet.swim;
	return pet.fly;
}

// ----- typeof type guards -----
function isNumber(x: any): x is number {
	return typeof x === "number";
}
function isString(x: any): x is string {
	return typeof x === "string";
}

function padLeft(value: string, padding: string | number) {
	if (isNumber(padding)) return Array(padding + 1).join(" ") + value;
	if (isString(padding)) return padding + value;
	throw new Error('Expected string or number');
}
console.log(padLeft("Hello", 4));
console.log(padLeft("World", "Hello "));
// However, having to define a function to figure out if type is a primitive is kind of a pain. 
// Luckily, you don't need to abstract 'typeof x === "number"' into its own function because 
// TypeScript will recognize it as a type guard on its own.

// ----- instanceof type guards -----
// 'instanceof type guards' are a way of narrowing types using their constructor function.
interface Padder {
	getPaddingString(): string;
}
class SpaceRepeatingPadder implements Padder {
	constructor(private numSpaces: number) {}
	getPaddingString() {
		return Array(this.numSpaces + 1).join(" ");
	}
}
class StringPadder implements Padder {
	constructor(private value: string) {}
	getPaddingString() {
		return this.value; 
	}
}
function getRandomPadder() {
	return Math.random() < 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder("  ");
}
const padder: Padder = getRandomPadder();
if (padder instanceof SpaceRepeatingPadder) console.log(padder.getPaddingString());
if (padder instanceof StringPadder) console.log(padder.getPaddingString());
// The right side of the `instanceof` needs to be a constructor function.

// ----- Nullable types -----
// By default, the type checker consider 'null' and 'undefined' assignable to anything.
// The '--strictNullChecks' flag fixes this: when you declare a variable, it doesn't automatically 
// include 'null' or 'undefined'. You can include them explicitly using a union type.
let exampleString = "foo";
// exampleString = null;

let stringOrNull: string | null = "bar";
stringOrNull = null;
console.log(stringOrNull);
// --- Optional parameters and properties ---
// With '--strictNullChecks', an optional parameter automatically adds '| undefined'.
function f(x: number, y?: number) {
	return x + (y ?? 0)
}
console.log(f(1));
console.log(f(1, 11));
// The same is true for optional properties.
class C {
	a: number;
	b?: number;
} 
const c = new C();
c.a = 12;
// c.a = undefined;
// c.b = null;

// --- Type guards and type assertions ---
// Since nullable types are implemented with a union, you need to use a type guard to get rid of the 'null'.
function f2(stringOrNull: string | null): string {
	if (!stringOrNull) return "default";
	return stringOrNull;
}
console.log(f2(null));
console.log(f2("myString"));
// The 'null' elimination is pretty obvious here, but you can use terser operators too.
function f3(stringOrNull: string | null): string {
	return stringOrNull ?? "default";
}
// console.log(f3(undefined));
// In cases where the compiler can't eliminate 'null' or 'undefined', you can use the type assertion
// operator to manually remove them.
interface UserAccout {
	id: number;
	email?: string;
}
function getUser(role: string): UserAccout {
	const user = { id: 1, name: 'user', role };
	return 0 > 0.5 ? user : { ...user, email: 'email' };
}
const user = getUser("admin");
// The syntax is postfix '!': 'indentifier!' removes 'null' and 'undefined' from the type of 'indentifier'.
console.log(user!.email!.length);
// Instead if you are sure that these objects or field exists, the postfix '!' lets you short circuit 
// the nullability.

// ----- Type Aliases -----
// Type aliases create a new name for a type.
// Aliasing doesn't actually create a new type - it creates a new name to refer to that type.
type Container<T> = { value: T };
// We can also have a type alias refer to itself in a property.
type Tree<T> = {
	value: T;
	left?: Tree<T>;
	right?: Tree<T>;
}
// Together with 'intersection' types, we can make some pretty mind-bending types.
type LinkedList<Type> = Type & { next?: LinkedList<Type> };
interface Person {
	name: string;
}
const people: LinkedList<Person> = {
	name: "John",
	next: {
		name: "Bob",
	}
}

// ----- Interfaces vs. Type Aliases -----
// Almost all features of an 'interface' are available in 'type',
// the key distinction is that a type cannot be re-opened to add new properties vs an interface which 
// is always extendable.
// --- Extending an interface ---
interface Animal {
	name: string;
}
interface Bear extends Animal {
	honey: boolean;
}
const bear: Bear = { name: "Bear", honey: true };
console.log(bear);
// --- Extending a type ---
type TAnimal = { name: string };
type TBear = TAnimal & { honey: boolean };
const bear2: TBear = { name: "Bear2", honey: false };
console.log(bear2);
// --- Adding new fields to an existing interface ---
interface Window {
	title: string;
}
interface Window {
	color: string;
}
const window: Window = { title: "Window", color: "red" };
// Note: A type cannot be changed after created
// Because an interface more closely maps how JavaScript objects work

// ----- Enum Member Types -----
enum Status {
	f="fail",
	s="success"
}
const status: Status = Status.f;
console.log(status);

// ----- Polymorphic this types -----
// A polymorphic 'this' type represents a type that is the subtype of the containing class or interface.
// This is called F-bound polymorphism.
class BasicCalculator {
	public constructor(protected value: number) {}
	public currentValue(): number {
		return this.value;
	}
	public add(operand: number): this {
		this.value += operand;
		return this;
	}
	public multiply(operand: number): this {
		this.value *= operand;
		return this;
	}
}
const v = new BasicCalculator(2).multiply(5).add(10).currentValue();
console.log(v);
// Since the class use 'this' types, you can extend it and the new class can use the old methods 
// with no changes.
class ScientificCalculator extends BasicCalculator {
	public constructor(value = 0) {
		super(value);
	}
	public sin(): this {
		this.value = Math.sin(this.value);
		return this;
	}
}
const v2 = new ScientificCalculator(2).multiply(5).sin().add(1).currentValue();
console.log(v2);

// ----- Index types -----
// With index types, you can get the compiler to check code that uses dynamic property names.
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
	return propertyNames.map(k => o[k]);
}
interface Car {
	manufacturer: string;
	model: string;
	year: number;
}
const taxi: Car = {
	manufacturer: "Toyota",
	model: "Camry",
	year: 2014
}
const makeAndModel = pluck(taxi, ["manufacturer", "model"]);
console.log(makeAndModel);
// The example introduces a couple of new type operators. 
// First is 'keyof T', the 'index type query operator'.
// For any type T, 'keyof T' is the union of known, public property names of T.
const carProps: keyof Car = "manufacturer";
// 'keyof Car' is completely interchangeable with "manufacturer" | "model" | "year".
// The difference is that if you add another property to 'Car', then 'keyof Car' will automatically update 
// to the new one.

// The second operator is 'T[K]', the 'indexed access operator'. 
// Here, the type syntax reflects the expression syntax.
function getProperty<T, K extends keyof T>(o: T, k: K): T[K] {
	return o[k];
}
console.log(getProperty(taxi, "model"));

// ----- Index types and index signatures -----
