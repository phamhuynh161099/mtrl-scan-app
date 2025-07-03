
import { LOCAL_STORAGE_KEYS } from "~/constants/localStorage.const";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizePath } from "./utils";
import { envConfig } from "~/constants/config.const";
import { useAuthStore } from "~/store/authStore";


type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined
}

type LoginResType = {
    token: string;
    message: string;
    account: {
        id: number;
        name: string;
        email: string;
    };
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EnityErrorPayload = {
    message: string
    errors: {
        field: string
        message: string
    }[]
}

export class HttpError extends Error {
    status: number
    payload: {
        message: string
        [key: string]: any
    }

    constructor({ status, payload, message = 'Loi HTTP' }: { status: number; payload: any; message?: string }) {
        super(message)
        this.status = status
        this.payload = payload
    }
}

/**
 * Error cho cac loi thuoc ve sai cac truong thong tin
 */
export class EntityError extends HttpError {
    status: typeof ENTITY_ERROR_STATUS;
    payload: EnityErrorPayload
    constructor({ status, payload }: {
        status: typeof ENTITY_ERROR_STATUS,
        payload: EnityErrorPayload

    }) {
        super({ status, payload, message: 'Loi cac truong thong tin' })
        this.status = status
        this.payload = payload
    }
}

/**
 ** Custom hàm gọi api cho fetch()
 */
const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?: CustomOptions | undefined
) => {
    let body: FormData | string | undefined = undefined
    if (options?.body instanceof FormData) {
        body = options.body
    } else if (options?.body !== undefined) {
        body = JSON.stringify(options?.body)
    }

    const baseHeaders: {
        [key: string]: string
    } =
        body instanceof FormData
            ? {}
            : {
                'Content-Type': 'application/json',
            }

    const accessToken = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.WF_ACCESS_TOKEN);
    const normalizedRequestUrl = normalizePath(url)
    if (accessToken) {
        if (
            normalizedRequestUrl.startsWith('auth/getToken')
            || normalizedRequestUrl === 'auth/logOut'
        ) {
        } else {
            baseHeaders['Authorization'] = `Bearer ${accessToken}`
        }
    }

    const baseUrl = options?.baseUrl === undefined
        ? envConfig.NEXT_PUBLIC_API_ENDPOINT
        : options.baseUrl;

    const fullUrl = `${baseUrl}${normalizedRequestUrl}`;

    let res: globalThis.Response | undefined = undefined; // Initialize as undefined
    let parsedPayload: any = null;

    try {
        res = await fetch(fullUrl, {
            ...options,
            method,
            headers: {
                ...baseHeaders,
                ...options?.headers,
            },
            body,
        });

        // Handle 204 No Content or empty body explicitly before attempting res.json()
        if (res.status === 204 || res.headers.get('content-length') === '0') {
            parsedPayload = null;
        } else {
            // For all other cases, try to parse as JSON.
            // If this fails (e.g. non-JSON response), the catch block below will handle it.
            parsedPayload = await res.json();
        }

    } catch (error) {
        // This catch block handles:
        // 1. Network errors from fetch() (res might be undefined).
        // 2. Errors from res.json() (res is defined, but parsing failed).
        console.error('Fetch API or JSON parsing error:', error);


        //  useAuthStore.getState().signOut();
        // await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.WF_ACCESS_TOKEN);
        // await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.WF_ZUST_ACCOUNT);

        let errorStatus = 0; // Default for network error or pre-response error
        let errorPayloadContent: any = { message: 'Request failed or response could not be processed.' };

        if (res) { // If fetch succeeded but subsequent processing (like .json()) failed
            errorStatus = res.status;
            // Try to get text body if res.json() failed, especially for error responses
            try {
                const textBody = await res.text();
                errorPayloadContent = { message: "Server responded with non-JSON content.", details: textBody };
            } catch (textErr) {
                errorPayloadContent = { message: "Server responded, but content could not be read or parsed." };
            }
        }

        throw new HttpError({
            status: errorStatus,
            payload: errorPayloadContent,
            message: (error instanceof Error ? error.message : 'Client-side request processing error')
        });
    }

    const data = {
        status: res.status,
        payload: parsedPayload as Response, // Cast to the expected generic Response type
    }

    if (!res.ok) {
        if (res.status === ENTITY_ERROR_STATUS) {
            throw new EntityError(data as {
                status: 422
                payload: EnityErrorPayload // Assumes parsedPayload is EnityErrorPayload
            })
        } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
            // useAuthStore.getState().signOut();
            // await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.WF_ACCESS_TOKEN);
            // await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.WF_ZUST_ACCOUNT);

            throw new HttpError({
                status: AUTHENTICATION_ERROR_STATUS,
                payload: parsedPayload || { message: 'Authentication failed' },
                message: 'Authentication Required'
            });
        } else {
            throw new HttpError({ status: res.status, payload: parsedPayload || { message: `HTTP error ${res.status}` } });
        }
    }

    /**
     ** Nếu api là getToken xử lý thêm việc lưu token
     */
    if (
        normalizedRequestUrl.startsWith('auth/getToken')
    ) {
        const { token } = (parsedPayload as unknown as LoginResType)
        if (token) {
            await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.WF_ACCESS_TOKEN, token);
        } else {
            console.warn('Token not found in auth/getToken response payload');
        }
    } else if (normalizedRequestUrl === 'auth/logOut') {
        useAuthStore.getState().signOut();
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.WF_ACCESS_TOKEN);
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.WF_ZUST_ACCOUNT);
    }

    return data;
}

export const http = {
    get<Response>(
        url: string,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('GET', url, options);
    },

    post<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('POST', url, { ...options, body });
    },

    put<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('PUT', url, { ...options, body });
    },

    delete<Response>(
        url: string,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) {
        return request<Response>('DELETE', url, { ...options });
    }
};
