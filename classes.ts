// ----- Classes -----
class Greeter {
	greeting: string;

	constructor(message: string) {
		this.greeting = message;
	}

	greet() {
		return "Hello, " + this.greeting;
	}
}
const greeter = new Greeter("world");
console.log(greeter.greet());

// ----- Inheritance -----
class Animal {
	move(distanceInMeters: number = 0) {
		console.log(`Animal moved ${distanceInMeters}m.`);
	}
}
class Dog extends Animal {
	bark() {
		console.log("Woof! Woof!");
	}
}
const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
// Classes inherit properties and methods from base classes.
// Here, 'Dog' is a derived class that derives from the 'Animal' base class using the 'extends' keyword. 
// Derived classes are often called subclasses, and base classes are often called superclasses.

class Animal2 {
	name: string;
	constructor(theName: string) {
		this.name = theName;
	}
	move(distanceInMeters: number = 0) {
		console.log(`${this.name} moved ${distanceInMeters}m.`);
	}
}
class Snake extends Animal2 {
	constructor(name: string) {
		super(name);
	}
	move(distanceInMeters = 5) {
		console.log("Slithering...");
		super.move(distanceInMeters);
	}
}
class Horse extends Animal2 {
	constructor(name: string) {
		super(name);
	}
	move(distanceInMeters = 45) {
		console.log("Galloping...");
		super.move(distanceInMeters);
	}
}
const sam = new Snake("Sammy the Python");
const tom: Animal2 = new Horse("Tommy the Palomino");
sam.move();
tom.move(34);
// One difference from the prior example is that each derived class that contains a constructor function
// must call 'super()' which will execute the constructor of the base class.
// What's more, before we ever access a property on 'this' in a constructor body, we have to call 'super()'.
// The example also shows how to override methods in the base class with methods that are specialized for the subclass.

// ----- Public, private, and protected modifiers -----
// We've been able to freely access the members that we declared throughout our programs.
// In TypeScript, each member is 'public' by default.
// You may still mark a member 'public' explicitly.
// We could have written the 'Animal' class from the previous section in the following way:
class Animal3 {
	public name: string;
	public constructor(theName: string) {
		this.name = theName;
	}
	public move(distanceInMeters: number) {
		console.log(`${this.name} moved ${distanceInMeters}m.`);
	}
}

// ----- ECMAScript Private Fields -----
class Animal4 {
	#name: string;
	constructor(theName: string) {
		this.#name = theName;
	}
}
// new Animal4("Cat").#name;

// ----- Understanding TypeScript's private -----
// TypeScript also has itw own way to declare a member as being marked 'private', it cannot be accessed 
// from outside of its containing class.
class Animal5 {
	private name: string;
	constructor(theName: string) {
		this.name = theName;
	}
}
// new Animal5("Cat").name;

// TypeScript is a structural type system.
// When we compare two different types, regardless of where they came from, 
// if the types of all members are compatible, then we say the types themselves are compatible. 

// However, when comparing types that have 'private' and 'protected' members, we treat these types differently.
// For two types to be considered compatible, if one of them has a 'private' member, 
// then the other must have a 'private' that originated in the same declaration. 
// The same applies to 'protected' members.
class Animal6 {
	private name: string;
	constructor(theName: string) {
		this.name = theName;
	}
}
class Rhino extends Animal6 {
	constructor() {
		super("Rhino");
	}
}
class Employee {
	private name: string;
	constructor(theName: string) {
		this.name = theName;
	}
}
let animal = new Animal6("Goat");
const rhino = new Rhino();
const employee = new Employee("Bob");

animal = rhino;
// animal = employee;

// ----- Understanding protected -----
// The 'protected' modifier acts much like the 'private' modifier with the exception that members 
// declared 'protected' can also be accessed within deriving classes.
class Person {
	protected name: string;
	constructor(name: string) {
		this.name = name;
	}
}
class Employee2 extends Person {
	private department: string;
	constructor(name: string, department: string) {
		super(name);
		this.department = department;
	}
	public getElevatorPitch() {
		return `Hello, my name is ${this.name} and I work in ${this.department}.`;
	}
}
const howard = new Employee2("Howard", "Sales");
console.log(howard.getElevatorPitch());
// console.log(howard.name);

// Notice that while we can't use 'name' from outside of 'Person', we can still use it from within an instance 
// method of 'Employee' because 'Employee' derives from 'Person'.

// A constructor may also be marked 'protected'. This means that the class cannot be instantiated outside 
// of its containing class, but can extended.
class Person2 {
	protected name: string;
	protected constructor(theName: string) {
		this.name = theName;
	}
}
class Employee3 extends Person2 {
	private department: string;
	constructor(name: string, department: string) {
		super(name);
		this.department = department;
	}
	public getElevatorPitch() {
		return `Hello, my name is ${this.name} and I work in ${this.department}.`;
	}
}
const howard2 = new Employee3("Howard2", "Sales");
// const john = new Person2("John");

// ----- Readonly modifier -----
// You can make properties readonly by using the 'readonly' keyword. 
// Readonly properties must be initialized at their declaration or in the constructor.
class Octopus {
	readonly name: string;
	readonly numberOfLegs: number = 8;
	constructor(theName: string) {
		this.name = theName;
	}
}
const dad = new Octopus("Man with the 8 strong legs");
// dad.name = "Man with the 3-piece suit";

