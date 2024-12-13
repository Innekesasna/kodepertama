import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import * as bootstrap from 'bootstrap';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.page.html',
  styleUrls: ['./profile-user.page.scss'],
})
export class ProfileUserPage implements OnInit {

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private db: DatabaseService,
  ) { }

  otherprofile: any;
  otherstory: any[] = []; 
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const userId = Number(params.get('userId'));
      if (userId) {
        await this.getOtherProfile(userId);
        await this.getOtherStory(userId);
      }
    });
  }

  async getOtherProfile(userId: number) {
    try {
      const response = await this.apiService.getOtherProfile(userId);
      console.log('Response dari API:', response);

      if (response.errorCode === 0) {
        this.otherprofile = response.result;
        console.log('Data kategori yang diambil:', this.otherprofile);
      }
    } catch (error) {
      console.error('Kesalahan saat mengambil data kategori:', error);
    }
  }

  async getOtherStory(userId: number) {
    try {
      const response = await this.apiService.getOtherStory(userId);
      this.otherstory = response.result.map((story: any) => {
        if (story.storyMedia && story.storyMedia.length > 0) {
          story.storyMedia = story.storyMedia.map((media: { file: string; }) => {
            media.file = `${environment.baseUrl}/${media.file}`;
            return media;
          });
        }
        return story;
      });
    } catch (error) {
      console.error('Gagal memuat cerita saya:', error);
    }
  }

  isImage(file: string): boolean {
    return file.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }

  isVideo(file: string): boolean {
    return file.match(/\.(mp4|webm|ogg)$/) != null;
  }

}
