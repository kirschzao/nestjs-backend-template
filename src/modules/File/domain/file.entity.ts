import { createId } from '@paralleldrive/cuid2';

export interface FileInterface {
  name: string;
  size: number;
  type: string;
  fileUrl: string;
  authorId: string;
  deleted: boolean;
  deletedAt?: Date | null;
  messageId?: string | null;
}

export class File implements FileInterface {
  id: string;
  name: string;
  size: number;
  type: string;
  fileUrl: string;
  authorId: string;
  createdAt: Date;
  deleted: boolean;
  deletedAt?: Date | null;

  constructor(file: FileInterface, id?: string, createdAt?: Date) {
    this.id = id ?? createId();
    this.name = file.name;
    this.size = file.size;
    this.type = file.type;
    this.fileUrl = file.fileUrl;
    this.authorId = file.authorId;
    this.createdAt = createdAt ?? new Date();
    this.deleted = file.deleted || false;
    this.deletedAt = file.deletedAt || null;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      size: this.size,
      type: this.type,
      fileUrl: this.fileUrl,
      authorId: this.authorId,
      createdAt: this.createdAt,
      deleted: this.deleted,
      deletedAt: this.deletedAt,
    };
  }
}

