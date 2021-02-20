import "reflect-metadata";

// ----- Decorators -----
// Decorators provide a way to add both annotations and a meta-programming syntax for class declarations
// and members.

// A decorator is a special kind of declaration that can be attached to a 'class declaration', 'method', 
// 'accessor', 'property', or 'parameter'.
// Decorators use the form '@expression', where 'expression' must evaluate to a function that 
// will be called at runtime with information about the decorated declaration.
function sealed(target: any) {
	console.log("seald");
}

// ----- Decorator Factories -----
// If we want to customize how a decorator is applied to a declaration, we can write a decorator factory.

// ----- Decorator Composition -----
// When multiple decorators apply to a single declaration, their evaluation is similar to 'function composite in mathematics'.
function f() {
	console.log("f(): evaluated");
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const parameters = ["target", "propertyKey", "descriptor"];
		for (const k in arguments) {
			console.log(parameters[k] + ": ", arguments[k]);
		}
		console.log("f(): called");
	}
}
function g() {
	console.log("g(): evaluated");
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		console.log("g(): called");
	}
}
function myFunc(target: any) {
	console.log("myFunc");
}

@myFunc
@sealed
class myClass {
	@f()
	@g()
	method() {
		console.log("Method");
	}
}

// ----- Class Decorator -----
// A Class Decorator is declared just before a class declaration.
// The class decorator is applied to the constructor of the class and can be used to observe, 
// modify, or replace a class definition.
function sealed2(constructor: Function) {
	constructor.prototype.hi = () => "Hi";
	Object.seal(constructor);
	Object.seal(constructor.prototype);
}

@sealed2
class Person4 {
	private name: string;
	[propName: string]: any;
	constructor(name: string) { this.name = name; }
	getName() { return this.name; }
	greet() {}
}
Person4.prototype.greet = function() {
	console.log(`Hi, My name is ${this.getName()}`);
};
// Person4.prototype.hello = () => "Hello"; // cannot added because the class is seald.

const p = new Person4("Chondan");
p.greet();
console.log(p.hello && p.hello());
console.log(p.hi && p.hi());

// Next we have an example of how to overried the constructor.
function classDecorator<T extends { new (...arg: any[]): {} }>(
	constructor: T
) {
	return class extends constructor {
		newProperty = "new property";
		hello = "overried";
	};
}

@classDecorator
class Greeter3 {
	property = "property";
	hello: string;
	constructor(m: string) {
		this.hello = m;
	}
}
console.log(new Greeter3("World"));

// ----- Method Decorators -----
// The decorator is applied to the Property Descriptor for the method, and can be used to observe, 
// modify, or replace a method definition.
// The expression for the method decorator will be called as a function at runtime.
function enumerable(value: boolean) {
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		descriptor.enumerable = value;
	}
}

class Greeter4 {
	greeting: string;
	constructor(message: string) {
		this.greeting = message;
	}

	@enumerable(false)
	greet() {
		return "Hello, " + this.greeting;
	}
}
console.log(new Greeter4("World"));
// Check enumerable
for (const x in new Greeter4("Hi")) {
	console.log("------------->", x);
}

// ----- Accessor Decorators -----
// The accessor decorator is applied to the Property Descriptor for the accessor and can be 
// used to observe, modify, or replace an accessor's definitions. 
function configurable(value: boolean) {
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		descriptor.configurable = value;
	}
}

class Point2 {
	private _x: number;
	private _y: number;
	constructor(x: number, y: number) {
		this._x = x;
		this._y = y;
	}

	@configurable(false)
	get x() {
		return this._x;
	}
}
const point2 = new Point2(10, 20);
console.log(point2.x);

// ----- Property Decorators -----
// A Property Decorator is declared just before a property declaration.
// The expression for the property decorator will be called as a function at runtime, with the 
// following two arguments.
// 1. Either the construcotr function of the class for a static member, or the prototype of the class
// for an instance member.
// 2. The name of the member.
function uppercase(value: boolean) {
	return function(target: any, name: string) {
		console.log(target, name);
	}
}

class Greeter5 {

	@uppercase(true)
	greeting: string;

	constructor(message: string) {
		this.greeting = message;
	}

	@enumerable(false)
	greet() {
		return "Hello, " + this.greeting;
	}
}

console.log(new Greeter5("World").greeting);

// ----- Parameter Decorators -----
// The parameter decorator is applied to the function for a class constructor or method declaration.
const requiredMetadatKey = "required";
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
	const existingRequiredParameter: number[] = 
		Reflect.getOwnMetadata(requiredMetadatKey, target, propertyKey) || [];
	existingRequiredParameter.push(parameterIndex);
	Reflect.defineMetadata(
		requiredMetadatKey,
		existingRequiredParameter,
		target,
		propertyKey
	);
}

function validate(target: any, propertyName: string, descriptor: PropertyDescriptor) {
	const method = descriptor.value;
	descriptor.value = function() {
		const requiredParameters: number[] = Reflect.getOwnMetadata(
			requiredMetadatKey,
			target,
			propertyName
		);
		if (requiredParameters) {
			console.log('--------------------->', arguments.length, requiredParameters);
			for (let parameterIndex of requiredParameters) {
				if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
					throw new Error("Missing required argument.");
				}
			}
		}
		return method!.apply(this, arguments);
	}
}

class Greeter6 {
	greeting: string;
	constructor(message: string) {
		this.greeting = message;
	}

	@validate
	greet(@required name: string, lname: string) {
		return "Hello " + name + ' ' + lname + ", " + this.greeting;
	}
}
console.log(new Greeter6("How are you?").greet("Chondan", "Susuwan"));
// The '@required' decorator adds a metadata entry that marks the parameter as required.
// The '@validate' decorator then wraps the existing 'greet' method in a function that validates
// the arguments before invoking the original method.

// When `emitDecoratorMetadata` flag is enabled, as long as the 'reflect-metadata' library has 
// been imported, additional desing-time type information will be exposed at runtime.
function myValidate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
	const set = descriptor.set;
	descriptor.set = function(value: T) {
		const type = Reflect.getMetadata("design:type", target, propertyKey);
		console.log("type ---------------->", type);
		if (!(value instanceof type)) {
			throw new TypeError("Invalid type.");
		}
		set!.call(target, value);
	}
}

interface Point3 {
	x: number;
	y: number;
}

class Line {
	private _p0: Point3;

	constructor(p0: Point3, p1: Point3) {
		this._p0 = p0;
	}

	get p0() {
		return this._p0;
	}
	@myValidate
	set p0(value: Point3) {
		this._p0 = value;
	}
}
const l = new Line({ x: 0, y: 0 }, { x: 10, y: 10 });
l.p0 = { x: 1, y: 1 };
// The TypeScript compiler will inject desing-time type information using the '@Reflect.metadata'
// decorator.