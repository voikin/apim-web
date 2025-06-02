/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { sharedv1Operation } from './sharedv1Operation';
import type { v1Edge } from './v1Edge';
import type { v1PathSegment } from './v1PathSegment';
import type { v1Transition } from './v1Transition';
export type v1APIGraph = {
    segments?: Array<v1PathSegment>;
    edges?: Array<v1Edge>;
    operations?: Array<sharedv1Operation>;
    transitions?: Array<v1Transition>;
};

