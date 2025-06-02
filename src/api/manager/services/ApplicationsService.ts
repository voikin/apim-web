/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { rpcStatus } from '../models/rpcStatus';
import type { v1CreateApplicationRequest } from '../models/v1CreateApplicationRequest';
import type { v1CreateApplicationResponse } from '../models/v1CreateApplicationResponse';
import type { v1DeleteApplicationResponse } from '../models/v1DeleteApplicationResponse';
import type { v1GetApplicationResponse } from '../models/v1GetApplicationResponse';
import type { v1ListApplicationsResponse } from '../models/v1ListApplicationsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApplicationsService {
    /**
     * @returns v1ListApplicationsResponse A successful response.
     * @returns rpcStatus An unexpected error response.
     * @throws ApiError
     */
    public static managerServiceListApplications(): CancelablePromise<v1ListApplicationsResponse | rpcStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/applications',
        });
    }
    /**
     * @param body
     * @returns v1CreateApplicationResponse A successful response.
     * @returns rpcStatus An unexpected error response.
     * @throws ApiError
     */
    public static managerServiceCreateApplication(
        body: v1CreateApplicationRequest,
    ): CancelablePromise<v1CreateApplicationResponse | rpcStatus> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/applications',
            body: body,
        });
    }
    /**
     * @param id
     * @returns v1GetApplicationResponse A successful response.
     * @returns rpcStatus An unexpected error response.
     * @throws ApiError
     */
    public static managerServiceGetApplication(
        id: string,
    ): CancelablePromise<v1GetApplicationResponse | rpcStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/applications/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns v1DeleteApplicationResponse A successful response.
     * @returns rpcStatus An unexpected error response.
     * @throws ApiError
     */
    public static managerServiceDeleteApplication(
        id: string,
    ): CancelablePromise<v1DeleteApplicationResponse | rpcStatus> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/applications/{id}',
            path: {
                'id': id,
            },
        });
    }
}
