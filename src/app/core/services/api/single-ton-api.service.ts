import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, take } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UploadService } from '../upload/upload.service';


@Injectable({
  providedIn: 'root'
})
export class SingleTonApi {

#httpClient = inject(HttpClient);  
#destroyRef = inject(DestroyRef);  
#uploadService = inject(UploadService);
#baseUrlApi : string = environment.apiUrl;



public find<G>(routeName : string ) : Observable<G> {
return this.#httpClient.get<G>(`${this.#baseUrlApi}${routeName}` , {
withCredentials : true
}).pipe(
takeUntilDestroyed(this.#destroyRef)
);
}

findById<G>(routeName : string , id : string | number) : Observable<G> {
return this.#httpClient.get<G>(`${this.#baseUrlApi}${routeName}/${id}` , {
withCredentials : true,
}).pipe(takeUntilDestroyed(this.#destroyRef));
}
create<G>(routeName : string , data? : unknown) : Observable<G> {
return this.#httpClient.post<G>(`${this.#baseUrlApi}${routeName}`, data , {
withCredentials : true
}).pipe(
take(1),
);
}

public update<G>(routeName : string , data : unknown , id : string | number) : Observable<G> {
return this.#httpClient.put<G>(`${this.#baseUrlApi}${routeName}/${id}`, data ,{
withCredentials : true
});
}
    

public patchById<G>(routeName: string, data: unknown, id: string | number): Observable<G> {
  return this.#httpClient.patch<G>(`${this.#baseUrlApi}${routeName}/${id}`, data, {
    withCredentials: true,
  });
}


public patch<G>(routeName: string, data?: unknown): Observable<G> {
  return this.#httpClient.patch<G>(`${this.#baseUrlApi}${routeName}`, data, {
    withCredentials: true,
  });
}


public uploadImage<G>(routeName : string ,formDataName : string , files : File[]) : Observable<G> {
const formData = new FormData();
files.forEach((file) => {
formData.append(formDataName , file);
});
return this.#httpClient.patch<G>(`${this.#baseUrlApi}${routeName}`, formData  , {
withCredentials : true,
}).pipe(
  catchError(() => {
  this.#uploadService.clear()
  return EMPTY;
  })
);
}

public deleteImage(routeName : string , id : string) : Observable<void> {
return this.#httpClient.delete<void>(`${this.#baseUrlApi}${routeName}` , {
withCredentials : true,
body : {id}
});
}

public deleteById<G>(routeName : string , id : string |  number) : Observable<G> {
return this.#httpClient.delete<G>(`${this.#baseUrlApi}${routeName}/${id}` , {
withCredentials : true
});
}

public deleteByIdWithBody<G>(routeName : string , data? : unknown) : Observable<G> {
return this.#httpClient.delete<G>(`${this.#baseUrlApi}${routeName}` , {
withCredentials : true,
body : data
});
}

}
