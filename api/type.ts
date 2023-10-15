export namespace ApiResponse {
    type ApiResponse<T> = {
        message?: string,
        payload?: T,
        error?: string
    }

    export const s = <T>(message: string, payload?: T) => {
        let res: ApiResponse<T> = {
            message, payload
        };
        return res;
    }

    export const e = (error: string) => {
        let res: ApiResponse<undefined> = {
            error
        };
        return res;
    }

    export const eP = <T>(error: string, payload?: T) => {
        let res: ApiResponse<T> = {
            error, payload
        };
        return res;
    }
}

