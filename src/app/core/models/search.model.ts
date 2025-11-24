
import { Pagination } from "./pagination";
import { IPost } from "./posts.model";
import { IUser } from "./user.model";

export interface ISearch {
data: { 
    users: {
    data : IUser[],
    pagination : Pagination
    }; 
    posts: {
    data : IPost[],
    pagination : Pagination
    }; 

} 

}
