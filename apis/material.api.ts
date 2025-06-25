import { http } from "~/utils/http";

const materialApiRequest = {
    sGetMaterial: (body: any) => http.post<any>(`/material/getMaterial`, body),
    sScanInforV2: (body: any) => http.post<any>(`/material/scanInforV2`, body),

    // sLogout: () => http.get<any>('/auth/logOut')
}

export default materialApiRequest;
