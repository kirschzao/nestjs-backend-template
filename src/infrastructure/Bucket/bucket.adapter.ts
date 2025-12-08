
export abstract class BucketAdapter {
  abstract uploadFile(file: Express.Multer.File, fileKey: string): Promise<string | undefined>;
  abstract deleteFile(fileKey: string): Promise<void>;
  abstract getFileUrl(fileKey: string): string;
  abstract getFileKey(fileUrl: string): string;
  abstract getSignedUrlForExternalRead(link: string, expiresIn?: number): Promise<string>;
  abstract getSignedUrlForInternalRead(fileKey: string): string;
  abstract uploadFileFromUrl(fileUrl: string, fileKey: string): Promise<string | undefined>;
  abstract getSignedUrlForUpload(
    fileKey: string,
    contentType: string,
    userId?: string,
    expiresIn?: number,
  ): Promise<string>;
}
