import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),

    provideFirebaseApp(() =>
      initializeApp({
         apiKey: "AIzaSyD02_O01omAW7435VqM1r7xb-b3zDttxLo",
          authDomain: "eazimo-1d47c.firebaseapp.com",
          projectId: "eazimo-1d47c",
          storageBucket: "eazimo-1d47c.appspot.com",
          messagingSenderId: "765318352295",
          appId: "1:765318352295:web:5ec948d9e64667d1147a82",
          measurementId: "G-YPFT60MBWJ"
      })
    ),

    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth())
  ]
};