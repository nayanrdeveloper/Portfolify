/* shared envelope */
export interface ApiEnvelope<Data = unknown> {
    message?: string;
    data: Data;
}

/* ---------- single upload ---------- */
export type SingleUploadSuccess = ApiEnvelope<{
    secureUrl: string; // camel-case
}>;

/* ---------- multiple upload -------- */
export type MultipleUploadSuccess = ApiEnvelope<{
    secureUrls: string[]; // camel-case
}>;

/* ---------- payloads --------------- */
export interface SingleUploadPayload {
    file: File;
    folder?: string;
}
export interface MultipleUploadPayload {
    files: File[];
    folder?: string;
}
