import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Register } from '../models/register.model';
import { Browser } from '@capacitor/browser';
import { NavController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';


@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  public saved: Register[] =[]

  constructor(public route:Router, private navCtrl:NavController,private file: File) { 

    this.saved = JSON.parse(localStorage.getItem('history')) || []
  }

  saveRegister ( text:string){
    const newRegister = new Register(text);
    this.openRegister(newRegister)
    this.saved.unshift(newRegister)
    localStorage.setItem('history',JSON.stringify(this.saved))
  }

  openRegister(register:Register){
    this.navCtrl.navigateForward('/tabs/tab2')

    switch (register.type) {
      case 'http':
        Browser.open({ url: register.text })
       break;

      case 'geo':

       let textSplit = register.text.split('=')[1].split(',')
       
       const lat = `${textSplit[0]}`
       const lng = `${textSplit[1]}`
        this.route.navigateByUrl(`/tabs/map?lat=${lat}&lng=${lng}`)
       break;
      
       case 'text':
         break
    
      default:
        break;
    }
  }

  sendMail(){

    const arrayTemp =[]
    const titles = 'Tipo, Creado en, Texto\n'

    arrayTemp.push(titles)

    this.saved.forEach( register =>{

      const line =` ${register.type}, ${register.created}, ${register.text.replace(',',' ')}\n`;

      arrayTemp.push(line)

    })

    this.createFile(arrayTemp.join(''))
  }

  createFile( text: string){
    this.file
      .checkFile(this.file.dataDirectory, 'register.csv')
      .then((exists) => {
        console.log('Directory exists',exists)
        return this.writeFile(text)
      })
      .catch((err) => {

        console.log("Directory doesn't exist");

        return this.file
          .createFile(this.file.dataDirectory, 'register.csv', false)
          .then((created) => this.writeFile(text))
          .catch((error2) =>
            console.log('No se pudo crear el archivo', error2)
          );

      });

  }

  async writeFile(text:string){
    await this.file.writeExistingFile(this.file.dataDirectory, 'register.csv', text)

    console.log(this.file.dataDirectory + 'register.csv');

    const file = this.file.dataDirectory + 'register.csv'


  }
}
