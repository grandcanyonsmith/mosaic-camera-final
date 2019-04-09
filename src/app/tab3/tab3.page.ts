import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastController, Platform, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { finalize } from 'rxjs/operators';
import { CloudinaryImage } from '../models/cloudinary-image.model';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  images: CloudinaryImage[];
  maxResults = 5;
  nextCusror: string = null;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private storage: Storage,
    private platform: Platform,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.loadStoredImagesFromCloudinary(null);
    });
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  async loadStoredImagesFromCloudinary(event) {
    const loading = await this.loadingController.create({
      message: 'Loading Images From Cloudinary...',
      spinner: 'crescent',
      duration: 2000
    });
    if (!event) {
      await loading.present();
    }


    let cloudinaryUrl = `https://web-node-chat-app.herokuapp.com/getCloudinaryImages?max_results=${this.maxResults}`;
    console.log("Initial Request:", cloudinaryUrl);
    this.http.get<{ resources: CloudinaryImage[], next_cursor: string }>(cloudinaryUrl).pipe(
      finalize(() => {
        if (!event) {
          loading.dismiss();
        }
      })
    ).subscribe(
      data => {
        console.log(data);
        if (event) {
          event.target.complete();
        }
        this.nextCusror = data.next_cursor;
        this.images = data.resources;
      },
      error => {
        this.presentToast('Error Occured In fetching Images:' + error.message);
      }
    );
  }


  async loadMoreImagesFromCloudinary(event) {

    let cloudinaryUrl = `https://web-node-chat-app.herokuapp.com/getCloudinaryImages?max_results=${this.maxResults}`;
    if (this.nextCusror) {
      cloudinaryUrl += `&next_cursor=${this.nextCusror}`;
    }
    console.log("New Request:", cloudinaryUrl);
    this.http.get<{ resources: CloudinaryImage[], next_cursor: string }>(cloudinaryUrl).pipe(
      finalize(() => {
        event.target.complete();
      })
    ).subscribe(
      data => {
        console.log(data);
        this.nextCusror = data.next_cursor;
        data.resources.forEach(img => {
          this.images.push(img);
          this.ref.detectChanges();
        });
      },
      error => {
        this.presentToast('Error Occured In fetching Images:' + error.message);
      }
    );
  }

}
