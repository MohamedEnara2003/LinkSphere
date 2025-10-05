import { Injectable} from "@angular/core";
import { IPost } from "../../models/posts.model";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MockPostsService {
    #posts$ : Observable<IPost[]> = of([
    {
      id: "post1",
      createdBy: {
        id: "1",
        userName: "Mohamed Enara",
        picture: "/man-empty-avatar-photo.webp"
      },
      content: "Hello, this is my first post!",
      attachments: [
      '/Rectangle.png',
      ],
      assetsFolderId: "folder1",
      availability: "public",
      allowComments: "allow",
      tags: [
    { id: "2", name: "Sara Hassan", picture: "https://randomuser.me/api/portraits/women/2.jpg" }
      ],
      likes: [],
      lastComment: {
        id: "comment1",
        content: "Welcome!",
        createdBy: {
          id: "",
          userName: "sara.hassan",
          picture: "https://randomuser.me/api/portraits/women/2.jpg"
        },
        createdAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "post2",
      createdBy: {
        id: "2",
        userName: "sara.hassan",
        picture: "/woman-empty-avatar-photo.webp"
      },
      content: "Nice weather today!",
      attachments: [],
      assetsFolderId: "folder2",
      availability: "friends",
      allowComments: "allow",
      tags: [],
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "post3",
      createdBy: {
        id: "3",
        userName: "mohamed.enara",
        picture: "/man-empty-avatar-photo.webp"
      },
      content: "I'm going to the beach!",
      attachments: [
        '/1747983819132_476165657_1152867902877267_3612919625248808281_n.webp',
      ],
      assetsFolderId: "folder3",
      availability: "public",
      allowComments: "allow",
      tags: [],
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);

  getPosts () : Observable<IPost[]> {
  return this.#posts$
  }
}