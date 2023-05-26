import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoadingComponent } from './loading/loading.component';
import { LandingComponent } from './landing/landing.component';
import { RoomselectionComponent } from './roomselection/roomselection.component';
import { PrivateroomcodeComponent } from './privateroomcode/privateroomcode.component';
import { WinscreenComponent } from './winscreen/winscreen.component';
import { ProfileComponent } from './profile/profile.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from './chat/chat.component';
import { HelpComponent } from './help/help.component';
import { CreateroomComponent } from './createroom/createroom.component';
import { SettingComponent } from './setting/setting.component';
import { PublicroomcodeComponent } from './publicroomcode/publicroomcode.component';
import { WaitingroomComponent } from './waitingroom/waitingroom.component';

import { CreateprivateroomComponent } from './createprivateroom/createprivateroom.component';
import { JoinroomComponent } from './joinroom/joinroom.component';
import { GameComponent } from './game/game.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagePopupComponent } from './message-popup/message-popup.component';
import { LossScreenComponent } from './loss-screen/loss-screen.component';
import { ChatPopupComponent } from './chat-popup/chat-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyEmailComponent } from './verify-email/varify-email.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { LoaderComponent } from './loader/loader.component';
import { RoomPopupComponent } from './room-popup/room-popup.component';
import { ReconnectPopupComponent } from './reconnect-popup/reconnect-popup.component';
// import { LoadingComponent } from './loading/loading.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LoadingComponent,
    LandingComponent,
    RoomselectionComponent,
    PrivateroomcodeComponent,
    WinscreenComponent,
    ProfileComponent,
    LeaderboardComponent,
    ChatComponent,
    HelpComponent,
    CreateroomComponent,
    SettingComponent,
    PublicroomcodeComponent,
    WaitingroomComponent,
    CreateprivateroomComponent,
    JoinroomComponent,
    GameComponent,
    MessagePopupComponent,
    LossScreenComponent,
    ChatPopupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyEmailComponent,
    EditProfileComponent,
    LoaderComponent,
    RoomPopupComponent,
    ReconnectPopupComponent,
  

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
