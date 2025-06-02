/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { rpcStatus } from '../models/rpcStatus';
import type { v1ExportOpenAPISpecRequest } from '../models/v1ExportOpenAPISpecRequest';
import type { v1ExportOpenAPISpecResponse } from '../models/v1ExportOpenAPISpecResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OpenApiSpecService {
    /**
     * @param body
     * @returns v1ExportOpenAPISpecResponse A successful response.
     * @returns rpcStatus An unexpected error response.
     * @throws ApiError
     */
    public static managerServiceExportOpenApiSpec(
        body: v1ExportOpenAPISpecRequest,
    ): CancelablePromise<v1ExportOpenAPISpecResponse | rpcStatus> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/export-openapi-spec',
            body: body,
        });
    }
}
