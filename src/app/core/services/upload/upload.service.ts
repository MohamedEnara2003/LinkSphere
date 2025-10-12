import { computed, Injectable, signal, inject } from "@angular/core";
import { DomService } from "../dom.service";
import { AlertService } from "../alert.service";

@Injectable({ providedIn: 'root' })
export class UploadService {

  #domService = inject(DomService);
  #alertService = inject(AlertService);

  #files = signal<File[]>([]);
  #previews = signal<string[]>([]);
  isLoading = signal<boolean>(false);


  files = computed<File[]>(() => this.#files());
  previews = computed<string[]>(() => this.#previews());

  set setFiles(files: File[]) {
  this.#files.set(files);
  }

  set setPreviews(previews: string[]) {
  this.#previews.set(previews);
  }

  async uploadAttachments(
  input: HTMLInputElement,
  maxFiles : number = 2 ,
  quality : number = 0.75 ,
  maxWidth : number =  1280,
  maxHeight : number = 1280,
  ): Promise<void> {
    if (!this.#domService.isBrowser()) return; // ✅ تجاهل أثناء SSR

    const files = input.files;
    if (!files || files.length === 0) return;
    
    if ((this.#files().length + files.length) > maxFiles) {
      this.#alertService.alertOption.set([{
      id : 1 ,
      isLoad : true ,
      isLoadTime : 3000,
      alertMessage : `You can upload maximum ${maxFiles} files`,
      alertType : 'alert-warning',
      }])
    return
    };

    const filesArray = [...Array.from(files) , ...this.#files()]

    const convertedFiles: File[] = [];
    for (const file of filesArray) {
      if (file.type.startsWith('image/')) {
        const webpFile = await this.convertToWebP(file, quality, maxWidth, maxHeight);
        convertedFiles.push(webpFile);
      } else {
        convertedFiles.push(file);
      }
    }

    this.#files.set(convertedFiles);
    this.generatePreviews(convertedFiles);
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
    if (!this.#domService.isBrowser()) {
      return Promise.resolve(file);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        // 🔹 نحسب أبعاد جديدة متناسبة
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width = width * scale;
          height = height * scale;
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
   * إنشاء Previews
   */
  private generatePreviews(files: File[]): void {
    if (!this.#domService.isBrowser()) return; // ✅ تجاهل في SSR

    this.#previews.set([]);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            this.#previews.set([...this.#previews(), result]);
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
