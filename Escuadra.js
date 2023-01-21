//define la clase que controla una escuadra
class  Escuadra{
    static numeroPuestosTiro=5;
    static imagenesPlatos= new Array("imagenes/platoNuevo.png","imagenes/platoRoto.png","imagenes/platoFallo.png");
    static valoresPlato='_XO'; //cadena con los tres posibles valores
    static coloresScore=new Array('white','green','red');
    static imagenNoPlato="imagenes/noPlato.png";
    static nombreNoTirador='-';
    static colorActivo='yellow';
    static colorInactivo='white';
    
    
    /**
     * 
     * @param {array string} tiradores, con los nombres de los tiradores 
     * @param {array integer} puestosIniciales, con el nº de tirador que hay inicialmente
     * @param {array integer} puestosReserva con el nº del tirador que hay en el reserva (1)
     * @param {entero} numeroPlatosSerie 
     */
    constructor (tiradores, puestosIniciales, puestosEsperas, numeroPlatosSerie){
        //propiedades suministradas
        this.tiradores=tiradores;
        this.puestosActuales=puestosIniciales;
        this.puestosEsperas=puestosEsperas;
        this.numeroPlatosSerie=numeroPlatosSerie<1?1:(numeroPlatosSerie>25?25:numeroPlatosSerie);
        //propiedades que se usan para control
        this.tiradorActual=1;
        this.puestoActivo=1;
        this.score=new Array(this.numeroTiradores);
        this.inicializaScore();
        this.platoActual=0;//hasta que comienza la serie
//        this.puestosIniciales=posicionesIniciales.slice();
//        this.asignaPuestosIniciales();
    }

    /**
     * inicializa la tabla de anotaciones
     */
    inicializaScore(){
        //inicialmente su fila de platos inicialmente a '_'
        for (let tirador = 0; tirador < this.numeroTiradores; tirador++) {
            const fila =new Array(this.numeroPlatosSerie);
            fila.fill('_',0,this.numeroPlatosSerie);
            this.score[tirador]=fila.slice();
            //añadimos una columna para el total
        }
        this.totalizaScore();
    }

    /**
     * totaliza en la ultima columna (numeroPlatosSerie) los aciertos ('X')
     */
    totalizaScore(){
        //usamos la casilla última (si no está se crea!)
        for (let tirador = 0; tirador < this.numeroTiradores; tirador++) {
            let contador=0;
            for (let plato = 0; plato < this.numeroPlatosSerie; plato++) {
                contador=contador+(this.score[tirador][plato]=='X'?1:0);
            }
            this.score[tirador][this.numeroPlatosSerie]=contador;            
        }
    }
    /**
     * 
     * @param {entero} plato
     * devuelve la fila del score del tirador que dispara a ese plato 
     */
    calculaFilaScore(plato){
        let fila=plato % this.numeroTiradores;
        if (fila==0){
            fila=this.numeroTiradores;
        }
        return(fila-1); //por lo de empezar en 0!
    }

    /**
     * 
     * @param {entero} plato  indica el plato en absoluto (p.e. 123)
     */
    calculaColumnaScore(plato){
        let columna=Math.trunc(plato/this.numeroTiradores);
        let fila=this.calculaFilaScore(plato);
        //comprobamos si es la última fila, hay que reajustar % (6 % 6->1, y debe ser 0)
        if (fila==this.numeroTiradores-1){
            columna=columna-1;
        }
        return (columna);
    }

    get numeroTiradores(){
        return this.tiradores.length;
    }
    get fin(){
        return (this.platoActual==(this.numeroPlatosSerie*this.numeroTiradores));
    }
    get filaScoreActual(){
        return this.calculaFilaScore(this.platoActual);
    }

    get columnaScoreActual(){
        return this.calculaColumnaScore(this.platoActual);
    }

    /**
     * 
     * @param {entero} plato, indica el numero absoluto de plato que se va a marcar 
     * @param {boolean} resultado, si es true se marca con 'X' si no con '0'
     */
    anotaPlato(plato,resultado){
        this.score[this.calculaFilaScore(plato)][this.calculaColumnaScore(plato)]=resultado?'X':'0';
        this.totalizaScore();
    }

    /**
     * Ddevuelve el número de tiradores en la escuadra
     

    asignaPuestosIniciales(){
        this.puestosEsperas=[0,0,0,0,0];
        switch (this.numeroTiradores) {
            case 1:
                this.puestosIniciales=[1,0,0,0,0];
                break;
            case 2:
                this.puestosIniciales=[1,0,0,2,0];
                break;
            case 3:
                this.puestosIniciales=[1,0,2,0,3];
                break;
            case 4:
                this.puestosIniciales=[1,2,3,0,4];
                break;
            case 5:
                this.puestosIniciales=[1,2,3,4,5];
                break;
            case 6:
                this.puestosIniciales=[1,2,3,4,5];
                this.puestosEsperas=[6,0,0,0,0];
                break;
            
            default:
                break;
        }
    }
*/

/**
     * acciones despues de un disparo
     */
    avanzaUno(){
        //si hemos terminado no!
        if (this.fin){
            return;
        }
        //almacena el tiradorActual
        this.tiradorActual=this.puestosActuales[this.puestoActivo-1];

        //libera el puesto del tirador actual
        this.puestosActuales[this.puestoActivo-1]=0;

        //coloca al que estuviera esperando ahí
        this.puestosActuales[this.puestoActivo-1]= this.puestosEsperas[this.puestoActivo-1];
        //libera el puesto de espera
        this.puestosEsperas[this.puestoActivo-1]=0
        
        //avanza un puesto el puestoActivo
        this.puestoActivo++;
        if (this.puestoActivo>5) {
            this.puestoActivo=this.puestoActivo-5;          
        }

        //coloca al anterior tiradorActual en la espera
        this.puestosEsperas[this.puestoActivo-1]=this.tiradorActual;

        //actualiza el tiradorActual al que hay en el puestoActivo
        this.tiradorActual=this.puestosActuales[this.puestoActivo-1];
    }
}

