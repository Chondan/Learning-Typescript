directory="HandbookReference"
filename="utilityTypes"
flag="--strictNullChecks"

option="--target ES2016"

tsc "${flag}" "./${directory}/${filename}.ts";
node "./${directory}/${filename}.js";