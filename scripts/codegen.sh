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
    mkdir generated/AggregatorInterface
    for file in $(ls $dir)
    do
      cp $dir$file generated/UniswapV3Pool/
      cp $dir$file generated/GammaShortStrategy/
      cp $dir$file generated/AggregatorInterface/
    done
  fi
  rm -rf $dir
  ((counter++))
done