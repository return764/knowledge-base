import useSWR, {SWRResponse} from "swr";
import {API} from "../model";

const fetcher = async ([key, args]: [string, Record<string, any>?]) => {
    const keys = key.split(".")
    if (keys.length !== 2) {
        return Promise.reject('error params')
    }
    return API[keys[0]] && API[keys[0]][keys[1]] && API[keys[0]][keys[1]](args)
}

export const useQuery = <T = any, E = any, S = keyof typeof API> (scope: S, key: keyof API[S], args?: Record<string, any>): SWRResponse<T, E> => {
    return useSWR<T, E>([`${scope}.${key}`, args], fetcher, { refreshInterval: 1000 })
}
