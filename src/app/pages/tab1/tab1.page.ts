import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import { DataLocalService } from 'src/app/services/data-local.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements AfterViewInit, OnDestroy {
  result = null;
  scanActive = false;
  constructor(public alertController: AlertController, private dataLocal:DataLocalService) {}

  ngAfterViewInit() {
    
     BarcodeScanner.prepare().catch(e=>console.log(e));
    console.log('BarcodeScanner prepare') 
  
  }

  ngOnDestroy(){
    BarcodeScanner.stopScan();
  }


  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      const result = await BarcodeScanner.startScan();
      console.log('Allowed', result);

      if (result.hasContent) {

        this.dataLocal.saveRegister(result.content)

        this.result = result.content;
        this.scanActive = false;
        
      }
    }
  }

  /* Para chequear permisos y darle acceso a la camara */
  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alertController.create({
          header: 'No permission',
          message: 'Please allow camera access in your settings',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
            },
            {
              text: 'Open Settings',
              handler: () => {
                BarcodeScanner.openAppSettings();
                resolve(false);
              },
            },
          ],
        });

        await alert.present();
      } else {
        resolve(false);
      }
    });
  }
  /* Para chequear permisos y darle acceso a la camara */
  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  /* ionViewWillLeave(): void {
    this.result = ''
  } */
}
