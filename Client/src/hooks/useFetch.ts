const API_URL: string = import.meta.env.VITE_API_URL;

const handleError = (statusCode: number) => {
    if (statusCode === 401) {
        window.location.href = '/login';
        return;
    }
    throw new Error(`An error occurred: ${statusCode}`);
}

const formatUrl = (relativeUrl: string) => {
    if (API_URL.endsWith('/') && relativeUrl.startsWith('/')) {
        relativeUrl = relativeUrl.slice(1);
    } else if (!API_URL.endsWith('/') && !relativeUrl.startsWith('/')) {
        relativeUrl = '/' + relativeUrl;
    }
    return API_URL + relativeUrl;
}

export async function useFetch<T>(relativeUrl: string, options?: RequestInit | undefined): Promise<T> {
    const response = await fetch(formatUrl(relativeUrl), {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        credentials: 'include',
        ...options
    });
    
    if (!response.ok) {
        handleError(response.status);
    }
    
    return response.json();
}

