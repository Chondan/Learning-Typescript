// ----- Iterators and Generators -----
// ----- Iterables -----
// An object is deemed iterable if it has an implementation for the 'Symbol.iterator' property.
// 'Symbol.iterator' function on an object is responsible for returning the list of values to iterate on.

// ----- for..of statemens -----
const someArray = [1, "string", false];
for (const entry of someArray) {
	console.log(entry);
}
// --- for..of vs. for..in statements ---
// 'for..in' returns a list of keys on the object being iterated, 
// whereas 'for..of' returns a list of values of the numeric properties of the object 
// being iterated.
const list = [4, 5, 6];
for (const i in list) {
	console.log(i);
}
// Another distinction is that 'for..in' operates on any object; it serves as a way to inspect 
// properties on this object. 'for..of' on the other hand, is mainly interested in values of iterable 
// objects.
const pets = new Set(["Cat", "Dog", "Hamster"]);
for (const pet in pets) {
	console.log(pet);
}
for (const pet of pets) {
	console.log(pet);
}