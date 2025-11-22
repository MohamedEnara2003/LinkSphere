
import { IPost } from "./posts.model";
import { IUser } from "./user.model";

export interface ISearch {
data: { 
    users: {
    data : IUser[],
    totalPages : number,
    total: number ,
    }; 
    posts: {
    data : IPost[],
    totalPages : number,
    total: number ,
    }; 
    page : number ,
    limit : number ,
} 

}
