import { http } from "~/utils/http";

const authApiRequest = {
    sLogin: (body: any) => http.get<any>(`/auth/getToken?username=${body.username}&password=${body.password}`),

    // sLogout: () => http.get<any>('/auth/logOut')
}

export default authApiRequest;
