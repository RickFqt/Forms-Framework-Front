import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormularioViewComponent } from './formulario-view/formulario-view.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingComponent,
        title: 'DASH - Landing Page'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'DASH - Login'
    },
    {
        path: 'home',
        component: HomeComponent,
        title: 'DASH - Home'
    },
    {
        path: 'formulario/:id',
        component: FormularioViewComponent,
        title: 'DASH - Formulario'
    }
];
