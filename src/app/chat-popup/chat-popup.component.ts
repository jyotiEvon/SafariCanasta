import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModelLocater } from '../modelLocater/modelLocater';
import { SocketconnectionServices } from '../services/socketconnection.service';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.scss']
})
export class ChatPopupComponent implements OnInit {

  protected gamePlaySubscriptions: Subscription[] = [];
  public chatPopupTimeout: Array<any> = [];

  constructor(public model:ModelLocater, public socketScv: SocketconnectionServices) { 
    console.log("this.model.chatPopup1.display", this.model.chatPopup1.display);
  
    this.subscribeToChatPopup();
  }

  ngOnInit(): void {
  }

  subscribeToChatPopup() {

    let temp = this.socketScv.chatData.subscribe((data: any) => {
      if(JSON.stringify(data) != '{}'){
        console.log("SOCKET CHAT DATA", data)
      let seat = this.getSeatFromServerIndex(Number(data.playerIndex))
      this.showChatPop(seat, data.data)
      }
      
    });

    this.gamePlaySubscriptions.push(temp);
  }

  showChatPop = (seat: 1|2|3|4, data: any) => {
    console.log("SEAT CHAT", seat);
    this.model[`chatPopup${seat}`] = { display: true, text: data?.text ?? "", emoji: data?.emoji ?? "" };

    clearTimeout(this.chatPopupTimeout[seat]);

    this.chatPopupTimeout[seat] = setTimeout((_seat:1|2|3|4)=>{
        this.model[`chatPopup${_seat}`] = {display: false, text: "", emoji: ""}
    }, 5000, seat);
  }

  getSeatFromServerIndex(index: number): any {
    let seat = 0;
    // console.info("PPPPPPPPPp", this.modal.allPlayers);
    for (let player of this.model.allPlayers) {
        if (player.index == index) {
            seat = player.seat;
            // console.log('players seat', seat);
            break;
        }
    }
    return seat;
}
}
