directory="Handbook"
filename="generics"

tsc --target ES2016 "./${directory}/${filename}.ts";
node "./${directory}/${filename}.js";