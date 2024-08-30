import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    // Check if the file is an image or PDF
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only images and PDFs are allowed.',
      );
    }

    try {
      const result = await this.uploadToCloudinary(file.buffer);
      return result;
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  private async uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      // Pipe the buffer to the upload stream
      toStream(buffer).pipe(uploadStream);
    });
  }

  async removeImage(publicId: string): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new BadRequestException(`Failed to remove image: ${error.message}`);
    }
  }

  async removeImageByUrl(url: string): Promise<{ result: string }> {
    const publicId = this.extractPublicIdFromUrl(url);
    if (!publicId) {
      throw new BadRequestException('Invalid URL');
    }

    return await this.removeImage(publicId);
  }

  private extractPublicIdFromUrl(url: string): string | null {
    const urlPattern = /\/upload\/(?:v\d+\/)?([^\.]+)\.[a-zA-Z]+$/;
    const match = url.match(urlPattern);
    return match ? match[1] : null;
  }
}
