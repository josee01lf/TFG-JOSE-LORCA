/*Una vez addEventListener, ha cargado todo el código HTML, comienza a ejecutar el Js*/
document.addEventListener('DOMContentLoaded', function () {

    // Declaración de los parámetros para cálculos de parámetros, desplazamiento y velocidad y tiempos.
    let x0, v0, A, G, Wn, Y, Wd, alpha, delta1, delta2, beta, regimen, A1, A2, Yc, Ac, regimenc, betac, alphac, delta1c, delta2c, A1c, A2c, Wdc, Gc, Wnc, raizdelta, K, B, m = 0.5, ultimoGc, ultimolWf, bcambio = 0;
    let Yf, Yfc, Y1, Y1c, Wf, Af, Wfc, Afc, xcf, vcf, Af0;
    let idAnimacion;
    let xNUEVA, vNUEVA, fuerza,X2;
    let rango = 140;
    let Tinicio;
    let tc = 0;
    let tiempo = 0;
    let tlapsus = 0.01;

    // Declaración de arrays para almacenar los nuevos valores de Gc y Wf.
    let historialGc = [];
    let historialWf = [];


    // Declaración de arrays para almacenar, los nuevos puntos imprimidos en la gráfica, y el lienzo.
    const datos = [];
    const etiquetas = [];
    const lienzo = document.getElementById('osciladorGrafico');
    const ctx = lienzo.getContext('2d');

    // Declaración de las entradas de datos. 
    const entradaX = document.getElementById('entradaX');
    const entradaV = document.getElementById('entradaV');
    const entradaB = document.getElementById('entradaB');
    const entradaK = document.getElementById('entradaK');
    const entradaM = document.getElementById('entradaM');
    const entradaWf = document.getElementById('entradaWf');
    const entradaAf0 = document.getElementById('entradaAf0');
    const entradaFrecuenciaAngular = document.getElementById('entradaFrecuenciaAngular');
    const entradaAmortiguamiento = document.getElementById('entradaAmortiguamiento');

    // Creacción del grafico y ajustes.   
   const grafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: etiquetas,
        datasets: [{
            label: 'Desplazamiento X',
            data: datos,
            borderColor: 'rgba(100, 100, 100, 1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                min: 0,
                max: 100,
                title: {
                    display: true,
                    text: 'Tiempo (t)' // Etiqueta para el eje x
                }
            },
            y: {
                type: 'linear',
                position: 'left',
                min: -rango,
                max: rango,
                ticks: {
                    stepSize: 10 // Tamaño del paso entre las etiquetas
                }, 
                grid: {
                    color: function (context) {
                        return context.tick.value === 0 ? 'red' : 'rgba(0, 0, 1, 0.1)';
                    },
                    lineWidth: function (context) {
                        return context.tick.value === 0 ? 1.5 : 1;
                    }
                }
            }
        },
        plugins: {
            
            tooltip: { //Para el caso, del desplegable cuando pasas el puntero encima del grafico
                enabled: true,
                mode: 'nearest',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: 'red',
                bodyColor: 'white',
                displayColors: false,
                callbacks: { 
                    title: function(context) {
                        return 'Información:';
                    },
                    label: function(context) {
                        return 'Tiempo (t): ' + context.parsed.x + ', Desplazamiento X: ' + context.parsed.y;
                    }        
                }
            }
        }
    }
});

    grafico.data.datasets.push({// Opciones para punto simulación muelle.
        label: 'Bola Muelle',
        data: [],
        pointStyle: 'rectRounded',
        radius: 5, // Tamaño del punto
        backgroundColor: 'rgba(255, 0, 0, 0.8)', // Color de relleno del punto (rojo más brillante).
        borderColor: 'rgba(255, 0, 0, 1)', // Color del borde del punto (rojo).
        borderWidth: 4, // Grosor del borde del punto.
        hoverRadius: 4,
        hoverBackgroundColor: 'rgba(255, 0, 0, 0.5)', // Color al pasar el cursor por encima del punto (rojo más brillante con transparencia).
        hoverBorderColor: 'rgba(255, 0, 0, 1)', // Color del borde al pasar el cursor por encima del punto (rojo).
        borderDash: [5, 5],
        showLine: false, // No dibujar una línea conectando el punto
        showInLegend: false // No mostrar en la leyenda
    });

    grafico.data.datasets.push({// Opciones para punto al cambiar de parámetros.
        label: 'Cambio parámetros',
        data: [],
        pointStyle: 'circle',
        radius: 2,
        backgroundColor: 'rgba(0, 0, 255, 1)',
        borderColor: 'rgba(0, 0, 255, 1)',
        borderWidth: 1,
        showLine: false,
        showInLegend: false
    });
    grafico.data.datasets.push({// Opciones para punto inicio oscilación.
        label: 'Punto origen',
        data: [],
        pointStyle: 'rectRounded',
        radius: 4,
        backgroundColor: 'rgba(140, 55, 255, 1)',
        borderColor: 'rgba(0, 0, 255, 1)',
        borderWidth: 1,
        showLine: false,
        showInLegend: false
    });

    /*Recupera valores de parámetros, previamente guardados en la memoria del navegador,
     para un uso del programa mas sencillo*/
    window.addEventListener('DOMContentLoaded', function () {
        const savedX = localStorage.getItem('xValue');
        const savedV = localStorage.getItem('vValue');

        const savedAf0 = localStorage.getItem('xAf0');
        const savedWf = localStorage.getItem('xwf');

        const savedB = localStorage.getItem('xB');
        const savedK = localStorage.getItem('xK');
        const savedM = localStorage.getItem('xM');

        const savedG = localStorage.getItem('xG');
        const savedWn = localStorage.getItem('xWn');



     
        

        // Si ya hay valores guardados, actualizar los cajones de entrada, para que aparezcan como recordatorio.
        if (savedX !== null && savedV !== null) {
            entradaX.value = savedX;
            entradaV.value = savedV;
        }
        if (savedAf0 !== null && savedWf !== null) {
            entradaAf0.value = savedAf0;
            entradaWf.value = savedWf;
        }
        if (savedB !== null && savedK !== null && savedM !== null ) {
            entradaB.value = savedB;
            entradaK.value = savedK;
            entradaM.value = savedM;
        }
        if (savedG !== null && savedWn !== null) {
            entradaAmortiguamiento.value = savedG;
            entradaFrecuenciaAngular.value = savedWn;
        }
    });


    // Ajustes de botón Iniciar.
    const botonInicio = document.getElementById('botonIniciar');
    let programaIniciado = false; //Condición para saber el estado del programa.

    botonInicio.addEventListener('click', function () {
        document.getElementById('entradaX').disabled = true
        document.getElementById('entradaV').disabled = true
        if (!programaIniciado) {  //Si se verifica que el programa no ha empezado, tomar los valores introducidos por pantalla.
            document.getElementById('botonPausarReanudar').style.display = 'block'
            //Cada entrada de datos, se le asigna a su parametro.
            const valorX = parseFloat(entradaX.value);
            const valorV = parseFloat(entradaV.value);
            const valorWf = parseFloat(entradaWf.value);
            const valorAf0 = parseFloat(entradaAf0.value);
            const nuevoFactorAmortiguamiento = parseFloat(entradaAmortiguamiento.value);
            const nuevaFrecuenciaAngular = parseFloat(entradaFrecuenciaAngular.value);

            if (!isNaN(valorX) && !isNaN(valorV) && !isNaN(valorWf) && !isNaN(valorAf0) && !isNaN(nuevoFactorAmortiguamiento) && !isNaN(nuevaFrecuenciaAngular)) {
                x0 = valorX;
                v0 = valorV;
                Af0 = valorAf0;
                Wf = valorWf;
                G = nuevoFactorAmortiguamiento;
                Wn = nuevaFrecuenciaAngular;
                bcambio;
                Gc = G;
                Wnc = Wn;
                Wfc = Wf;
                Tinicio = performance.now();// Tiempo inicial, para el comienzo de la impresión de datos en la gráfica.

                //Se guardan los valores de las nuevas, en la memoria del navegador.
                localStorage.setItem('xValue', entradaX.value);
                localStorage.setItem('vValue', entradaV.value);
                localStorage.setItem('xAf0', entradaAf0.value);
                localStorage.setItem('xwf', entradaWf.value);
                localStorage.setItem('xG', entradaAmortiguamiento.value);
                localStorage.setItem('xWn', entradaFrecuenciaAngular.value);

                //Se hace una llamada a la función de parámetrosInternos, y se le introducen los valores como argumento.
                calcularparámetrosInternos(0, x0, v0, Wn, G, bcambio, historialGc, m, Af0, Wf, historialWf);
                programaIniciado = true;
                botonInicio.textContent = 'Reiniciar oscilación'; //El botón iniciar, pasa a ser Reiniciar.
            } else {
                alert('Ingresa valores válidos para X, V, G, Wn, Wf (Frecuencia Forzada) y Amplitud forzada');
            }
        } else {

            location.reload();// En caso, de pulsar reiniciar, se refresca la pagina.  
        }
    });

