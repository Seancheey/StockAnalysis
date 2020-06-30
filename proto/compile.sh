#!/bin/zsh
PROJECT_DIR=/Users/seancheey/Documents/workspace/Python/StockAnalysis
JS_DIR=${PROJECT_DIR}/frontend/src/app/service

protoc -I $PROJECT_DIR --python_out=$PROJECT_DIR --js_out=import_style=commonjs,binary:$JS_DIR ${PROJECT_DIR}/proto/*.proto