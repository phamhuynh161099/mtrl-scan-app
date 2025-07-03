import { http } from "~/utils/http";

const userManagementApiRequest = {
    sUpdateUser: (formData: FormData) => http.post<any>(`/user-management/update`, formData),
    sListUser: (body: any) => http.post<any>(`/user-management/list`, body),

    // sLogout: () => http.get<any>('/auth/logOut')
}

export default userManagementApiRequest;
