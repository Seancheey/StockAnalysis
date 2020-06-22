#!/bin/zsh
PROJECT_DIR=/Users/seancheey/Documents/workspace/Python/StockAnalysis
DST_DIR=/Users/seancheey/Documents/workspace/Python/StockAnalysis

protoc -I $PROJECT_DIR --python_out=$DST_DIR --js_out=$DST_DIR/proto/js $PROJECT_DIR/proto/*.proto