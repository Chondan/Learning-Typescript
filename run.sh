directory="HandbookReference"
filename="iteratorsAndGenerators"
flag="--target ES5 --experimentalDecorators --emitDecoratorMetadata"

tsc ${flag} "./${directory}/${filename}.ts";
node "./${directory}/${filename}.js";