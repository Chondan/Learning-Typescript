# TypeScript

## Note
- 'declare' keyword
- any
- rest parameters
- '--noImplicitThis' flag
- '--strictNullChecks' flag
- ambient enums -> https://stackoverflow.com/questions/28818849/how-do-the-different-enum-variants-work-in-typescript
- type vs interface -> https://blog.logrocket.com/types-vs-interfaces-in-typescript/
- fluent API pattern
- `Object.freeze()` -> A frozen object can no longer be changed.
- `Object.seal()` -> preventing new properties from being added to it and marking all existing properties as non-configurable. 
	- Values of present properties can still be changed as long as they are writable.
- JavaScript Object Properties -> https://www.javascripttutorial.net/javascript-object-properties/
	- `configurable` -> determines wheter a property can be redefined or removed via `delete` operator.
	- `enumerable` -> indicates that if a property will be returned in the `for...in` loop.
	- `writable` -> specifies that the value of a property can be changed.
	- `value` -> contains the actual value of property.
- `reflect-metadata` -> https://www.npmjs.com/package/reflect-metadata
- Object
	- `Object.getOwnPropertyNames()` -> returns an array of all properties (including non-enumerable properties except for those which use Symbol) found directly in a given object.
	- `Object.getOwnPropertyDescriptor()` -> returns an object describing the configuration of a specific property on a given object.