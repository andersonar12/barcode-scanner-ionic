import { ChangeDetectorRef, Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Register } from 'src/app/models/register.model';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  savedItems: Register[] = []

  constructor( public dataLocal:DataLocalService, private cd:ChangeDetectorRef, public toastController: ToastController) {}

  sendMail(){
   this.dataLocal.sendMail()
  }

  eraseAll(){
    this.presentToast()
    localStorage.clear()
    this.dataLocal.saved = []
    
    this.cd.markForCheck()

  }

  openRegister(register){
    this.dataLocal.openRegister(register)
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Historial Eliminado. ',
      duration: 2000,
      mode: 'ios',
      color:'dark'
    });
    toast.present();
  }


}
