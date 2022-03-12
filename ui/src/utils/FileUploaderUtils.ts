export const getFileExtensionFromFileName = (name: string): string => {
    const nameList = name.split('.')
    return nameList[nameList.length - 1]
}

export function isFileVideo(filename: string) {
    var ext = getFileExtensionFromFileName(filename);
    switch (ext.toLowerCase()) {
        case "m4v":
        case "avi":
        case "mpg":
        case "mp4":
            // etc
            return true;
    }
    return false;
}

export function formatBytes(bytes:number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function convertSecondsToDurationString(seconds:number){
    return new Date(seconds * 1000).toISOString().substr(11, 8);
}