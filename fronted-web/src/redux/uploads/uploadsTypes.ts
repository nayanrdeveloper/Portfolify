export interface SingleUploadResponse {
    status: string;
    message: string;
    data: {
        secure_url: string;
    };
}

export interface MultipleUploadResponse {
    status: string;
    message: string;
    data: {
        secure_urls: string[];
    };
}

export interface SingleUploadPayload {
    file: File;
    folder?: string;
}

export interface MultipleUploadPayload {
    files: File[];
    folder?: string;
}