// Ajustes del botón aplicar cambios.

    let pulsado = false;
    aplicarCambios.addEventListener('click', function () { 
        //Entrada nuevos valores.
        const nuevoFactorAmortiguamiento = parseFloat(entradaAmortiguamiento.value);
        const nuevaFrecuenciaAngular = parseFloat(entradaFrecuenciaAngular.value);
        const valorWf = parseFloat(entradaWf.value);
        const valorAf0 = parseFloat(entradaAf0.value);
        pulsado = !pulsado;
        
        if(!pausado){//Si esta en pausa la grafica
        

        if (!isNaN(valorWf) && !isNaN(valorAf0) && !isNaN(nuevoFactorAmortiguamiento) && !isNaN(nuevaFrecuenciaAngular)
        ) {
            
            mensajeError.textContent = `Nuevos Valores externos aplicados`;
            //Entradas de valores, y almacenamiento en memoria.
            Gc = nuevoFactorAmortiguamiento;
            Wnc = nuevaFrecuenciaAngular;
            Af0 = valorAf0;
            Wfc = valorWf;
            localStorage.setItem('xAf0', entradaAf0.value);
            localStorage.setItem('xwf', entradaWf.value);
            localStorage.setItem('xG', entradaAmortiguamiento.value);
            localStorage.setItem('xWn', entradaFrecuenciaAngular.value);

                
            /*Se le asigna valor a tc, es el instante del tiempo del cambio de parámetros. Se calculan los valores, 
            de x0 y v0 para el instante del cambio. Y se introducen los nuevos valores en la función parámetrosInternos.*/
            if (idAnimacion) {
                cancelAnimationFrame(idAnimacion);
               
                tc = (performance.now() - Tinicio) / 1000 + tlapsus - tiempoTranscurrido;
                
                console.log('tc:', tc);
                console.log('tincio:', Tinicio);
               
                x0 = calcularXNueva(tc, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);
                v0 = calcularVNueva(tc, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);
                bcambio = 1, cam=true;
                calcularparámetrosInternos(tc, x0, v0, Wnc, Gc, bcambio, historialGc, m, Af0, Wfc, historialWf,cam);
            }
        } else {
            mensajeError.textContent = 'Ingresa valores válidos para G, Wn, Wf (Frecuencia Forzada) y Amplitud forzada';
        }
    
    }else{
        if (!isNaN(valorWf) && !isNaN(valorAf0) && !isNaN(nuevoFactorAmortiguamiento) && !isNaN(nuevaFrecuenciaAngular)
        ) {
        mensajeError.textContent = 'Nuevos Valores externos aplicados';} else{
            mensajeError.textContent = 'Ingresa valores válidos para G, Wn, Wf (Frecuencia Forzada) y Amplitud forzada';}
    
    }
            

            
    });



    // Ajustes del botón aplicar cambios físicos.
    let pulsado2 = false;
    aplicarCambiosFisicos.addEventListener('click', function () {
        //Entrada nuevos valores parametros fisicos.
        const valorB = parseFloat(entradaB.value);
        const valorK = parseFloat(entradaK.value);
        const valorM = parseFloat(entradaM.value);
        m = valorM;
        pulsado2 = !pulsado2;
        if(!pausado){

        if (!isNaN(valorB) && !isNaN(valorK) && !isNaN(valorM)) {
            
            mensajeError.textContent = `Nuevos valores Físicos aplicados.`;
            Gc = Math.round(valorB / (2 * m) * 100) / 100;
            Wnc = Math.round(Math.sqrt(valorK / m) * 100) / 100;
            localStorage.setItem('xB', entradaB.value);
            localStorage.setItem('xK', entradaK.value);
            localStorage.setItem('xM', entradaM.value);

            if (idAnimacion) {// Mismo caso, que para el botón aplicar cambios.
                cancelAnimationFrame(idAnimacion);
                tc = (performance.now() - Tinicio) / 1000 + tlapsus - tiempoTranscurrido;

                

                x0 = calcularXNueva(tc, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);
                v0 = calcularVNueva(tc, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);
                bcambio = 1, cam=true;
                calcularparámetrosInternos(tc, x0, v0, Wnc, Gc, bcambio, historialGc, m, Af0, Wfc, historialWf,cam);                
            } else {
               entradaAmortiguamiento.value = Gc;
                entradaFrecuenciaAngular.value = Wnc;
                botonInicio.click();
            }

        } else {
            mensajeError.textContent = 'Ingresa valores numéricos válidos para b, k y m.';
        }
    }else{
        if (!isNaN(valorB) && !isNaN(valorK) && !isNaN(valorM))  {
        mensajeError.textContent = 'Nuevos Valores externos aplicados';} else{
            mensajeError.textContent = 'Ingresa valores numéricos válidos para b, k y m.';}
    
    }
    });

    /*Botón pausar y reanudar animación. Esta programado con la finalidad de poder cambiar parametros,
    mientras esta pausada la grafica. */
    let pausado = false;
    let cam = false;
    let TPausa, tiempoTranscurrido = 0;
    botonPausarReanudar.addEventListener('click', function () {
        // Cambiar el estado de pausa
        pausado = !pausado;
        cam = false;
        if (pausado) {//Mientras esta pausado
            TPausa = performance.now() / 1000; //Marca el momento del tiempo al pulsar el botón.
    
            cancelAnimationFrame(idAnimacion);//Paraliza la animación.
            pulsado = false;
            pulsado2 = false;
    
        } else {//Para reanudar.
    
            tiempoTranscurrido += (performance.now() / 1000) - TPausa; //Tiempo actual, menos el de la pausa.
    
            if(pulsado){   //Cambio de parametros en pausa.
            const nuevoFactorAmortiguamiento = parseFloat(entradaAmortiguamiento.value);
            const nuevaFrecuenciaAngular = parseFloat(entradaFrecuenciaAngular.value);
            const valorWf = parseFloat(entradaWf.value);
            const valorAf0 = parseFloat(entradaAf0.value);
            console.log('no entra en pulsado1');
            if (!isNaN(valorWf) && !isNaN(valorAf0) && !isNaN(nuevoFactorAmortiguamiento) && !isNaN(nuevaFrecuenciaAngular)
            ) {
                
                Gc = nuevoFactorAmortiguamiento;
                Wnc = nuevaFrecuenciaAngular;
                Af0 = valorAf0;
                Wfc = valorWf;
                localStorage.setItem('xAf0', entradaAf0.value);
                localStorage.setItem('xwf', entradaWf.value);
                localStorage.setItem('xG', entradaAmortiguamiento.value);
                localStorage.setItem('xWn', entradaFrecuenciaAngular.value);
                tc = (performance.now() - Tinicio) / 1000 + tlapsus - tiempoTranscurrido;
                    x0 = calcularXNueva(tc, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);
                    v0 = calcularVNueva(tc, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);
                    bcambio = 1;
                    cam=true;
                    calcularparámetrosInternos(tc, x0, v0, Wnc, Gc, bcambio, historialGc, m, Af0, Wfc, historialWf,cam);
             } 
    
        }else if(pulsado2){  //Cambio de parametro fisicos en pausa.
            const valorB = parseFloat(entradaB.value);
            const valorK = parseFloat(entradaK.value);
            const valorM = parseFloat(entradaM.value);
            m = valorM;
            console.log('no entra en pulsado2');
    
            if (!isNaN(valorB) && !isNaN(valorK) && !isNaN(valorM)) {
                console.log('Nuevos valores físicos aplicados: b= ', valorB, ' k= ', valorK);
                mensajeError.textContent = `Nuevos valores Físicos aplicados, b= ${valorB}, k= ${valorK}, masa= ${m}`;
                Gc = Math.round(valorB / (2 * m) * 100) / 100;
                Wnc = Math.round(Math.sqrt(valorK / m) * 100) / 100;
                console.log('Nuevos valores de G y Wn calculados: G= ', Gc, ' Wn= ', Wnc);
    
                localStorage.setItem('xB', entradaB.value);
                localStorage.setItem('xK', entradaK.value);
                localStorage.setItem('xM', entradaM.value);
            } 
                tc = (performance.now() - Tinicio) / 1000 + tlapsus - tiempoTranscurrido;
                x0 = calcularXNueva(tc, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);
                v0 = calcularVNueva(tc, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);
                bcambio = 1;
                cam=true;
                calcularparámetrosInternos(tc, x0, v0, Wnc, Gc, bcambio, historialGc, m, Af0, Wfc, historialWf,cam);
            }else
            animar();
    
            
               
               
                
                
        }
    });


    /*Función calculo de Xnueva, le entran los valores por argumento, y calcula el nuevo
    valor del desplazamiento que imprimirá en la gráfica. */

    function calcularXNueva(tiempo, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf) {
        xNUEVA = 0;
        if (tiempo < 0.020) {

            tiempo = 0;

        }


        if (regimen == 0) {//XNueva para el caso subamortiguado

            console.log('Calculo X subamortiguado');
            xNUEVA = A * Math.exp(-G * tiempo) * Math.cos((Wd * tiempo) + Y);

        }

        else if (regimen == 1) {//XNueva para el caso crítico

            console.log('Calculo X critica');
            xNUEVA = (alpha + beta * (tiempo)) * Math.exp(- G * (tiempo));

        }

        else {//XNueva para el caso sobreamortiguado
            console.log('Calculo X sobreamortiguada');
            xNUEVA = (A1 * Math.exp(-delta1 * (tiempo))) + (A2 * Math.exp(-delta2 * tiempo));
        }

        //A los valores anteriormente calculados, se le añade la parte matemática de la oscilación forzada.
        xNUEVA = xNUEVA + Af * Math.sin(Wf * tiempo + Yf + Y1);


        return xNUEVA;//Devuelve a la función, animar el valor de X.
    }

    /*Función calculo de Vnueva, le entran los valores por argumento, y calcula el nuevo
    valor de la velocidad. */
    function calcularVNueva(tiempo, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf) {
        vNUEVA;


        if (tiempo < 0.020) {

            tiempo = 0;
        }


        if (regimen == 0) {//VNueva para el caso subamortiguado

            console.log('Calculo V subamortiguado');
            vNUEVA = A * Math.exp(-G * (tiempo)) * (-G * Math.cos(Wd * tiempo + Y) - Wd * Math.sin(Wd * tiempo + Y));

        }

        else if (regimen == 1) {//XNueva para el caso critico

            console.log('Calculo V critico');
            vNUEVA = (beta - (G * alpha) - (G * beta * tiempo)) * Math.exp(-G * (tiempo));

        }
        else {//VNueva para el caso sobreamortiguado


            console.log('Calculo V sobreamortiguado');
            vNUEVA = -A1 * delta1 * Math.exp(-delta1 * tiempo) - A2 * delta2 * Math.exp(-delta2 * (tiempo));

        }

        vNUEVA = vNUEVA + Wf * Af * Math.cos(Wf * tiempo + Yf + Y1);

        //A los valores anteriormente calculados, se le añade la parte matemática de la oscilación forzada.
        return vNUEVA;
    }

    /*Función para calcular la fuerza y poder representar su dirección.*/
    function calcularfuerza(tiempo,Yf, Af, Wf) {
        fuerza=Af*Math.sin(Wf*tiempo+Yf);
        return fuerza;
    }

    /*Función de calculo para los parámetros necesarios para la obtención de X y V.
      Le vienen como argumento los datos, desde los botones, de iniciar y de aplicar cambios. */
    function calcularparámetrosInternos(tc, xc, vc, Wn, G, bcambio, historialGc, m, Af0, Wf, historialWf,cam) {

        //Una vez entra en la función, resetea todos los valores a 0, para que no pueda haber ningún problema.
        Ac = 0, Yc = 0, betac = 0, alphac = 0, delta1c = 0, delta2c = 0, A1c = 0, A2c = 0, regimenc = 0, Wdc = 0, Afc = 0, Yfc = 0, Y1c = 0;


        /*Almacena los valores de Gc y Wf en un array, ya que no se pueden reescribir sus valores, 
        puesto que se necesitan para realizar las transiciones.*/
        historialGc.push(Gc);
        ultimoGc = historialGc[historialGc.length - 2];

        historialWf.push(Wf);
        ultimolWf = historialWf[historialWf.length - 2];





        //Al entrar bcambio=1 se actualizan los valores de cambio, es decir, los que contienen "c".

        if (bcambio == 1) {

            Ac = A;
            Yc = Y;
            betac = beta;
            alphac = alpha;
            delta1c = delta1;
            delta2c = delta2;
            A1c = A1;
            A2c = A2;
            regimenc = regimen;
            bcambio = 0;
            Wdc = Wd;
            Yfc = Yf;
            Y1c = Y1;
            Afc = Af;
        }

        // Se calcula el valor de B y K, aun que en ese momento no se estén introduciendo parámetros físicos.
        K = m * (Wn * Wn);
        K = Math.round(K * 100) / 100;
        B = 2 * m * G;


        // Se calculan los parámetros forzados, se crean distintos condicionales, dependiendo de los parámetros.

        Yf = -Wf * tc;
        Yf = Yf - 2 * Math.PI * Math.round(Yf / (2 * Math.PI));
        Wf2 = Wf * Wf;
        Wn2 = Wn * Wn;

        if (Af0 == 0) {
            Af = 0;

        } else {

           // Af = Af0 / Math.sqrt(((Wf2 - Wn2) * (Wf2 - Wn2)) + 4 * G * G * Wf2);
            Af = Af0 / Math.sqrt(Math.pow(((Wf2 / Wn2)-1), 2) + Math.pow(2*G*G*Wf/Wn2,2));
        }


        // Calculo de la fase forzada.
        if (Wf < Wn) {

            Y1 = Math.tan((2 * G * Wf) / ((Wf * Wf) - (Wn * Wn)));

        } else if (Wf == Wn) {

            Y1 = -Math.PI / 2;


        } else {

            Y1 = Math.tan((2 * G * Wf) / (Wf2 - Wn2)) - Math.PI;

        }

        //Se modifican desplazamiento y velocidad, para que en el caso de que existan fuerzas forzadas, se ejecute el valor correcto.
        xcf = xc - Af * Math.sin(Y1);
        vcf = vc - Wf * Af * Math.cos(Y1);


        //Calculo de parámetros relevantes para el calculo de X y V nuevas, dependiendo tipo de movimiento.        

        if (G < Wn) {   //Calculo para el caso subamortiguado.

            Wd = Math.sqrt(Wn * Wn - G * G);
            regimen = 0;
            console.log('Calculo de parámetros internos en subamortiguado.');

            if (xcf == 0) {

                if (vcf < 0) {

                    Y = (Math.PI / 2) - Wd * tc;
                    A = (-vcf / Wd) * Math.exp(G * tc);

                } else {

                    Y = -(Math.PI / 2) - Wd * tc;
                    A = (vcf / Wd) * Math.exp(G * tc);
                }

            }

            else {

                Y = -Wd * tc - Math.atan((G / Wd) + (vcf / (Wd * xcf)));

                if (xcf < 0) {

                    Y = Y + Math.PI;
                }

                A = (xcf / Math.cos(Wd * tc + Y)) * Math.exp(G * tc);
            }
            console.assert(A >= 0);
            Y = Y - 2 * Math.PI * Math.round(Y / (2 * Math.PI));
            console.assert(Y <= Math.PI && Y >= -Math.PI);


        } else if (G == Wn) {   //Calculo para el caso critico.
            console.log('Calculo de parámetros internos en critico');
            regimen = 1;
            beta = ((vcf + G * xcf) * Math.exp(G * tc));
            alpha = ((xcf - (vcf * tc)) - (G * xcf * tc)) * Math.exp(G * tc);

        } else {  //Calculo para el caso sobreamortiguado.
            console.log('Calculo de parámetros internos en sobreamortiguado');
            regimen = 2;
            raizdelta = Math.sqrt(G * G - Wn * Wn)
            delta1 = G + raizdelta;
            delta2 = G - raizdelta;

            A1 = ((vcf + delta2 * xcf) / (delta2 - delta1)) * Math.exp(delta1 * (tc));
            A2 = ((vcf + delta1 * xcf) / (delta1 - delta2)) * Math.exp(delta2 * (tc));

        }

        
        // Calculo del ultimo punto de X, para marcar el cambio en la gráfica.
        if(cam==true){
        X2 = calcularXNueva(tc, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);}

        //Si es la primera vez que entra a la función, ejecuta lo siguiente:
        if (tc == 0) {

            grafico.data.datasets[3].data.push({ x: tiempo, y: x0 });//Marca de la posicion X=0, donde inicia.

            //En el caso de que la amplitud sea mayor de la cuenta, ampliar rango a 180.
            if (A > 140 || Math.abs(alpha) > 140 || Math.abs(A2) > 140) {
                rango = 180;
                grafico.options.scales.y.max = rango;
                grafico.options.scales.y.min = -rango;
            }

        }


        //Pasar directamente los parámetros calculados a la función animar.
        animar();


    }

    /*La función actualizarGraficaConDesplazamiento, va desplazando la gráfica, dejando atrás la parte de la curva antigua
    y con un margen visible de 20 segundos.*/
    const margenTiempo = 20;
    function actualizarGraficaConDesplazamiento(tiempo, nuevoDato) {

        datos.push(nuevoDato);
        etiquetas.push(tiempo);
        let tiempoMinimo = Math.max(-20, tiempo - margenTiempo);
        let tiempoMaximo = Math.max(20, tiempo);

        grafico.options.scales.x.min = tiempoMinimo;
        grafico.options.scales.x.max = tiempo;

        grafico.update('none');//Actualiza el grafico. El "none" indica que no introduzca ninguna animación, al imprimir la curva.
    }





    // Crear el contexto de audio, sirve para crear y manipular fuentes de audio.
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Función para la reproducción del sonido, dependiendo de xNUEVA y vNUEVA.
    function reproducirSonido(xNUEVA, vNUEVA) {

        var oscillator = audioCtx.createOscillator();//Generador de ondas, para la emision de sonidos.

        var baseFrequency = 5; // Frecuencia más baja para un tono suave
        var frequency = baseFrequency * Math.pow(10, xNUEVA / 12);/*Se divide la frecuencia entre los 12 semitonos y 
    se eleva a 10  para que los tonos se escuchen de manera coherente.*/


        frequency *= Math.abs(vNUEVA) + 1;//Ajusta al frecuencia del tono, dependiendo de la velocidad.

        frequency = Math.max(200, Math.min(250, frequency)); //Limita el rango de frecuencia, para solo evitar tonos inaudibles y desagradables.

        oscillator.type = 'sine'; // Forma de onda sinusoidal, para conseguir un sonido puro y sin armónicos.


        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);//Establece la frecuencia en un momento determinado.

        var gainNode = audioCtx.createGain();//Crea un nodo de ganancia, para poder ajustar el volumen.

        var volume = Math.abs(vNUEVA) / 90; // Asignar volumen dependiendo de la velocidad.
        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);//Establece volumen en un momento especifico.

        oscillator.connect(gainNode);//Le proporciona al sonido del oscilador, la ganancia.
        gainNode.connect(audioCtx.destination);//Emite el sonido, por la salida del PC.

        oscillator.start();//Inicia el oscilador.

        setTimeout(function () {//Para el sonido del oscilador cada 100 milesimas de segundo.
            oscillator.stop();
        }, 100);
    }


    //Funcion encargada de crear la flecha dependiendo de la direccion de la fuerza.
    function mostrarFlecha(fuerza) {
        const arrow = document.getElementById('arrow');

        if (fuerza > 0) {
            arrow.textContent = '↑'; // Flecha hacia arriba
            arrow.style.color = 'green'; // Cambiar color a verde para valores positivos
        } else if (fuerza < 0) {
            arrow.textContent = '↓'; // Flecha hacia abajo
            arrow.style.color = 'red'; // Cambiar color a rojo para valores negativos
        } else {
            arrow.textContent = '--'; // Sin flecha si el valor es 0
        }
    }



    /* Función encargada de las ordenes de programa, una vez se calculan parámetros se pasan como argumentos aqui, 
    y se vuelven a pasar a las funciones Xnueva y Vnueva, una vez obtenidos los valores, imprime por pantalla. 
    Esta parte del código, esta en constante actualización, para que pueda ser posible estar calculando los valores
    de desplazamiento y velocidad de manera reiterativa.
    */
    function animar() {// Encargada de la actualización de la función actualizar.
        function actualizar() {

            tiempo = ((performance.now() - Tinicio) / 1000) - tiempoTranscurrido;//Contador de tiempo, una vez pulsas el botón iniciar.

            if (tc < tiempo && bcambio == 1) {//Almacena valores principales para el cambio.
                G = Gc
                Wn = Wnc
                Wf = Wfc
            }

            const tiempoDesdeUltimaActualizacion = tiempo - tiempoUltimaActualizacion;
            if (tiempoDesdeUltimaActualizacion >= tiempoEntreActualizaciones) {//Encargado de la actualización de la función actualizar.


                //Envio como argumentos de las variables normales y de cambio, de desplazamiento y velocidad.
                if (tiempo > tc) {//Calculo con parámetros nuevos.
                    xNUEVA = calcularXNueva(tiempo, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);
                    vNUEVA = calcularVNueva(tiempo, A, Y, G, Wd, regimen, alpha, beta, A1, A2, delta1, delta2, Yf, Y1, Af, Wf);
                    fuerza = calcularfuerza(tiempo,Yf, Af, Wf);

                }
                else {//Calculo de parámetros, para hacer la transición del cambio.
                    xNUEVA = calcularXNueva(tiempo, Ac, Yc, ultimoGc, Wdc, regimenc, alphac, betac, A1c, A2c, delta1c, delta2c, Yfc, Y1c, Afc, ultimolWf);
                    vNUEVA = calcularVNueva(tiempo, Ac, Yc, ultimoGc, Wdc, regimenc, alphac, betac, A1c, A2c, delta1c, delta2c, Yfc, Y1c, Afc, ultimolWf);
                    fuerza = calcularfuerza(tiempo,Yfc, Afc, ultimolWf);

                }

                mostrarFlecha(fuerza);
                
                console.log('fuerza:', fuerza);

                reproducirSonido(xNUEVA, vNUEVA)//Envía los valores a la función del sonido.    
                grafico.data.datasets[1].data.push({ x: tiempo, y: xNUEVA });//Imprime los datos de X, en la gráfica.


                // Limitar a un solo punto impreso en la curva, para que simule la bola de un muelle.
                if (grafico.data.datasets[1].data.length > 1) {
                    grafico.data.datasets[1].data.shift();
                }

                if (tc < tiempo && bcambio == 1) {
                    grafico.data.datasets[2].data.push({ x: tiempo, y: X2 });// Impresión del punto en el momento del cambio.
                    bcambio = 0;
                    X2=undefined;
                }

                

                tiempoUltimaActualizacion = tiempo;
                //Impresión en consola, de X, V y tiempo.
                console.log('xnueva:', xNUEVA);
                console.log('vnueva:', vNUEVA);
                console.log('tiempo :', tiempo);

                actualizarGraficaConDesplazamiento(tiempo, xNUEVA);

                //Impresión de datos en la pantalla del programa.
                document.getElementById('factorAmortiguamientoDisplay').textContent = G ? Math.round(G * 100) / 100 : '0';
                document.getElementById('frecuenciaAngularDisplay').textContent = Wn ? Math.round(Wn * 100) / 100 : '0';
                document.getElementById('xdisplay').textContent = xNUEVA ? Math.round(xNUEVA * 100) / 100 : '0';
                document.getElementById('vdisplay').textContent = vNUEVA ? Math.round(vNUEVA * 100) / 100 : '0';
                document.getElementById('faseDisplay').textContent = Y ? Math.round(Y * 100) / 100 : '0';
                document.getElementById('KDisplay').textContent = K ? Math.round(K * 100) / 100 : '0';
                document.getElementById('MDisplay').textContent = m ? Math.round(m * 100) / 100 : '0';
                document.getElementById('BDisplay').textContent = B ? Math.round(B * 100) / 100 : '0';



                idAnimacion = requestAnimationFrame(actualizar);
            } else {// Si no ha pasado suficiente tiempo, actual la animación sigue actualizándose.

                setTimeout(function () {
                    idAnimacion = requestAnimationFrame(actualizar);
                }, tiempoEntreActualizaciones - tiempoDesdeUltimaActualizacion);
            }
        }

        const tiempoEntreActualizaciones = 0.01;// La función actualizar se ejecuta cada 0.01 segundos.
        let tiempoUltimaActualizacion = 0;
        actualizar();
    }
});



