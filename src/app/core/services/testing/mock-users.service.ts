import { Injectable} from "@angular/core";
import { IUser, GenderEnum, RoleEnum, ProviderEnum } from "../../models/user.model";
import { filter, map, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MockUsersService {
    users$ : Observable<IUser[]> = of([
    {
      _id: "1",
      firstName: "Mohamed",
      lastName: "Enara",
      userName: "mohamed.enara",
      slug: "mohamed-enara",
      email: "mohamedenara2003@example.com",
      gender: GenderEnum.male,
      role: RoleEnum.user,
      picture: "",
      coverImages: [
      '/cover-image.jpg',
      '/cover-image.jpg',
      ],
      friends: [],
    },
    {
      _id: "2",
      firstName: "Sara",
      lastName: "Hassan",
      userName: "sara.hassan",
      slug: "sara-hassan",
      email: "sara.hassan@example.com",
      gender: GenderEnum.female,
      role: RoleEnum.admin,
      picture: "",
      coverImages: [],
      friends: [],
    }
  ])


getUserById(id: string): Observable<IUser | null> {
  return this.users$.pipe(
    map(users => users.find(user => user._id === id) || null),
    map(user =>
      user
        ? {
            ...user,
            picture:
              user.picture ||
              (user.gender === GenderEnum.male
                ? '/man-empty-avatar-photo.webp'
                : '/woman-empty-avatar-photo.webp'),
          }
        : null
    )
  );
}





}