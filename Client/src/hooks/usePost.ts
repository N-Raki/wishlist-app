import {useEffect, useState} from 'react';
import {useFetch} from "./useFetch.ts";
import {ApiResponse} from "../models/api-response.ts";

export const usePost = <T, U>(relativeUrl: string, body: U, options?: RequestInit | undefined): ApiResponse<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (options) { options.method = 'POST'; }
    
    useEffect(() => {
        setIsLoading(true);
        useFetch<T>(relativeUrl, { ...options, body: JSON.stringify(body) })
            .then(data => {
                setData(data);
                setError(null);
            })
            .catch((error: any) => {
                setError(error.message)
            })
            .finally(() => {
                setIsLoading(false)
            });
    }, [relativeUrl, options, body]);

    return { data, isLoading, error };
};