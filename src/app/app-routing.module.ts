import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { GameComponent } from './game/game.component';
import { HelpComponent } from './help/help.component';
import { LandingComponent } from './landing/landing.component';
import { LoadingComponent } from './loading/loading.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/varify-email.component';



const routes: Routes = [
  {path: '', component: LoginComponent },
  {path: 'login', component: LoginComponent },
  {path: 'signup', component: SignupComponent },
  {path: 'landing', component: LandingComponent },
  {path: 'chat', component: ChatComponent },
  {path: 'help', component: HelpComponent },
  {path:'gameplay',component:GameComponent},
  {path:'fogotpassword',component:ForgotPasswordComponent},
  {path:'resetpassword',component:ResetPasswordComponent},
  {path:'verifyemail',component:VerifyEmailComponent},
  {path:'loading',component:LoadingComponent},
  {path:'resetpassword',component:ResetPasswordComponent},
  {path:'verifyemail',component:VerifyEmailComponent},
 
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
