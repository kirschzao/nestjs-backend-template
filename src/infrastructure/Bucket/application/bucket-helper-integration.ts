import { S3Client } from '@aws-sdk/client-s3';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { ConfigService } from '@nestjs/config';

export class BucketHelperIntegration {
  readonly s3Client: S3Client;
  readonly bucketName: string;
  readonly bucketRegion: string;
  readonly bucketEndpoint: string;
  readonly fileDomainPrefix: string;

  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {
    const accessKeyId = this.ConfigService.get<string>('BUCKET_ACCESS_KEY_ID');
    const secretAccessKey = this.ConfigService.get<string>('BUCKET_SECRET_ACCESS_KEY');
    const region = this.ConfigService.get<string>('BUCKET_REGION');
    const bucketName = this.ConfigService.get<string>('BUCKET_NAME');
    const endpoint = this.ConfigService.get<string>('BUCKET_ENDPOINT');
    const fileDomainPrefix = this.ConfigService.get<string>('CLOUDFRONT_ASSET_DOMAIN');

    if (!accessKeyId || !secretAccessKey || !region || !bucketName || !fileDomainPrefix) {
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Bucket environment variables missing',
      });
    }

    this.bucketName = bucketName;
    this.bucketRegion = region;
    this.fileDomainPrefix = fileDomainPrefix;

    const s3ClientConfig: any = {
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true,
    };

    if (endpoint) {
      this.bucketEndpoint = endpoint;
      s3ClientConfig.endpoint = endpoint;
    }

    this.s3Client = new S3Client(s3ClientConfig);
  }

  getFileKey(fileUrl: string): string {
    if (!fileUrl) {
      this.ExceptionsAdapter.badRequest({
        message: 'A URL é necessária para obter a chave do arquivo.',
      });
      throw new Error('A URL é necessária para obter a chave do arquivo.');
    }

    try {
      const url = new URL(fileUrl);
      const pathWithBucket = url.pathname;
      const decodedPath = decodeURIComponent(pathWithBucket);

      const key = decodedPath.substring(`/${this.bucketName}/`.length);

      if (!key) {
        throw new Error('Não foi possível extrair a chave da URL.');
      }

      return key;
    } catch (error) {
      this.ExceptionsAdapter.badRequest({
        message: `Formato de URL inválido: ${error.message}`,
      });
      throw new Error('Formato de URL inválido ou falha ao extrair a chave.');
    }
  }

  getFileUrl(fileKey: string): string {
    if (this.bucketEndpoint) {
      return `${this.bucketEndpoint}/${this.bucketName}/${fileKey}`;
    }
    if (!fileKey) {
      this.ExceptionsAdapter.badRequest({
        message: 'File key is required to obtain the URL.',
      });
    }
    return `https://s3.${this.bucketRegion}.amazonaws.com/${this.bucketName}/${fileKey}`;
  }
}
