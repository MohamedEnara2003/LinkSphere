import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '../../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class SingleTonApi {

#httpClient = inject(HttpClient);  
#baseUrlApi : string = environment.apiUrl;


find<G>(routeName : string ) : Observable<G> {
return this.#httpClient.get<G>(`${this.#baseUrlApi}${routeName}` , {
withCredentials : true
});
}
findById<G>(routeName : string , id : string | number) : Observable<G> {
return this.#httpClient.get<G>(`${this.#baseUrlApi}${routeName}/${id}` , {
withCredentials : true,
});
}
create<G>(routeName : string , data? : unknown) : Observable<G> {
return this.#httpClient.post<G>(`${this.#baseUrlApi}${routeName}`, data , {
withCredentials : true
}).pipe(
take(1),
);
}

update<G>(routeName : string , data : unknown , id : string | number) : Observable<G> {
return this.#httpClient.put<G>(`${this.#baseUrlApi}${routeName}/${id}`, data ,{
withCredentials : true
});
}
    

uploadImage<G>(routeName : string , files : File[]) : Observable<G> {
const formData = new FormData();
files.forEach((file) => {
formData.append('image' , file);
});
return this.#httpClient.post<G>(`${this.#baseUrlApi}${routeName}`, formData  , {
withCredentials : true,
});
}
deleteImage(routeName : string , id : string) : Observable<void> {
return this.#httpClient.delete<void>(`${this.#baseUrlApi}${routeName}` , {
withCredentials : true,
body : {id}
});
}

    deleteById<G>(routeName : string , id : string |  number) : Observable<G> {
    return this.#httpClient.delete<G>(`${this.#baseUrlApi}${routeName}/${id}` , {
    withCredentials : true
    });
    }

    deleteByIdWithBody<G>(routeName : string , data? : unknown) : Observable<G> {
    return this.#httpClient.delete<G>(`${this.#baseUrlApi}${routeName}` , {
    withCredentials : true,
    body : data
    });
    }
    
}
