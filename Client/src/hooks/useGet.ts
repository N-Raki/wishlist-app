import {useEffect, useState} from "react";
import {useFetch} from "./useFetch.ts";
import {ApiResponse} from "../models/apiResponse.ts";

export const useGet = <T>(relativeUrl: string, options?: RequestInit | undefined): ApiResponse<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    if (options) { options.method = 'GET'; }

    useEffect(() => {
        setIsLoading(true);
        useFetch<T>(relativeUrl, options)
            .then((data) => {
                setData(data);
                setError(null);
            })
            .catch((error: any) => {
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [relativeUrl, options]);

    return { data, isLoading, error };
};