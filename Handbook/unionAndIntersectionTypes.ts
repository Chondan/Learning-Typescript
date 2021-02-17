// ----- Unions and Intersection Types -----
// Intersection and Union types are one of the ways in which you can compose types.

// ----- Union Types -----
// Occasionally, you'll run into a library that expects a parameter to be either a 'number' or a 'string'.
function padLeft(value: string, padding: any) {
	if (typeof padding === "number") {
		return Array(padding + 1).join(" ") + value;
	}
	if (typeof padding === "string") {
		return padding + value;
	}
	throw new Error(`Expected string or number, got '${typeof padding}'.`);
}
console.log(padLeft("Hello World", 4));
// console.log(padLeft("Hello World", true));
// The problem with 'padLeft' in the above example is that is 'padding' parameter is typed as 'any'.
// That means that we can call it with an argument that's neither a 'number' nor a 'string', 
// but TypeScript will be okay with it.

// Instead of 'any', we can use a union type for the 'padding' parameter:
function padLeft2(value: string, padding: string | number) {
	if (typeof padding === "number") {
		return Array(padding + 1).join(" ") + value;
	}
	if (typeof padding === "string") {
		return padding + value;
	}
	throw new Error(`Expected string or number, got '${typeof padding}'.`);
}
console.log(padLeft2("Hello World", 4));
// A union type describes a value that can be one of several types. 
// We use the vertical bar '|' to separate each type.

// ----- Unions with Common Fields -----
// If we have a value that is a union type, we can only access members that are common to all types in the union.
interface Bird {
	fly(): void;
	layEggs(): void;
}
interface Fish {
	swim(): void;
	layEggs(): void;
}
function getSmallPet(): Bird | Fish {
	const bird: Bird =  { fly() {}, layEggs() {} };
	const fish: Fish = { swim() {}, layEggs() {} };
	return Math.random() > 0.5 ? bird : fish;
}
const pet = getSmallPet();
pet.layEggs();
// pet.swim();

// ----- Discriminating Unions -----
// A common technique for working with unions is to have a single field which uses literal types 
// which you can use to let TypeScript narrow down the possible current type. 
type NetworkLoadingState = {
	state: "loading";
};
type NetworkFailedState = {
	state: "failed";
	code: number;
};
type NetworkSuccessState = {
	state: "success";
	response: {
		title: string;
		duration: string;
		summary: string;
	};
};

// Create a type which represents only one of the above types but you aren't sure which it is yet. 
type NetworkState = NetworkLoadingState | NetworkFailedState | NetworkSuccessState;

function logger(state: NetworkState): string {
	switch (state.state) {
		case "loading":
			return "Downloading...";
		case "failed":
			return `Error ${state.code} downloading`;
		case "success":
			return `Downloaded ${state.response.title} - ${state.response.summary}`;
	}
}
console.log(logger({ state: "failed", code: 404 }));

// ----- Union Exhaustiveness checking -----
// We would like the compiler to tell us when we don't cover all variants of the discriminated union.
// For example, if we add 'NetworkFromCachedState' to 'NetworkState', we need to update 'logger' as well:
type NetworkFromCachedState = {
	state: "from_cache";
	id: string;
	response: NetworkSuccessState["response"];
};
type NetworkState2 = NetworkLoadingState | NetworkFailedState | NetworkSuccessState | NetworkFromCachedState;
function logger2(s: NetworkState2): string {
	switch (s.state) {
		case "loading":
			return "Downloading...";
		case "failed":
			return `Error ${s.code} downloading`;
		case "success":
			return `Downloaded ${s.response.title} - ${s.response.summary}`;
	}
}
// There are two ways to do this. The first is to turn on '--strictNullChecks' and specify a return type:

// Because the 'switch' is no longer exhausive, TypeScript is aware that the function could sometimes return 'undefined'.
// If you have an explicit return type 'string', then you will get an error that the return type is 
// actually 'string | undefined'.
// However, this method is quite subtle and, besides, '--strictNullChecks' does not always work with old code.

// The second method uses the 'never' type that the compiler uses to check for exhausiveness:
function assertNever(x: never): never {
	throw new Error("Unexpected object: " + x);
}
function logger3(s: NetworkState2): string {
	switch (s.state) {
		case "loading":
			return "Downloading...";
		case "failed":
			return `Error ${s.code} downloading`;
		case "success":
			return `Downloaded ${s.response.title} - ${s.response.summary}`;
		default:
			return assertNever(s);
	}
}
// Here, 'assertNever' checks that 's' is of type 'never' - the type that's left after all other cases have 
// been removed. 
// If you forgot a case, then 's' will have a real type and you will get a type error.
// This method requires you to define an extra function, but it's much more obvious when you forget it 
// because the error message includes the missing type name.

// ----- Intersection Types -----
// Intersection types are closely related to union types, but they are used very differently. 
// An intersection type combines multilple types into one. 
// This allow you to add together existing types to get a single type that has all the features you need.
// For example, if you had networking requrests with consistent error handling then you could separate out  
// the error handling into its own type which is merged with types which correspond to a single response type.
interface ErrorHandling {
	success: boolean;
	error?: { message: string };
}
interface ArtworksData {
	artworks: { title: string }[];
}
interface ArtistsData {
	artists: { name: string }[];
}
// These interfaces are composed to have consisten error handling, and their own data.
type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

const handleArtistsResponse = (response: ArtistsResponse) => {
	if (response.error) {
		console.error(response.error.message);
		return;
	}
	console.log(response.artists);
}