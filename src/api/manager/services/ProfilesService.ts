/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ManagerServiceAddProfileBody } from '../models/ManagerServiceAddProfileBody';
import type { rpcStatus } from '../models/rpcStatus';
import type { v1AddProfileResponse } from '../models/v1AddProfileResponse';
import type { v1DeleteProfileResponse } from '../models/v1DeleteProfileResponse';
import type { v1DiffProfilesResponse } from '../models/v1DiffProfilesResponse';
import type { v1GetProfileByIDResponse } from '../models/v1GetProfileByIDResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfilesService {
    /**
     * @param applicationId
     * @param body
     * @returns v1AddProfileResponse A successful response.
     * @returns rpcStatus An unexpected error response.
     * @throws ApiError
     */
    public static managerServiceAddProfile(
        applicationId: string,
        body: ManagerServiceAddProfileBody,
    ): CancelablePromise<v1AddProfileResponse | rpcStatus> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/applications/{applicationId}/profiles',
            path: {
                'applicationId': applicationId,
            },
            body: body,
        });
    }
    /**
     * @param applicationId
     * @param oldProfileId
     * @param newProfileId
     * @returns v1DiffProfilesResponse A successful response.
     * @returns rpcStatus An unexpected error response.
     * @throws ApiError
     */
    public static managerServiceDiffProfiles(
        applicationId: string,
        oldProfileId?: string,
        newProfileId?: string,
    ): CancelablePromise<v1DiffProfilesResponse | rpcStatus> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/applications/{applicationId}/profiles/diff',
            path: {
                'applicationId': applicationId,
            },
            query: {
                'oldProfileId': oldProfileId,
                'newProfileId': newProfileId,
            },
        });
    }
    /**
     * @param id
     * @returns v1GetProfileByIDResponse A successful response.
     * @returns rpcStatus An unexpected error response.
     * @throws ApiError
     */
    public static managerServiceGetProfileById(
        id: string,
    ): CancelablePromise<v1GetProfileByIDResponse | rpcStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/profiles/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns v1DeleteProfileResponse A successful response.
     * @returns rpcStatus An unexpected error response.
     * @throws ApiError
     */
    public static managerServiceDeleteProfile(
        id: string,
    ): CancelablePromise<v1DeleteProfileResponse | rpcStatus> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/profiles/{id}',
            path: {
                'id': id,
            },
        });
    }
}
