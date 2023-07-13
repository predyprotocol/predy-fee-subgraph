#!/bin/bash

# generate code
rm -rf generated
graph codegen

# copy generated code to suitable folders
counter=0
for dir in $(ls -d generated/*/)
do
  if [ $counter -eq 0 ]; then
    mkdir generated/UniswapV3Pool
    mkdir generated/GammaShortStrategy
    for file in $(ls $dir)
    do
      cp $dir$file generated/UniswapV3Pool/
      cp $dir$file generated/GammaShortStrategy/
    done
  fi
  rm -rf $dir
  ((counter++))
done