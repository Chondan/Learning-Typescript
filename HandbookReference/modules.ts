/// <reference path="typings.d.ts" />

import '../libs/my-module/my-module';
import { myModule } from '../libs';
import * as _ from 'lodash';

console.log(myModule.num, myModule.name);

// ----- Working with Other JavaScript Libraries -----
// We call declarations that don't define an implementation "ambient".
// --- Ambient Modules ---
// In Node.js, most tasks are accomplished by loading one or more modules. 
// We could define each module in its own '.d.ts' file with top-level export declarations, 
// but it's more convenient to write them as one larger '.d.ts' file.
const array = [1, 2, 3, 4];
const evens = _.remove<number>(array, n => n % 2 === 0);
console.log(evens);

// ----- Shorthand ambient modules -----
// If you don't want to take the time to write out declarations before using a new module, you can use a 
// shorthand declaration to get started quickly.

// ----- Wildcard module declarations -----
// Some module loaders such as 'SystemJS' and 'AMD' allow non-JavaScript content to be imported.
// These typically use a prefix or suffix to indicate the special loading semantics.