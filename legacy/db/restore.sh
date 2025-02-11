#!/bin/bash

source ../../.env

psql --dbname="$DATABASE_URL" -f ./output/out.sql
