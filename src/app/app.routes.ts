import { Routes } from '@angular/router';
import { Landing } from './CoreComps/landing/landing';
import { About } from './CoreComps/about/about';
import { Join } from './CoreComps/join/join';
import { Dashboard } from './Admin/dashboard/dashboard';
import { Login } from './Admin/login/login';
import { Wear } from './CoreComps/wear/wear';
import { Worship } from './CoreComps/worship/worship';
import { Gatherings } from './CoreComps/gatherings/gatherings';
import { Give } from './CoreComps/give/give';
import { authGuard } from './Guards/auth-guard-guard';

export const routes: Routes = [
     { path: '', 
    component: Landing
    },
    { path: 'about', 
        component: About
    },
    { path: 'join', 
        component: Join
    },
    { path: 'admin', 
        component: Dashboard,
        canActivate:[authGuard]
    },
    { path: 'login', 
        component: Login
    },
    { path: 'wear', 
        component: Wear
    },
    { path: 'worship', 
        component: Worship
    },
    { path: 'events', 
        component: Gatherings
    },
    { path: 'give', 
        component: Give
    },
    { path: '**',
        redirectTo: '' },
];