// ----- Parameter properties -----
// Parameter properties let you create and initialize a member in one place.
// Here's a further version of the previous 'Octopus' class using a parameter property. 
class Octopus2 {
	readonly numberOfLegs: number = 8;
	constructor(readonly name: string) {}
}
const octopus = new Octopus2("Man with the 8 strong legs");
console.log(octopus.name);
// Notice how we dropped 'theName' altogether and just use the shortened 'readonly name: string' 
// parameter on the constructor to create and initialize the 'name' member.
// We've consolidated the declarations and assignment into one location.

// Parameter properties are declared by prefixing a constructor parameter with an accessibility modifier or 
// 'readonly', or both. Using 'private' for a parameter property declares and initializes a private member;
// likewise, the same is done for 'public', 'protected', and 'readonly'.
class Person3 {
	constructor(private name: string) {}
	getName() {
		return this.name;
	}
}
const person3 = new Person3("Chondan");
console.log(person3.getName());

// ----- Accessors -----
// TypeScript supports getters/setters as a way of interception access to member of an object.
// This gives you a way of having finer-grained control over how a member is accessed on each object.
const fullNameMaxLength = 10;
class Employee4 {
	private _fullName: string;

	get fullName(): string {
		return this._fullName;
	}

	set fullName(newName: string) {
		if (newName && newName.length > fullNameMaxLength) {
			throw new Error("fullName has a max length of " + fullNameMaxLength);
		}
		this._fullName = newName;
	}
}
const employee4 = new Employee4();
employee4.fullName = "Bob Smith";
console.log(employee4.fullName);

// A couple of things to note about accessors:
// First, accessors require you to set the compilter to output ECMAScript 5 or higher.
// Second, accessors with a 'get' and not 'set' are automatically inferred to be 'readonly'.
// This helpful when generating a '.d.ts' file from your code, because users of your property can see
// that they can't change it.

// ----- Static Properties -----
// We can also create static members of a class, those are visible on the class itself rather than 
// on the instances. 
// In this example, we use 'static' on the origin, at it's a general value for all grids. 
// Each instance accesses this value through prepending the name of the class.
// Similarly to prepending 'this'. in front of instance accesses, here we prepend 'Grid'. in front of 
// static accesses.
class Grid {
	static origin = { x: 0, y: 0 };
	calculateDistanceFromOrigin(point: { x: number, y: number }) {
		let xDist = point.x - Grid.origin.x;
		let yDist = point.y - Grid.origin.y;
		return Math.sqrt(xDist*xDist + yDist*yDist) / this.scale;
	}
	constructor(public scale: number) {}
}
const grid1 = new Grid(1.0);
console.log(grid1.calculateDistanceFromOrigin({ x: 10, y: 10 }));

// ----- Abstract Classes -----
// Abstract classes are base classes from which other classes may be derived. They may not be instantiated directly.
// Unlike an interface, an abstract class may contain implementation details for its members. 
// The 'abstract' keyword is used to define abstract classes as well as abstract methods within an abstract class.
abstract class Animal7 {
	abstract makeSound(): void;
	move(): void {
		console.log("roaming the earth...");
	}
}
// Method within an abstract class that are marked as abstract do not contain an implementation and 
// must be implemented in derived classes.
abstract class Department {
	constructor(public name: string) {}
	printName(): void {
		console.log("Department name: " + this.name);
	}
	abstract printMeeting(): void; // must be implemented in derived classes
}
class AccountingDepartment extends Department {
	constructor() {
		super("Accounting and Auditing"); 
	}
	printMeeting(): void {
		console.log("The Accounting Department meets each Monday at 10am.");
	}
	generateReports(): void {
		console.log("Generating accounting reports...");
	}
}
let department: Department;
// department = new Department();
department = new AccountingDepartment();
department.printName();
department.printMeeting();
// department.generateReports(); // error: departement is not of type AccountingDepartment, cannot access generateReports

// ----- Advanced Techniques -----
// --- Constructor functions ---
// When you declare a class in TypeScript, you are actually creating multiple declarations at the same time.
// The first is the type of the instance of the class.
class Greeter2 {
	static standardGreeting = "Hello, there";
	greeting: string;
	greet() {
		if (this.greeting) return "Hello, " + this.greeting;
		return Greeter2.standardGreeting;
	}
}
let greeter2: Greeter2;
greeter2 = new Greeter2();
console.log(greeter2.greet());

let greeterMaker: typeof Greeter2 = Greeter2;
greeterMaker.standardGreeting = "Hey there!";

let greeter3: Greeter2 = new greeterMaker();
console.log(greeter3.greet());

let greeter4: Greeter2;
greeter4 = new Greeter2();
console.log(greeter4.greet());

// ----- Using a class as in interface ----
// A class declaration creates two things: a type representing instances of the class and a constructor function.
// Because classes create types, you can use them in the same places you would be able to use interfaces.
class Point {
	x: number;
	y: number;
}
interface Point3d extends Point {
	z: number;
}
const point3d: Point3d =  { x: 1, y: 2, z: 3 };