/**
 * Supabase Storage client for image management
 * Replaces Google Cloud Storage
 */

import { createClient } from '@/lib/supabase/client';

const STORAGE_BUCKET = 'shopify-clone-assets';

export interface UploadResult {
    publicUrl: string;
    filename: string;
    bucket: string;
}

/**
 * Upload generated asset (image) to Supabase Storage
 */
export async function uploadAsset(
    base64Data: string,
    sessionId: string,
    assetId: string,
    mimeType: string = 'image/png'
): Promise<UploadResult> {
    const supabase = createClient();

    // Convert base64 to blob
    const extension = mimeType.split('/')[1] || 'png';
    const filename = `${sessionId}/${assetId}.${extension}`;

    // Decode base64 to binary
    const binary = atob(base64Data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: mimeType });

    // Upload to Supabase Storage
    const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filename, blob, {
            contentType: mimeType,
            cacheControl: '31536000', // 1 year
            upsert: true,
        });

    if (error) {
        throw new Error(`Failed to upload asset: ${error.message}`);
    }

    // Get public URL
    const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filename);

    return {
        publicUrl: data.publicUrl,
        filename,
        bucket: STORAGE_BUCKET,
    };
}

/**
 * Upload multiple assets in batch
 */
export async function uploadAssetsBatch(
    assets: Array<{ base64Data: string; assetId: string; mimeType?: string }>,
    sessionId: string
): Promise<UploadResult[]> {
    const uploadPromises = assets.map((asset) =>
        uploadAsset(
            asset.base64Data,
            sessionId,
            asset.assetId,
            asset.mimeType
        )
    );

    return Promise.all(uploadPromises);
}

/**
 * Upload image from URL (for screenshots)
 */
export async function uploadImageFromUrl(
    imageUrl: string,
    sessionId: string,
    assetId: string
): Promise<UploadResult> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return uploadAsset(base64, sessionId, assetId, blob.type);
}

/**
 * Delete session assets
 */
export async function deleteSessionAssets(sessionId: string): Promise<void> {
    const supabase = createClient();

    const { data: files } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(sessionId);

    if (files && files.length > 0) {
        const filePaths = files.map((file) => `${sessionId}/${file.name}`);
        await supabase.storage.from(STORAGE_BUCKET).remove(filePaths);
    }
}

/**
 * List all assets for a session
 */
export async function listSessionAssets(sessionId: string): Promise<string[]> {
    const supabase = createClient();

    const { data: files } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(sessionId);

    if (!files) return [];

    return files.map((file) => {
        const { data } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(`${sessionId}/${file.name}`);
        return data.publicUrl;
    });
}

/**
 * Ensure storage bucket exists (run once on setup)
 */
export async function ensureBucketExists(): Promise<boolean> {
    const supabase = createClient();

    try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const exists = buckets?.some((b) => b.name === STORAGE_BUCKET);

        if (!exists) {
            // Create bucket if it doesn't exist
            const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
                public: true,
                fileSizeLimit: 52428800, // 50MB
            });

            if (error) {
                console.error('Failed to create bucket:', error);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Bucket check failed:', error);
        return false;
    }
}
