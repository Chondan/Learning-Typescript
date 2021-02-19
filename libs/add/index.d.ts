declare function add(a: number, b: number): number;
declare type Player = { name: string };
declare  function greet(person: { name: string }): string;
declare namespace me {
	let name: string;
	let age: number;
}

export { add, greet, Player, me };