import { signalStore } from "@ngrx/signals";
import { UsersState } from "../users.signals";



export const UsersStore = signalStore(
    {providedIn: 'root'},
    UsersState
)

