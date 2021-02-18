directory="HandbookReference"
filename="advancedTypes"
option="--target ES2016"
flag="--strictNullChecks"

tsc "${flag}" "./${directory}/${filename}.ts";
node "./${directory}/${filename}.js";