// ----- Mixins -----
// Along with traditional OO hierarchies, another popular way of building up classes from reusable
// components is to build them by combining simpler partial classes.

// ----- How Does A Mixin Work -----
// To get started, we'll need a class which will have the mixin's applied on top of:
class Sprite {
	name = "";
	x = 0;
	y = 0;

	constructor(name: string) {
		this.name = name;
	}
}
// Then you need a type and a factory function which returns a class expression extending the base class.
type Constructor = new (...args: any[]) => {};
// This mixin adds a scale property, with getters and setters for changing it with an encapsulated 
// private property.
function Scale<TBase extends Constructor>(Base: TBase) {
	return class Scaling extends Base {
		_scale = 1;

		setScale(scale: number) {
			this._scale = scale;
		}

		get scale(): number {
			return this._scale;
		}
	}
}
// With these all set up, then you can create a class which represents the base class with mixins applied.
const EightBitSprite = Scale(Sprite);
const flappySprite = new EightBitSprite("Bird");
flappySprite.setScale(0.8);
console.log("scale", flappySprite.scale);

// ----- Constrained Mixins -----
// In the above form, the mixin's have no underlying knowledge of the class which can make it hard 
// to create the design you want.
// To model this, we modify the original constructor type to accept a generic argument.
type GConstructor<T = {}> = new (...args: any[]) => T;
// This allows for creating classes which only work with constrained base classes.
type Positionable = GConstructor<{ setPos: (x: number, y: number) => void }>;
type Spritable = GConstructor<typeof Sprite>;
type Loggable = GConstructor<{ print: () => void }>;
// Then you have can create mixins which only work when you have a particular base to build on.
function Jumpable<TBase extends Positionable>(Base: TBase) {
	return class Jumpable extends Base {
		jump() {
			this.setPos(0, 20);
		}
	}
};
class CannotJump {
	x: number;
	y: number;
	constructor() {
		this.x = 0;
		this.y = 0
	}
	setPos(x: number, y: number) {
		this.x = x;
		this.y = y;
		console.log(this.x, this.y);
	}
}
const jumpable = Jumpable<Positionable>(CannotJump);
const jumpableInstance = new jumpable();
jumpableInstance.jump();

// ----- Alternative Pattern -----
class Kangaroo {
	jump() {}
}
class Duckable {
	duck() {}
}
class Sprite2 {
	x = 0;
	y = 0;
}
interface Sprite2 extends Kangaroo, Duckable {};

applyMixins(Sprite2, [Kangaroo, Duckable]);

let player = new Sprite2();
player.jump();
console.log(player.x, player.y);

// This can live anywhere in your codebase:
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}
// This pattern relies on the compiler, and more on your codebase to ensure both runtime and 
// type-system are correctly kept in sync.

// ----- Constraints -----
// The mixin pattern is supported natively inside the TypeScript compiler by code flow analysis. 
// THere are a few cases where you can hit the edges of the native support.
// 1. Decorators and Mixins -> You cannot use decorators to provide mixins via code flow analysis.
// 2. Static Property Mixins