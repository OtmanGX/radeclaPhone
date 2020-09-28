import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';


export class APIService {
    baseurl: string;

    constructor(protected http: HttpClient) {
    }

    getAll(params?): Observable<any[]> {
        return this.http.get<any[]>(this.baseurl, {params});
    }

    getAllByPage(params?): Observable<any> {
        return this.http.get<any>(this.baseurl, {params});
    }

    get(id: number): Observable<object> {
        return this.http.get(`${this.baseurl}${id}/`);
    }

    create(data: any) {
        return this.http.post(this.baseurl, data);
    }

    update(id: number, data: any) {
        return this.http.put(`${this.baseurl}${id}/`, data);
    }

    patch(id: number, data: any) {
        return this.http.patch(`${this.baseurl}${id}/`, data);
    }

    delete(id: number) {
        return this.http.delete(`${this.baseurl}${id}/`);
    }

    deleteAll() {
        return this.http.delete(this.baseurl);
    }

}
