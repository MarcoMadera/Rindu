#!/bin/bash

if [ -d 'coverage' ]; then 
  echo 'Opening coverage report...'
  npx http-server -c-1 coverage/lcov-report -o
else 
  echo 'Coverage report not found. Generating report...'
  npm run test:ci
  echo 'Opening coverage report...'
  npx http-server -c-1 coverage/lcov-report -o
fi