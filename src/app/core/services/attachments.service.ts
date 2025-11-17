import {computed, inject, Injectable } from '@angular/core';
import {FormArray, FormControl, FormGroup } from '@angular/forms';
import { UploadService } from './upload/upload.service';
import { Picture } from '../models/picture';

@Injectable({
providedIn: 'root',
})

export class AttachmentsService {

#uploadService = inject(UploadService);
#form!: FormGroup;


previews = computed<Picture[]>(() => this.#uploadService.previews());

initAttachmentsForm(form: FormGroup) {
this.#form = form;
}

get attachments(): FormArray {
return this.#form.get('attachments') as FormArray;
}

get removedAttachments(): FormArray {
return this.#form.get('removedAttachments') as FormArray;
}

public initExistingAttachments(attachments : Picture[]) : void {
    if(!attachments.length) return;
    this.#uploadService.setPreviews = attachments ;
}


public async uploadAttachments(input: HTMLInputElement , maxFiles : number = 2): Promise<void> {
    
    await this.#uploadService.uploadAttachments(input, maxFiles , 0.75, 600, 600);
    const files = this.#uploadService.files();

    this.attachments.clear();

    files.filter(Boolean).forEach(file => {
    this.attachments.push(new FormControl(file));
    });
    
}


onRemoveAttachment(index: number , isExisitngData : boolean): void {
    const previews = this.#uploadService.previews();
    const files = this.#uploadService.files();

    const filterPreviews = previews.filter((_ , i) => i !== index);
    const filterFiles =  files .filter((_ , i) => i !== index);


    if (isExisitngData && previews[index]) {
    this.removedAttachments.push(new FormControl(previews[index].public_id));
    }

    // Remove 
    this.#uploadService.setPreviews =  filterPreviews;
    this.#uploadService.setFiles = filterFiles;
    this.attachments.removeAt(index);
}

public clearAttachments() : void {
this.#uploadService.clear();
this.attachments.clear();
this.removedAttachments.clear();
}

}
