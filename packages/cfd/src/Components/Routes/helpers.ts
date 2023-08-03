import { matchPath } from 'react-router';
import { routes } from '@deriv/shared';
import { TRouteConfig } from '../../types/common-prop-types';

export const normalizePath = (path: string) => (/^\//.test(path) ? path : `/${path || ''}`); // Default to '/'

export const findRouteByPath = (path: string, routes_config: TRouteConfig[]) => {
    let result: TRouteConfig | undefined;

    routes_config.some(route_info => {
        let match_path;
        try {
            match_path = matchPath(path, route_info);
        } catch (e) {
            if (/undefined/.test((e as Error).message)) {
                return undefined;
            }
        }

        if (match_path) {
            result = route_info;
            return true;
        } else if (route_info.routes) {
            result = findRouteByPath(path, route_info.routes);
            return result;
        }
        return false;
    });

    return result;
};

export const isRouteVisible = (route: TRouteConfig, is_logged_in: boolean) =>
    !(route && route.is_authenticated && !is_logged_in);

export const getPath = (route_path: string, params: { [x: string]: string } = {}) =>
    Object.keys(params).reduce((p, name) => p.replace(`:${name}`, params[name]), route_path);

export const getContractPath = (contract_id: string) => getPath(routes.contract, { contract_id });
