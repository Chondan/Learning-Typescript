filename="enums"

tsc --target ES2016 "${filename}.ts";
node "${filename}.js";