// ----- Enums -----
// Enums are one of the few features TypeScript has which is not a type-level extension of JavaScript.
// Enums allow a developer to define a set of named constants. 
// Using enums can make it easier to document intent, or create a set of distinct cases.
// TypeScript provides both numeric and string-based enums.

// ---- Numeric enums ----
enum Direction {
	Up = 1,
	Down,
	Left,
	Right,
}
// Above, we have a numeric enum where 'Up' is initialized with '1'. 
// All of the following members are auto incremented from that point on.

// Using an enum is simple: just access any member as a property off the enum itself, and declare types using 
// the name of the enum:
enum UserResponse {
	No = 0,
	Yes = 1,
}
function respond(recipient: string, message: UserResponse): void {
	console.log(`${recipient}'s respond: ${message}`);
}
respond("Princess Caroline", UserResponse.Yes);

// Numeric enums can be mixed in computed and constant members. 
// The short story is, enums without initializers either need to be first, or have to come after numeric
// enums initialized with numerice constants or other constant enum members.
enum E {
	A = Math.floor(Math.random() * 10),
	B,
}

// ----- String enums -----
// String enums are a similar conecpt, but have some subtle runtime differences. 
// In a string enum, each member has to be constant-initialized with a string literal, or with another string 
// enum member.
enum Direction2 {
	Up = "UP",
	Down = "DOWN",
	Left = "LEFT",
	Right = "RIGHT",
}
// While string enums don't have auto-incrementing behavior, string enums have the benefit that they 
// 'serialize' well.
// If other words, if you were debugging and had to read the runtime value of a numeric enum, 
// the value if often opaques - it doesn't convey any useful meaning on its own, 
// string enums allow you to give a meaningful and readable value ahen your code runs, independent of the 
// name of the enum member itself.

// ----- Heterogeneous enums -----
// Technically enums can be mixed with string and numeric members, but it's not clear why you would ever want to do so:
enum BooleanLikeHeterogenousEnum {
	No = 0,
	Yes = "YES",
}

// ----- Computed and constant members -----
enum FileAcess {
	// constant members
	None,
	Read = 1 << 1,
	Write = 1 << 2,
	ReadWrite = Read | Write,
	// computed member
	G = "123".length,
}
console.log(FileAcess.ReadWrite);

// ----- Union enums and enum member types -----
// There is a special subset of constant enum members that aren't calculated: literal enum members.
// A literal enum member is a constant enum member with no initialized value, or with values that are initialized to
// - any string literal
// - any numeric literal
// - a unary minus applied to any numeriv literal
// When all members in an enum have literal enum values, some special semantics come to play.
// The first is that enum members also become types as well! 
// For example, we can say that certain members can only have the vlaue of an enum member.
enum ShapeKind {
	Circle,
	Square,
}
interface Circle {
	kind: ShapeKind.Circle;
	radius: number;
}
interface Square {
	kind: ShapeKind.Square;
	sideLength: number;
}
const c: Circle = {
	kind: ShapeKind.Square,
	radius: 100,
}
// The other change is that enum types themselves effectively become a union of each enum member.
// With union enums, the type system is able to leverage the fact that it knows the exact set of values that 
// exist in the enum itself.
// Because of that, TypeScript can catch bugs where we might be comparing values incorrectly.
enum E {
	Foo,
	Bar,
}
function f(x: E) {
	if (x !== E.Foo || x !== E.Bar) {}
}

// ----- Enums at runtime -----
// Enums are real objects that exist at runtime.
enum E2 {
	X,
	Y,
	Z,
}
function f2(obj: { X: number }) {
	return obj.X;
}
console.log(f2(E2));

// ----- Enums at compile time -----
// Even though Enums are real object that exist at runtime, 
// the 'keyof' keyword works differently than you might expect for typical objects.
// Instead, use 'keyof typeof' to get a Type that represents all Enums keys as strings.
enum LogLevel {
	ERROR,
	WARN,
	INFO,
	DEBUG,
}
// This is equivalent to:
// type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
	const num = LogLevel[key];
	if (num <= LogLevel.WARN) {
		console.log("Log level key is:", key);
		console.log("Log level value is:", num);
		console.log("Log level message is:", message);
	}
}
printImportant("ERROR", "This is a message");

// ----- Reverse mappings -----
// In addition to creating an object with property names for members, numeric enums members also 
// get a reverse mapping from enum values to enum names.
enum Enum {
	A = "B",
	B = "anotherB"
}
const a = Enum.A;
const nameOfA = Enum[a];
console.log(a, nameOfA);
// References to other enum members are always emitted as property accesses and never inlined.
// Keep in mind that string enum members do not get a reverse mapping generated at all.

// ----- const enums -----
// In most cases, enums are a perfectly valid solution.
// However sometimes requirements are tighter. 
// To avoid paying the cost of extra generated code and additional indirection when accessing enum values, 
// it's possible to use 'const' enums.
const enum Enum2 {
	A = 1,
	B = A * 2
}

// Const enums can only use constant enum expressions and unlike regular enums they are completely removed 
// during compilation. 
// Const enum members are inlined at use sites. This is possible since const enums cannot have computed members.
const enum Direction3 {
	Up,
	Down,
	Left,
	Right,
}
const directions = [
	Direction3.Up,
	Direction3.Down,
	Direction3.Left,
	Direction3.Right,
];
console.log(directions);

// ----- Ambient enums -----
// Ambient enums are used to describe the shape of already existing enum types.
declare enum X {
	A = 1,
	B,
	C = 2,
}