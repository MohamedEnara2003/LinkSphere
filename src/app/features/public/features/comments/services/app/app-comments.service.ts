import {  inject, Injectable, } from '@angular/core';
import { SingleTonApi } from '../../../../../../core/services/api/single-ton-api.service';
import { UserProfileService } from '../../../profile/services/user-profile.service';
import { ICreateComment, IReplyComment, IUpdateComment } from '../../../../../../core/models/comments.model';



@Injectable({
  providedIn: 'root'
})
export class AppCommentService {
readonly singleTonApi = inject(SingleTonApi);
readonly userService = inject(UserProfileService);
readonly routeName : string = "posts";


// For Update and Create (comment & reply) return: formData
buildCommentFormData(data: ICreateComment | IReplyComment | IUpdateComment): FormData {
  const formData = new FormData();

  if ('content' in data && data.content) formData.append('content', data.content);
  if ('image' in data && data.image) formData.append('image', data.image);

  if ('tags' in data && data.tags?.length) {
  data.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
  }

  if ('removedTags' in data && data.removedTags?.length) {
  data.removedTags.forEach((tag, index) => formData.append(`removedTags[${index}]`, tag));
  }

  if ('removeAttachment' in data && data.removeAttachment) {
  formData.append('removeAttachment', 'true');
  }
return formData;
}

}
