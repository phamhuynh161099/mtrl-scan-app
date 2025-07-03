import { http } from "~/utils/http";

const userManagementApiRequest = {
    sUpdateUser: (formData: FormData) => http.post<any>(`/user-management/update`, formData),

    // sLogout: () => http.get<any>('/auth/logOut')
}

export default userManagementApiRequest;
