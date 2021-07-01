export class Register {
    
    public text: string;
    public type:string;
    public icon: string;
    public created:Date;

    constructor( text: string){
        
        this.text = text;
       
        this.created = new Date() 

        this.determinateType()
    }

    private determinateType(){
        /* const startText = this.text.substr(0,4)
        console.log('Type', startText); */

        const findText = this.text.indexOf('maps') || this.text.indexOf('location') || this.text.indexOf('geo')

        if (findText !== -1) {
            this.type = 'geo';
            this.icon = 'location-sharp';

        } else if(this.text.substr(0,4)== 'http'){
            
            
            this.type = 'http';
            this.icon = 'globe';
        }else{

            this.type = 'text';
            this.icon = 'text';

        }

    
    }
}