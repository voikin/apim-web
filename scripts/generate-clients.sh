#!/bin/bash

set -e

source .env

echo "generating manager client..."
npx openapi-typescript-codegen \
  --input "https://raw.githubusercontent.com/voikin/apim-proto/gen/go/$MANAGER_VERSION/gen/openapi/apim_manager/v1/apim_manager.swagger.json" \
  --output src/api/manager \
  --client fetch
