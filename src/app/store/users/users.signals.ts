import { patchState, signalStoreFeature, withHooks, withMethods, withState } from "@ngrx/signals";
import { IUser } from "../../core/models/user.model";
import { inject } from "@angular/core";
import { MockUsersService } from "../../core/services/testing/mock-users.service";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

interface IUserState {
    users : IUser[] ,
    user : IUser | undefined,
}

const initialState : IUserState= {
    users :  [] ,
    user : undefined
}

export const UsersState = signalStoreFeature(

    withState(initialState),
    withMethods((store) => {
    const usersService = inject(MockUsersService);

    return {
 getUser(): void {
  const userSignal = toSignal<IUser>( usersService .getUserById('1'));

}

    }
    }),

    withHooks((store) => {
    return {
    onInit(): void {
    store.getUser();
    }
    
    }
    })

)