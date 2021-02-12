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

// ----- this and arrow functions -----
// In JavaScript, 'this' is a varaible that' set when a function is called.
// This makes it a very powerful and flexible feature, but it comes at the cost of always having to 
// know about the context that a function is executing in.
const deck = {
	suits: ["heart", "spades", "clubs", "diamonds"],
	cards: Array(52),
	createCardPicker: function() {
		return function() {
			const pickedCard = Math.floor(Math.random() * 52); // 20
			const pickedSuit = Math.floor(pickedCard / 13); // 1
			return { suit: this.suits[pickedSuit], card: pickedCard % 13 }
		}
	},
	// Arrow functions capture the 'this' where the function is created rather than where it is invoked.
	createCardPicker2: function() {
		return () => {
			const pickedCard = Math.floor(Math.random() * 52); // 20
			const pickedSuit = Math.floor(pickedCard / 13); // 1
			return { suit: this.suits[pickedSuit], card: pickedCard % 13 }
		}
	}
}
const cardPicker = deck.createCardPicker();
const pickedCard = cardPicker.bind(deck)();
const cardPicker2 = deck.createCardPicker2();
const pickedCard2 = cardPicker2();
console.log(pickedCard);
console.log(pickedCard2);

// ----- this parameters -----
// Unfortunately, the type of 'this.suits[pickedSuit]' is still 'any'. 
// That's because 'this' comes from the function expression inside the object literal. 
// To fix this, you can provide an explicity 'this' parameter.
// 'this' parameters are fake parameters that come first in the parameter list of a function:
interface Card {
	suit: string;
	card: number;
}
interface Deck {
	suits: string[];
	cards: number[];
	createCardPicker(this: Deck): () => Card;
}
const deck2: Deck = {
	suits: ["heart", "spades", "clubs", "diamonds"],
	cards: Array(52),
	createCardPicker: function (this: Deck) {
		return () => {
			const pickedCard = Math.floor(Math.random() * 52); // 20
			const pickedSuit = Math.floor(pickedCard / 13); // 1
			return { suit: this.suits[pickedSuit], card: pickedCard % 13 }
		}
	}
}
const cardPicker3 = deck2.createCardPicker();
const pickedCard3 = cardPicker3();
console.log(pickedCard3);

// ----- this parameters in callback -----
// You can also run into errors with 'this' in callbacks, when you pass functions to a library 
// that will later call them.
// Because the library that calls your callback will call it like a normal function, 'this' will be 'undefined'.
// With some work you can use 'this' parameters to prevent errors with callbacks too. 

// ----- Overloads -----
// JavaScript is inherently a very dynamic language. 
// It's not uncommon for a single JavaScript function to return different types of objects based on the 
// shape of arguments passed in.
const suits = ["heard", "spades", "clubs", "diamonds"];
function pickCard(x: any): any {
	if (typeof x == "object") {
		const pickedCard = Math.floor(Math.random() * x.length);
		return pickedCard;
	} else if (typeof x == "number") {
		const pickedSuit = Math.floor(x / 13);
		return { suit: suits[pickedSuit], card: x % 13 };
	}
}
const myDeck = [
	{ suit: "diamonds", card: 2 },
    { suit: "spades", card: 10 },
    { suit: "hearts", card: 4 },
];
const pickedCard4 = myDeck[pickCard(myDeck)];
console.log(pickedCard4);
const pickedCard5 = pickCard(15);
console.log(pickedCard5);
// Here, the 'pickCard' function will return two different things based on what the user has passed in.
// But how do we describe this to the type system?
// The answer is to supply multiple function types for the same function as a list of overloads.
// This list is what the compiler will use to resolve function calls. 
function pickCard2(x: { suit: string; card: number }[]): number;
function pickCard2(x: number): { suit: string; card: number };
function pickCard2(x: any): any {
	if (typeof x == "object") {
		const pickedCard = Math.floor(Math.random() * x.length);
		return pickedCard;
	} else if (typeof x == "number") {
		const pickedSuit = Math.floor(x / 13);
		return { suit: suits[pickedSuit], card: x % 13 };
	}
}
// With this change, the overloads now give us type checked calls to the 'pickCard' function.
// In order for the compiler to pick the correct type check, it follows a similar process to the 
// underlying JavaScript. 
// It looks at the overload list and, proceeding with the first overload, attempts to call the function 
// with the provided parameters. If it finds a match, it picks this overload as the correct overload.
// For this reason, it's customary to order overloads from most specific to least specific.