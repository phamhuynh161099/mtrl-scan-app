import { http } from "~/utils/http";

const mcsApiRequest = {
    sSearchBySeasonAndArticle: (body: any) => http.post<any>(`/mcs/search`, body),
    sSearchByBarcode: (body: any) => http.post<any>(`/mcs/scan-barcode`, body),

    sGetImage: (article: string, season: string, number: number) => http.get<any>
        (`/upload/get-article-image?article=${article}&season=${season}&ordFile=${number}`),
}

export default mcsApiRequest;
