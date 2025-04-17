import useSWR, {SWRConfiguration, SWRResponse} from "swr";
import {API} from "../package/api";

const fetcher = async ([key, args]: [string, Record<string, any> | string | undefined]) => {
    const keys = key.split(".")
    if (keys.length !== 2 || !Object.keys(API).includes(keys[0])) {
        return Promise.reject('error params')
    }

    try {
        // @ts-ignore
        return API[keys[0]][keys[1]] && API[keys[0]][keys[1]](args)
    } catch (e: any) {
        return Promise.reject(e);
    }
}

export const useQuery = <T = any, E = any, S = keyof typeof API> (scope: S, key: string, args?: Record<string, any> | string, options: SWRConfiguration = { refreshInterval: 1000 }): SWRResponse<T, E> => {
    return useSWR<T, E>([`${scope}.${key}`, args], fetcher, options)
}
