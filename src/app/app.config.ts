import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importa withInterceptors
import { tokenInterceptor } from './auth/token.interceptor'; // Importa tu interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Aquí le dices a Angular que use tu interceptor
    provideHttpClient(withInterceptors([tokenInterceptor]))
  ]
};