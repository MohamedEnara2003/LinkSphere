import { computed, Injectable, signal, inject } from "@angular/core";
import { DomService } from "../dom.service";
import { AlertService } from "../alert.service";
import { Picture } from "../../models/picture";

@Injectable({ providedIn: 'root' })
export class UploadService {

  #domService = inject(DomService);
  #alertService = inject(AlertService);

  #files = signal<File[]>([]);
  #previews = signal<Picture[]>([]);
  isLoading = signal<boolean>(false);

  files = computed<File[]>(() => this.#files());
  previews = computed<Picture[]>(() => this.#previews());

  set setFiles(files: File[]) {
    this.#files.set(files);
  }

  set setPreviews(previews: Picture[]) {
    this.#previews.set(previews);
  }

  async uploadAttachments(
    input: HTMLInputElement,
    maxFiles: number = 2,
    quality: number = 0.75,
    maxWidth: number = 1280,
    maxHeight: number = 1280
  ): Promise<void> {

    if (!this.#domService.isBrowser()) return;

    const files = input.files;
    if (!files || files.length === 0) return;

    if ((this.#files().length + files.length) > maxFiles || this.#previews().length >= maxFiles) {
      this.#alertService.alertOption.set([{
        id: 1,
        isLoad: true,
        isLoadTime: 3000,
        alertMessage: `You can upload maximum ${maxFiles} files`,
        alertType: 'alert-warning',
      }]);
      return;
    }

  const filesArray = [...Array.from(files), ...this.#files()];

  const convertedFiles: File[] = await Promise.all(
  filesArray.map(async (file) => {
    if (file.type.startsWith('image/')) {
      return await this.convertToWebP(file, quality, maxWidth, maxHeight);
    } else {
      return file;
    }
  })
);


    this.#files.set(convertedFiles);
    this.#generatePreviews(convertedFiles);
  }

  /**
   * ✅ تحويل الصورة إلى WebP (في المتصفح فقط)
   */
  private convertToWebP(
    file: File,
    quality = 0.75,
    maxWidth = 1280,
    maxHeight = 1280
  ): Promise<File> {
    if (!this.#domService.isBrowser()) return Promise.resolve(file);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width *= scale;
          height *= scale;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas not supported');

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject('WebP conversion failed');
            const newFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '') + '.webp',
              { type: 'image/webp' }
            );
            resolve(newFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * ✅ إنشاء previews للصور
   */
  #generatePreviews(files: File[]): void {
    if (!this.#domService.isBrowser()) return;

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const newPreview: Picture = {
              public_id: crypto.randomUUID(),
              url: result,
              name: file.name
            };

            this.#previews.update(prev => {

              if (prev.some(p => p.name === file.name)) {
              return prev;
              }
              return [...prev, newPreview];
            });
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  clear(): void {
    this.#files.set([]);
    this.#previews.set([]);
    this.isLoading.set(false);
  }
}
