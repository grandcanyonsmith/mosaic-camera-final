
export class CloudinaryImage {
    public_id?: string;
    format?: string;
    version?: number;
    resource_type?: string;
    type?: string;
    created_at?: string;
    bytes?: number;
    width?: number;
    height?: number;
    access_mode?: string;
    url?: string;
    secure_url?: string;

    //localParams
    isOnCloud?: boolean;
    isInDB?: boolean;
}