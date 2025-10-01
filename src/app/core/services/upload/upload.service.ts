import { Injectable, signal, computed } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UploadService {

  // state الأساسي
  #files = signal<File[]>([]);
  #previews = signal<string[]>([]);

  // computed signals
  files = computed(() => this.#files());
  previews = computed<string[]>(() => this.#previews());


  /**
   * رفع الملفات من input
   */
    uploadAttachments(input: HTMLInputElement): void {
    const files = input.files;
    if (!files || files.length === 0) return;

    // نحفظ الملفات
    const filesArray = Array.from(files);
    this.#files.set(filesArray);

    // نعمل Previews
    this.generatePreviews(filesArray);
    }

/**
* إرجاع ملف واحد أو مجموعة ملفات
*/

  getFiles(): File | File[] | undefined {
    const currentFiles = this.#files();
    if (currentFiles.length === 0) return;
    return currentFiles.length === 1 ? currentFiles[0] : currentFiles;
  }

  /**
   * إنشاء Previews للملفات (صور فقط)
   */
  private generatePreviews(files: File[]): void {
    const previews: string[] = [];

    files.forEach(file => {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
            previews.push(result);
            this.#previews.set([...previews]);
        }
        };
        reader.readAsDataURL(file);
    }
    });
}

clear(): void {
    this.#files.set([]);
    this.#previews.set([]);
}

}
