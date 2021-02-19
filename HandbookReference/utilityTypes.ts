// ----- Utility Types -----
// TypeScript provides several utility types to facilitate common type transformations.

// ----- Partial<Type> -----
// Constructs a type with all properties of 'Type' set to optional.
interface Todo {
	title: string;
	description: string;
	completed: boolean;
}
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>): Todo {
	return { ...todo, ...fieldsToUpdate };
}
const todo1 = {
  title: "organize desk",
  description: "clear clutter",
  completed: false
};
const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
console.log(todo2);

// ----- Required<Type> -----
// Constructs a type consisting of all properties of 'Type' set to required. The opposite of 'Partial'.
interface Props {
	a?: number;
	b?: string;
}
type PropsRequired = Required<Props>;

// ----- Readonly<Type> -----
// Constructs a type will all properties of 'Type' set to 'readonly'.
type MyReadonly<T> = {
	readonly [K in keyof T]: T[K];
}
type ReadonlyTodo = MyReadonly<Todo>;
type ReadonlyTodo2 = Readonly<Todo>;

// ----- Record<Keys, Type> ---
// Construts an object type whose property keys are 'Keys' and whose property values are 'Type'.
type MyRecord<K extends string | number, T> = {
	[P in K]: T
}
interface PageInfo {
	title: string;
}
type Page = "home" | "about" | "contact";
type MyPage = Record<Page, PageInfo>;

// ----- Pick<Type, Keys> -----
// Constructs a type be picking the set of properties 'Keys' from 'Type'.
type MyPick<T, K extends keyof T> = {
	[P in K]: T[P]
}
type TodoPreview = MyPick<Todo, "title">;

// ----- Omit<Type, Keys> -----
// Constructs a type by picking all properties from 'Type' and then removing 'Keys'.
type MyExclude<A, B> = A extends B ? never : A;
type MyOmit<T, K extends string | number | symbol> = {
	[P in MyExclude<keyof T, K> ]: T[P]
}
type OmitDescription = MyOmit<Todo, "description">;

// ----- Exclude<Type, ExcludeUnion> -----
// Constructs a type by excluding from 'Type' all uion members that are assignable to 'ExcludedUnion'.
type T0 = Exclude<"a" | "b" | "c", "a">;

// ----- Extract<Type, Unions> -----
// Constructs a type by extracting from 'Type' all union members that are assignable to 'Union'.
type T1 = Extract<"a" | "b" | "c", "a" | "f">;

// ----- NonNullable<Type> -----
// Constructs a type by excluding 'null' and 'undefined' from 'Type'.
type T2 = NonNullable<string | number | null | undefined>;

// ----- Parameters<Type> -----
// Constructs a tuple type from the types used in the parameters of a function type 'Type'.
type T3 = Parameters<(s: string) => void>;

// ----- ReturnType<Type> -----
// Constructs a type consisting of the return type of function 'Type'.
type T4 = ReturnType<() => { a: number, b: string }>;

// ----- InstanceType<Type> -----
// Constructs a type consisting of the instance type of a constructor function in 'Type'.
class C {
	x = 0;
	y = 0; 
}
type T5 = InstanceType<typeof C>;

// ----- ThisParameterType<Type> -----
// Extracts the type of the 'this' parameter for a function type, or 'unknown' if the function 
// type has no 'this' parameter.
function toHex(this: Number) {
	return this.toString(16);
}
function numberToString(n: ThisParameterType<typeof toHex>) {
	return toHex.apply(n);
}

// ----- OmitThisParameter<Type> -----
// Removes the 'this' parameter from 'Type'.
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
console.log(fiveToHex());