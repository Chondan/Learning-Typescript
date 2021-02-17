// ----- Literal Types -----
// A literal is more concrete sub-type of a collection type.
// What this means is that 'Hello World' is a string, but a string is not 'Hello World' inside the type system.

// There are three sets of literal types available in TypeScript today: strings, numbers, and booleans; 
// by using leteral types you can allow an exact value which a string number, or boolean must have.

// ----- Literal Narrowing -----
// When you declare a variable via 'var' or 'let', you are telling the compiler that there is the chance that
// this varaible will change its contens. 
// In contrast, usgin 'const' to declare a variable will inform TypeScript that this object will never change.
const helloWorld = "Hello World";
let hiWorld = "Hi World";
// The process of going from an infinite number of potential cases (there are an infinite number of possible string values)
// to a smaller, finite number of potential case is called narrowing.

// ----- String Literal Types -----
// In practice string literal types combine nicely with union types, type guards, and type aliases. 
// You can use these features together to get enum-like behavior with strings.
type Easing = "ease-in" | "ease-out" | "ease-in-out";
class UIElement {
	animate(dx: number, dy: number, easing: Easing) {
		if (easing === "ease-in") {}
		else if (easing === "ease-out") {}
		else if (easing === "ease-in-out") {}
	}
}
const button = new UIElement();
button.animate(0, 0, "ease-in");
// You can pass any of the three allowed strings, but any other string will give the error.

// ----- Numeric Literal Types -----
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
	return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}
// A common case for their use is for describing config values:
interface MapConfig {
	lng: number;
	lat: number;
	tileSize: 8 | 16 | 32;
}

// ----- Boolean Literal Types -----
// TypeScript also has boolean literal types. You might use these to constrain object values whose 
// properties are interrelated.
interface ValidationSuccess {
	isValid: true;
	reason: null;
}
interface ValidationFailure {
	isValid: false;
	reason: string;
}
type ValidationResult = ValidationSuccess | ValidationFailure;