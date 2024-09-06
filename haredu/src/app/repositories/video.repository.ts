import { AppHttpClient } from '#services/app-http-client.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Repository } from './repository';

@Injectable()
export class VideoRepository extends Repository {
  constructor(httpClient: AppHttpClient) {
    super(httpClient);
  }

  getAll(filter: any) {
    return this.httpClient.get<any>(`/videos`, filter).pipe(map((res) => res.data));
  }

  getOneVideo(id: string) {
    return this.httpClient.get<any>(`/videos/${id}`).pipe(map((res) => res.data));
  }

  getMyVideo() {
    return this.httpClient.get<any>(`/videos/my-video`).pipe(map((res) => res.data));
  }

  getUserVideo(slug: string) {
    return this.httpClient.get<any>(`/videos/user-video/${slug}`).pipe(map((res) => res.data));
  }

  delete(id: string) {
    return this.httpClient.delete<any>(`/videos/${id}`).pipe(map((res) => res.data));
  }

  update(id: string, data: any) {
    return this.httpClient.put<any>(`/videos/${id}`, data).pipe(map((res) => res.data));
  }

  getAllCategory() {
    return this.httpClient.get<any>(`/fields`).pipe(map((res) => res.data));
  }
}
