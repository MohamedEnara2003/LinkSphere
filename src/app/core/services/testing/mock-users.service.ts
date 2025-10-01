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
      provider: ProviderEnum.system,
      picture: "",
      coverImages: [],
      friends: [],
      createdAt: new Date(),
      updatedAt: new Date()
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
      provider: ProviderEnum.google,
      picture: "",
      coverImages: [],
      friends: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])


getUserById(id: string): Observable<IUser> {
return this.users$.pipe(
    map(users => users.find(user => user._id === id)),
    filter((user): user is IUser => !!user) // يتأكد إن القيمة موجودة
);
}



}