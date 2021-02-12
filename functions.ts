// ----- Typing the function -----
function add(x: number, y: number): number {
	return x + y;
}

// ----- Writing the function type -----
const myAdd: (x: number, y: number) => number = function(
	x: number,
	y: number
): number {
	return x + y;
}
// A function's type has the same two parts: the type of the arguments and the return type.

// ----- Inferring the types -----
// TypeScript compiler can figure out the type even if you only have types on one side of the equation.
// This is called 'contextual typing', a form of type inference. This helps cut down on the amount of effort 
// to keep your program typed.
const myAdd2 = function(x: number, y: number): number {
	return x + y;
}
// myAdd has the full function type
const myAdd3: (baseValue: number, increment: number) => number = function(x: number, y: number): number {
	return x + y;
}

// ----- Optional and Default Parameters ------
// The number of arguments given to a function has to match the number of parameters the function expects.
function buildName(firstName: string, lastName: string): string {
	return firstName + ' ' + lastName;
}
const myName = buildName("Chondan", "Susuwan");
console.log(myName);
// In JavaScript, every parameter is optional, and users may leave them off as they see fit. 
// When they do, their value is 'undefined'.
// We can get this functionality in TypeScript by adding a '?' to the end of parameters we want to be optional.
function buildName2(firstName: string, lastName?: string): string {
	return lastName ? firstName + ' ' + lastName : firstName;
}
const myName2 = buildName2("Chondan");
console.log(myName2);
// Any optional parameters must follow required parameters.
// Had we wanted to make the first name optional, rather than the last name, we would need to change the order 
// of parameter in the function, putting the first name last in the list.
function buildName3(firstName: string, lastName = "Smith"): string {
	return firstName + ' ' + lastName;
}
const bobName = buildName3("Bob");
console.log(bobName);
// Default-initialized parameters that come after all required parameters are treated as optional, 
// and just like optional parameters, can be omitted when calling their respective function.
// This means optional parameters and trailing default parameters will share commonality in their types.

// Unlike plain optional parameters, default-initialized parameters don't need to occur after required parameters.
// If a default parameter comes before a required parameter, users need to explicitly pass 'undefined' to get 
// the default initialize value. For example, we could write our last example with only a default initializer on 'firstName':
function buildName4(firstName = "Will", lastName: string): string {
	return firstName + ' ' + lastName;
}
const result1 = buildName4(undefined, "Smith");
console.log(result1);

// ----- Rest Parameters -----
// Required, optional, and default parameters all have one thing in common: they talk about one parameter at a time.
// Sometimes, you want to work with multiple parameters as a group, or you may not know how many parameters 
// a function will ultimately take. 
// In JavaScript, you can work with the arguments directly using the 'arguments' variable that is visible
// inside every function body. 
// In TypeScript, you can gather these arguments together into a variable:
function buildName5(firstName: string, ...restOfName: string[]): string {
	return firstName + ' ' + restOfName.join(' ');
}
const employeeName = buildName5("Joseph", "Samuel");
console.log(employeeName);

// ----- this -----
// 