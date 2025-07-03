import { http } from "~/utils/http";

const userManagementApiRequest = {
    sUpdateUser: (body: any) => http.post<any>(`/user-management/update`, body),

    // sLogout: () => http.get<any>('/auth/logOut')
}

export default userManagementApiRequest;
