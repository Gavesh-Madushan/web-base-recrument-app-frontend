import * as api from "../api";

export const FileDownloadService = {
    downloadFile
};


async function downloadFile(url) {
    try {
        const { data } = await api.downloadFile(url);

        return {isSuccess: true, data: data};
    } catch (error) {

        return {isSuccess: false, data: error};
    }
}