#!/bin/bash

source ../.env

find "$COPY_TO_PATH" -type f -name "*.zip" -exec sh -c 'unzip "$1" -d "${1%.zip}"' _ {} \;
