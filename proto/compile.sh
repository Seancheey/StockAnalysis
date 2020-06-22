#!/bin/zsh
SRC_DIR=/Users/seancheey/Documents/workspace/Python/StockAnalysis/proto/src
DST_DIR=/Users/seancheey/Documents/workspace/Python/StockAnalysis/proto/out

protoc -I $SRC_DIR --python_out=$DST_DIR --js_out=$DST_DIR $SRC_DIR/*.proto