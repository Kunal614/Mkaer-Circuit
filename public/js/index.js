/* Draggable Workspace */

function makeDraggable(evt) {
    let svg = evt.target;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);

    let selectedElement = false;
    let offset, transform;

    function getMousePostition(evt) {
        let CTM = svg.getScreenCTM();
        return {
            x: ((evt.clientX - CTM.e) / CTM.a)*10,
            y: ((evt.clientY - CTM.f) / CTM.d)*10
        };
    }

    function startDrag(evt) {
        if(evt.target.classList.contains('draggable')) {

            selectedElement = evt.target;
            
            offset = getMousePostition(evt);

            // Getting already applied transforms on this element
            let transforms = selectedElement.transform.baseVal;

            // Ensure first element is translate transform
            if(transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                let translate = svg.createSVGTransform();
                translate.setTranslate(0, 0);

                selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            }

            // Getting initial translation amount
            transform = transforms.getItem(0);
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;

        }
    }

    function drag(evt) {
        if(selectedElement) {
            evt.preventDefault();
            let coord = getMousePostition(evt);
            let dx = coord.x - offset.x;
            let dy = coord.y - offset.y;
            
            transform.setTranslate(dx, dy);
        }
    }

    function endDrag(evt) {
        selectedElement = null;
    }
}

/* Loading of Image into DOM */

const svgWindow = document.querySelector('#root');
const mainWindow = svgWindow.querySelector('#main-group');

window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = svgWindow.querySelector('#workspace-img');
            img.setAttribute('href', URL.createObjectURL(this.files[0]));
            img.onload = 
            function() {
                this.setAttribute('width', 100);
                this.setAttribute('height', 100);
            };
        }
    });
});

/* Creating ckt upon clicking create-ckt button */

const createCktBtn = document.querySelector('#create-ckt');

createCktBtn.addEventListener('click', () => {
    const components = Array.from(mainWindow.children);
    const closeledArray = components.filter(component => component.classList.contains('closeLegsLED'));
    const openledArray = components.filter(component => component.classList.contains('openLegsLED'));
    const battery9V = components.filter(component => component.classList.contains('9VBattery'));
    const battery5V = components.filter(component => component.classList.contains('5VBattery'));
    const bResistor = components.filter(component => component.classList.contains('bResistors'));
    const sResistor = components.filter(component => component.classList.contains('sResistors'));
    const magneticSensor = components.filter(component => component.classList.contains('magneticSensor'));
    const lightSensor = components.filter(component => component.classList.contains('lightSensor'));
    const bDiode = components.filter(component => component.classList.contains('bDiode'));
    const sDiode = components.filter(component => component.classList.contains('sDiode'));
    const tilt01 = components.filter(component => component.classList.contains('tilt01'));
    const tilt02 = components.filter(component => component.classList.contains('tilt02'));
    const buzzer = components.filter(component => component.classList.contains('buzzer'));


    let posX1Battery, posY1Battery, posX2Battery, posY2Battery;
    let posX1Comp, posY1Comp, posX2Comp, posY2Comp, CompHeight;
    // let posX1Res, posY1Res, posX2Res, posY2Res, CompHeight;
    // let posX1Swi, posY1Swi, posX2Swi, posY2Swi, SwiWidth, SwiHeight;

    if ((closeledArray.length != 0 || openledArray != 0) && (battery9V.length != 0 || battery5V.length !=0)) {
        if(!$('#led-container').is(':hidden')) {
            $('#led-container').slideToggle();
        }
        if(!$('#battery-container').is(':hidden')) {
            $('#battery-container').slideToggle();
        }
        if(!$('#resistor-container').is(':hidden')) {
            $('#resistor-container').slideToggle();
        }
        if(!$('#sensor-container').is(':hidden')) {
            $('#sensor-container').slideToggle();
        }
        if(!$('#buzzer-container').is(':hidden')) {
            $('#buzzer-container').slideToggle();
        }
        $('#led-btn').attr('disabled', true);
        $('#battery-btn').attr('disabled', true);
        $('#resistor-btn').attr('disabled', true);
        $('#switch-btn').attr('disabled', true);
        $('#buzzer-btn').attr('disabled', true);
        createCktBtn.setAttribute('disabled', true);
    }
    let ledDist = [];

    closeledArray.forEach(led => {
        let posX = 0, posY = 70;
        
        if(led.classList.contains('closeLeg')){
            alert('welcome');
        }

        const transforms = led.children[0].transform.baseVal;

        if (transforms.length != 0) {
            const translate = transforms.getItem(0);        
            posX = translate.matrix.e + 0;
            posY = translate.matrix.f + 70;
        }

        const dis = Math.sqrt(Math.pow(posX,2) + Math.pow(posY-70,2));
        
        const obj = {
            led: led,
            x: posX,
            y: posY,
            dis: dis,
            legs: 'close'
        }
        ledDist.push(obj);
    });

    openledArray.forEach(led => {
        let posX = 0, posY = 49;
        debugger;
        if(led.classList.contains('closeLeg')){
            alert('welcome');
        }

        const transforms = led.children[0].transform.baseVal;

        if (transforms.length != 0) {
            const translate = transforms.getItem(0);        
            posX = translate.matrix.e + 0;
            posY = translate.matrix.f + 49;
        }

        const dis = Math.sqrt(Math.pow(posX,2) + Math.pow(posY-49,2));
        
        const obj = {
            led: led,
            x: posX,
            y: posY,
            dis: dis,
            legs: 'open'
        }
        ledDist.push(obj);
    });
    
    ledDist.sort((a, b) => a.dis-b.dis);

    for(let i = 0; i<ledDist.length-1; ++i) {
        let x1 = ledDist[i].x;
        if(ledDist[i].legs === 'close')
            x1 += 30;
        else
            x1 += 60; 
        const y1 = ledDist[i].y;
        const x2 = ledDist[i+1].x;
        const y2 = ledDist[i+1].y;

        if((x2-x1)>0){
            const xmid = (x1+x2)/2;
            const html1 = "<line class='connecting-wires' x1="+x1+" y1="+y1+" x2="+xmid+" y2="+y1+" transform=\"scale(0.09)\" style=\"stroke: green;stroke-width:5mm;stroke-linecap: round;z-index: -1;\" />";
            const html2 = "<line class='connecting-wires' x1="+xmid+" y1="+y1+" x2="+xmid+" y2="+y2+" transform=\"scale(0.09)\" style=\"stroke: green;stroke-width:5mm;stroke-linecap: round;z-index: -1;\" />";
            const html3 = "<line class='connecting-wires' x1="+xmid+" y1="+y2+" x2="+x2+" y2="+y2+" transform=\"scale(0.09)\" style=\"stroke: green;stroke-width:5mm;stroke-linecap: round;z-index: -1;\" />";
            mainWindow.insertAdjacentHTML('beforeend', html1);
            mainWindow.insertAdjacentHTML('beforeend', html2);
            mainWindow.insertAdjacentHTML('beforeend', html3);
        }
        else{
            const ymid = (y1+y2)/2;

            const html1 = "<line class='connecting-wires' x1="+x1+" y1="+y1+" x2="+x1+" y2="+ymid+" transform=\"scale(0.09)\" style=\"stroke: green;stroke-width:5mm;stroke-linecap: round;z-index: -1;\" />";
            const html2 = "<line class='connecting-wires' x1="+x1+" y1="+ymid+" x2="+x2+" y2="+ymid+" transform=\"scale(0.09)\" style=\"stroke: green;stroke-width:5mm;stroke-linecap: round;z-index: -1;\" />";
            const html3 = "<line class='connecting-wires' x1="+x2+" y1="+ymid+" x2="+x2+" y2="+y2+" transform=\"scale(0.09)\" style=\"stroke: green;stroke-width:5mm;stroke-linecap: round;z-index: -1;\" />";
            mainWindow.insertAdjacentHTML('beforeend', html1);
            mainWindow.insertAdjacentHTML('beforeend', html2);
            mainWindow.insertAdjacentHTML('beforeend', html3);
        }
    }

    /* Connecting to Battery */


    if(battery9V.length != 0) {
        // console.log('9v battery');

        posX1Battery = 25;
        posY1Battery = 0;
        posX2Battery = 75;
        posY2Battery = 0;

        const transformsBattery = battery9V[0].children[0].transform.baseVal;

        if (transformsBattery.length != 0) {
            const translateBattery = transformsBattery.getItem(0);
            
            posX1Battery = translateBattery.matrix.e + 25;
            posY1Battery = translateBattery.matrix.f + 0;
            posX2Battery = translateBattery.matrix.e + 75;
            posY2Battery = translateBattery.matrix.f + 0;
        }
    }
    else if(battery5V.length != 0) {
        // console.log('5v battery');

        posX1Battery = 0;
        posY1Battery = 61;
        posX2Battery =  209;
        posY2Battery = 61;
        
        const transformsBattery = battery5V[0].children[0].transform.baseVal;

        if (transformsBattery.length != 0) {
            const translateBattery = transformsBattery.getItem(0);
            
            posX1Battery = translateBattery.matrix.e + 0;
            posY1Battery = translateBattery.matrix.f + 61;
            posX2Battery = translateBattery.matrix.e + 209;
            posY2Battery = translateBattery.matrix.f + 61;
        }
    }

    if(bResistor.length != 0) {
        
        posX1Comp = 0;
        posY1Comp = 37;
        posX2Comp = 90;
        posY2Comp = 37;
        CompHeight = 37;

        const transformsResistor = bResistor[0].children[0].transform.baseVal;

        if (transformsResistor.length != 0) {
            const translateResistor = transformsResistor.getItem(0);
            
            posX1Comp = translateResistor.matrix.e + 0;
            posY1Comp = translateResistor.matrix.f + 37;
            posX2Comp = translateResistor.matrix.e + 90;
            posY2Comp = translateResistor.matrix.f + 37;
        }
    }
    else if(sResistor.length != 0) {
        
        posX1Comp = 0;
        posY1Comp = 15;
        posX2Comp = 120;
        posY2Comp = 15;
        CompHeight = 15;

        const transformsResistor = sResistor[0].children[0].transform.baseVal;

        if (transformsResistor.length != 0) {
            const translateResistor = transformsResistor.getItem(0);
            
            posX1Comp = translateResistor.matrix.e + 0;
            posY1Comp = translateResistor.matrix.f + 15;
            posX2Comp = translateResistor.matrix.e + 120;
            posY2Comp = translateResistor.matrix.f + 15;
        }
    }

    if(magneticSensor.length != 0) {
        
        posX1Comp = 0;
        posY1Comp = 55;
        posX2Comp = 150;
        posY2Comp = 55;
        CompHeight = 55;

        const transformsSwi = magneticSensor[0].children[0].transform.baseVal;

        if (transformsSwi.length != 0) {
            const translateSwi = transformsSwi.getItem(0);
            
            posX1Comp = translateSwi.matrix.e + 0;
            posY1Comp = translateSwi.matrix.f + 55;
            posX2Comp = translateSwi.matrix.e + 150;
            posY2Comp = translateSwi.matrix.f + 55;
        }
    }
    else if(lightSensor.length != 0) {
        
        posX1Comp = 0;
        posY1Comp = 26;
        posX2Comp = 210;
        posY2Comp = 13;
        CompHeight = 26;

        const transformsSwi = lightSensor[0].children[0].transform.baseVal;

        if (transformsSwi.length != 0) {
            const translateSwi = transformsSwi.getItem(0);
            
            posX1Comp = translateSwi.matrix.e + 0;
            posY1Comp = translateSwi.matrix.f + 26;
            posX2Comp = translateSwi.matrix.e + 210;
            posY2Comp = translateSwi.matrix.f + 13;
        }
    }
    else if(bDiode.length != 0) {
        
        posX1Comp = 0;
        posY1Comp = 59;
        posX2Comp = 105;
        posY2Comp = 59;
        CompHeight = 59;

        const transformsSwi = bDiode[0].children[0].transform.baseVal;

        if (transformsSwi.length != 0) {
            const translateSwi = transformsSwi.getItem(0);
            
            posX1Comp = translateSwi.matrix.e + 0;
            posY1Comp = translateSwi.matrix.f + 59;
            posX2Comp = translateSwi.matrix.e + 105;
            posY2Comp = translateSwi.matrix.f + 59;
        }
    }
    else if(sDiode.length != 0) {
        
        posX1Comp = 0;
        posY1Comp = 11;
        posX2Comp = 225;
        posY2Comp = 11;
        CompHeight = 11;

        const transformsSwi = sDiode[0].children[0].transform.baseVal;

        if (transformsSwi.length != 0) {
            const translateSwi = transformsSwi.getItem(0);
            
            posX1Comp = translateSwi.matrix.e + 0;
            posY1Comp = translateSwi.matrix.f + 11;
            posX2Comp = translateSwi.matrix.e + 225;
            posY2Comp = translateSwi.matrix.f + 11;
        }
    }
    else if(tilt01.length != 0) {
        
        posX1Comp = 12;
        posY1Comp = 105;
        posX2Comp = 84;
        posY2Comp = 66;
        CompHeight = 80;

        const transformsSwi = tilt01[0].children[0].transform.baseVal;

        if (transformsSwi.length != 0) {
            const translateSwi = transformsSwi.getItem(0);
            
            posX1Comp = translateSwi.matrix.e + 12;
            posY1Comp = translateSwi.matrix.f + 105;
            posX2Comp = translateSwi.matrix.e + 84;
            posY2Comp = translateSwi.matrix.f + 66;
        }
    }
    else if(tilt02.length != 0) {
        
        posX1Comp = 0;
        posY1Comp = 10;
        posX2Comp = 150;
        posY2Comp = 10;
        CompHeight = 10;

        const transformsSwi = tilt02[0].children[0].transform.baseVal;

        if (transformsSwi.length != 0) {
            const translateSwi = transformsSwi.getItem(0);
            
            posX1Comp = translateSwi.matrix.e + 0;
            posY1Comp = translateSwi.matrix.f + 10;
            posX2Comp = translateSwi.matrix.e + 150;
            posY2Comp = translateSwi.matrix.f + 10;
        }
    }
    else if(buzzer.length != 0) {
        
        posX1Comp = 0;
        posY1Comp = 75;
        posX2Comp = 60;
        posY2Comp = 73;
        CompHeight = 75;

        const transformsSwi = buzzer[0].children[0].transform.baseVal;

        if (transformsSwi.length != 0) {
            const translateSwi = transformsSwi.getItem(0);
            
            posX1Comp = translateSwi.matrix.e + 0;
            posY1Comp = translateSwi.matrix.f + 10;
            posX2Comp = translateSwi.matrix.e + 150;
            posY2Comp = translateSwi.matrix.f + 10;
        }
    }

    if(battery9V.length != 0 && (bResistor.length==0 && sResistor.length==0) && (magneticSensor.length==0 && lightSensor.length==0) && (sDiode.length==0 && bDiode.length==0) && (tilt01.length==0 && tilt02.length==0) && buzzer.length==0) {
        /* Connecting positive Terminal */
        {
            let posHTML;
            const x1 = ledDist[0].x;
            const y1 = ledDist[0].y;
            const x2 = posX1Battery;
            const y2 = posY1Battery;
            if(y1 < y2) {
                const ymid = (y1+y2)/2;
                posHTML = "<path class='connecting-wires' d='M"+x1+","+y1+" L"+x1+","+ymid+"L"+x2+","+ymid+" L"+x2+","+y2+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
            }
            else {
                if((x1+35<x2-25 && ledDist[0].legs === 'close') || (x1+65<x2-25 && ledDist[0].legs === 'open')) {
                    if((y1-70<y2 && ledDist[0].legs==='close') || (y1-50<y2 && ledDist[0].legs==='open')) {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2-70)+" L"+(x1-20)+","+(y2-70)+" L"+(x1-20)+","+(y1)+" L"+(x1)+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x1-20)+","+y2+" L"+(x1-20)+","+y1+" L"+(x1)+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else if(x1 > x2+70) {
                    if(y1 < y2+153) {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2-35)+","+y2+" L"+(x2-35)+","+(y2+160)+" L"+x1+","+(y2+160)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2-35)+","+y2+" L"+(x2-35)+","+(y1)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else{
                    if((y1-70 > y2 +153 && ledDist[0].legs==='close') || (y1-50 > y2 +153 && ledDist[0].legs==='open')){
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2-35)+","+y2+" L"+(x2-35)+","+(y1)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        alert("Led is over the Battery!");
                    }
                }
            }
            mainWindow.insertAdjacentHTML('beforeend', posHTML);
        }
        
        /* Connecting negative Terminal */ 
        {
            let negHTML;
            let x1 = ledDist[ledDist.length-1].x;
            if(ledDist[ledDist.length-1].legs === 'close')
                x1 += 30;
            else
                x1 += 60; 
            const y1 = ledDist[ledDist.length-1].y;
            const x2 = posX2Battery;
            const y2 = posY2Battery;
            debugger;
            if(y1 < y2) {
                const negymid = (y1+y2)/2;
                negHTML = "<path class='connecting-wires' d='M"+x1+","+y1+" L"+x1+","+negymid+"L"+x2+","+negymid+" L"+x2+","+y2+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
            }
            else{
                if((x2+20<x1-35 && ledDist[ledDist.length-1].legs === 'close') || (x2+20<x1-65 && ledDist[ledDist.length-1].legs === 'open')) {
                    if((y1-70<y2 && ledDist[0].legs==='close') || (y1-50<y2 && ledDist[0].legs==='open')) {
                        negHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2-70)+" L"+(x1+20)+","+(y2-70)+" L"+(x1+20)+","+(y1)+" L"+(x1)+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        negHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x1+20)+","+y2+"L"+(x1+20)+","+y1+"L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else if(x1 < x2-75) {
                    if(y1 < y2+153) {
                        negHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2+30)+","+y2+"L"+(x2+30)+","+(y2+160)+" L"+x1+","+(y2+160)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        negHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2+30)+","+y2+"L"+(x2+30)+","+(y1)+" L"+x1+","+(y1)+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else {
                    if((y1-70 > y2 +153 && ledDist[0].legs==='close') || (y1-50 > y2 +153 && ledDist[0].legs==='open')) {
                        negHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2+30)+","+y2+"L"+(x2+30)+","+(y1)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        alert("Led is over the Battery!");
                    }
                }
            }
            mainWindow.insertAdjacentHTML('beforeend', negHTML);
        }
    }
    else if(battery5V.length != 0 && (bResistor.length==0 && sResistor.length==0) && (magneticSensor.length==0 && lightSensor.length==0) && (sDiode.length==0 && bDiode.length==0) && (tilt01.length==0 && tilt02.length==0) && buzzer.length==0) {
        /* Connecting positive Terminal */
        {
            let posHTML;
            const x1 = ledDist[0].x;
            const y1 = ledDist[0].y;
            const x2 = posX1Battery;
            const y2 = posY1Battery;
            if(y1 < y2-61) {
                const ymid = (y1+y2)/2;
                posHTML = "<path class='connecting-wires' d='M"+x1+","+y1+" L"+x1+","+ymid+"L"+x2+","+ymid+" L"+x2+","+y2+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
            }
            else {
                if((x1+35<x2 && ledDist[0].legs === 'close') || (x1+65<x2 && ledDist[0].legs === 'open')) {
                    if((y1-70<y2 && ledDist[0].legs==='close') || (y1-50<y2 && ledDist[0].legs==='open')) {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2-130)+" L"+(x1-20)+","+(y2-130)+" L"+(x1-20)+","+(y1)+" L"+(x1)+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x1-20)+","+y2+" L"+(x1-20)+","+y1+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else if(x1 > x2+210) {
                    if(y1 < y2+45) {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2+55)+" L"+(x1)+","+(y2+55)+" L"+x1+","+(y1)+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y1)+" L"+x1+","+(y1)+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else{
                    if((y1-70 > y2 + 45 && ledDist[0].legs==='close') || (y1-50 > y2 + 45 && ledDist[0].legs==='open')){
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2+50)+" L"+x1+","+(y1)+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        alert("Led is over the Battery!");
                    }
                }
            }
            mainWindow.insertAdjacentHTML('beforeend', posHTML);
        }
        
        /* Connecting negative Terminal */ 
        {
            let negHTML;
            let x1 = ledDist[ledDist.length-1].x;
            if(ledDist[ledDist.length-1].legs === 'close')
                x1 += 30;
            else
                x1 += 60; 
            const y1 = ledDist[ledDist.length-1].y;
            const x2 = posX2Battery;
            const y2 = posY2Battery;
            if(y1 < y2-61) {
                const negymid = (y1+y2)/2;
                negHTML = "<path class='connecting-wires' d='M"+x1+","+y1+" L"+x1+","+negymid+" L"+x2+","+negymid+" L"+x2+","+y2+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
            }
            else{
                if((x1-35>x2 && ledDist[0].legs === 'close') || (x1-65>x2 && ledDist[0].legs === 'open')) {
                    if((y1-70<y2 && ledDist[0].legs==='close') || (y1-50<y2 && ledDist[0].legs==='open')) {
                        negHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2-130)+" L"+(x1+20)+","+(y2-130)+" L"+(x1+20)+","+(y1)+" L"+(x1)+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        negHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x1+20)+","+y2+" L"+(x1+20)+","+y1+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else if(x1 < x2-210) {
                    if(y1 < y2+45) {
                        negHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2+50)+" L"+(x1)+","+(y2+50)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        negHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y1)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else {
                    if((y1-70 > y2 + 45 && ledDist[0].legs==='close') || (y1-50 > y2 + 45 && ledDist[0].legs==='open')){
                        negHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y1)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(0,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        alert("Led is over the Battery!");
                    }
                }
            }
            mainWindow.insertAdjacentHTML('beforeend', negHTML);
        }
    }
    else if(battery9V.length != 0 && (bResistor.length!=0 || sResistor.length!=0 || magneticSensor.length!=0 || lightSensor.length!=0 || sDiode.length!=0 || bDiode.length!=0 || tilt01.length!=0 || tilt02.length!=0 || buzzer.length!=0)) {
        /* Connecting positive Terminal */
        {
            let posHTML;
            const x1 = ledDist[0].x;
            const y1 = ledDist[0].y;
            const x2 = posX1Battery;
            const y2 = posY1Battery;
            if(y1 < y2) {
                const ymid = (y1+y2)/2;
                posHTML = "<path class='connecting-wires' d='M"+x1+","+y1+" L"+x1+","+ymid+"L"+x2+","+ymid+" L"+x2+","+y2+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
            }
            else {
                if((x1+35<x2-25 && ledDist[0].legs === 'close') || (x1+65<x2-25 && ledDist[0].legs === 'open')) {
                    if((y1-70<y2 && ledDist[0].legs==='close') || (y1-50<y2 && ledDist[0].legs==='open')) {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2-70)+" L"+(x1-20)+","+(y2-70)+" L"+(x1-20)+","+(y1)+" L"+(x1)+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x1-20)+","+y2+" L"+(x1-20)+","+y1+" L"+(x1)+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else if(x1 > x2+70) {
                    if(y1 < y2+153) {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2-35)+","+y2+" L"+(x2-35)+","+(y2+160)+" L"+x1+","+(y2+160)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2-35)+","+y2+" L"+(x2-35)+","+(y1)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else{
                    if((y1-70 > y2 +153 && ledDist[0].legs==='close') || (y1-50 > y2 +153 && ledDist[0].legs==='open')){
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2-35)+","+y2+" L"+(x2-35)+","+(y1)+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        alert("Led is over the Battery!");
                    }
                }
            }
            mainWindow.insertAdjacentHTML('beforeend', posHTML);
        }    
        /* Connecting negative Terminal */ 
        {
            let negHTML;
            let x1 = ledDist[ledDist.length-1].x;
            if(ledDist[ledDist.length-1].legs === 'close')
                x1 += 30;
            else
                x1 += 60; 
            const y1 = ledDist[ledDist.length-1].y;
            const x2 = posX2Battery;
            const y2 = posY2Battery;
            const x3 = posX1Comp;
            const y3 = posY1Comp;
            const x4 = posX2Comp;
            const y4 = posY2Comp;
            if(x3<x1){
                mainWindow.insertAdjacentHTML('beforeend', "<polyline class='connecting-wires' points='"+x1+","+y1+" "+(x1)+","+((y1+y3)/2)+" "+(x3)+","+((y1+y3)/2)+" "+x3+","+y3+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:green;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>");
            }
            else {
                mainWindow.insertAdjacentHTML('beforeend', "<polyline class='connecting-wires' points='"+x1+","+y1+" "+((x1+x3)/2)+","+(y1)+" "+((x1+x3)/2)+","+(y3)+" "+x3+","+y3+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:green;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>");
            }
            debugger;
            if(y3<y2) {
                negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x2)+","+((y2+y4)/2)+" "+x4+","+((y2+y4)/2)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
            }
            else{
                if(x3>x2+21) {
                    if(y3-CompHeight<y2) {
                        negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x2+30)+","+(y2)+" "+(x2+30)+","+(y4+10)+" "+(x4)+","+(y4+10)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x4+20)+","+(y2)+" "+(x4+20)+","+(y4)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else if(x4<x2-75) {
                    if(y3<y2+153){
                        negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x2+30)+","+(y2)+" "+(x2+30)+","+(y2+155)+" "+x4+","+(y2+155)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x2+30)+","+(y2)+" "+(x2+30)+","+(y4)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else{
                    if(y3>y2+153){
                        negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x2+30)+","+(y2)+" "+(x2+30)+","+(y4)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        alert('Resistor is on Battery!');
                    }
                }
            }
            mainWindow.insertAdjacentHTML('beforeend', negHTML);
        }
    }
    else if(battery5V.length != 0 && (bResistor.length!=0 || sResistor.length!=0 || magneticSensor.length!=0 || lightSensor.length!=0 || sDiode.length!=0 || bDiode.length!=0 || tilt01.length!=0 || tilt02.length!=0 || buzzer.length!=0)) {
        /* Connecting positive Terminal */
        {
            let posHTML;
            const x1 = ledDist[0].x;
            const y1 = ledDist[0].y;
            const x2 = posX1Battery;
            const y2 = posY1Battery;
            if(y1 < y2-61) {
                const ymid = (y1+y2)/2;
                posHTML = "<path class='connecting-wires' d='M"+x1+","+y1+" L"+x1+","+ymid+"L"+x2+","+ymid+" L"+x2+","+y2+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
            }
            else {
                if((x1+35<x2 && ledDist[0].legs === 'close') || (x1+65<x2 && ledDist[0].legs === 'open')) {
                    if((y1-70<y2 && ledDist[0].legs==='close') || (y1-50<y2 && ledDist[0].legs==='open')) {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2-70)+" L"+(x1-20)+","+(y2-70)+" L"+(x1-20)+","+(y1)+" L"+(x1)+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x1-20)+","+y2+" L"+(x1-20)+","+y1+" L"+x1+","+y1+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else if(x1 > x2+210) {
                    if(y1 < y2+45) {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2+55)+" L"+(x1)+","+(y2+55)+" L"+x1+","+(y1)+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else {
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y1)+" L"+x1+","+(y1)+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else{
                    if((y1-70 > y2 + 45 && ledDist[0].legs==='close') || (y1-50 > y2 + 45 && ledDist[0].legs==='open')){
                        posHTML = "<path class='connecting-wires' d='M"+x2+","+y2+" L"+(x2)+","+(y2+50)+" L"+x1+","+(y1)+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:rgb(255,0,0);stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        alert("Led is over the Battery!");
                    }
                }
            }
            mainWindow.insertAdjacentHTML('beforeend', posHTML);
        }
        
        /* Connecting negative Terminal */ 
        {
            let negHTML;
            let x1 = ledDist[ledDist.length-1].x;
            if(ledDist[ledDist.length-1].legs === 'close')
                x1 += 30;
            else
                x1 += 60; 
            const y1 = ledDist[ledDist.length-1].y;
            const x2 = posX2Battery;
            const y2 = posY2Battery;
            const x3 = posX1Comp;
            const y3 = posY1Comp;
            const x4 = posX2Comp;
            const y4 = posY2Comp;
            if(x3<x1){
                mainWindow.insertAdjacentHTML('beforeend', "<polyline class='connecting-wires' points='"+x1+","+y1+" "+(x1)+","+((y1+y3)/2)+" "+(x3)+","+((y1+y3)/2)+" "+x3+","+y3+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:green;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>");
            }
            else {
                mainWindow.insertAdjacentHTML('beforeend', "<polyline class='connecting-wires' points='"+x1+","+y1+" "+((x1+x3)/2)+","+(y1)+" "+((x1+x3)/2)+","+(y3)+" "+x3+","+y3+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:green;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>");
            }
            debugger;
            if(y3<y2-61) {
                negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x2)+","+((y2+y4)/2)+" "+x4+","+((y2+y4)/2)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
            }
            else{
                if(x3>x2) {
                    if(y3-CompHeight<y2) {
                        negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x2)+","+(y1+15)+" "+(x4)+","+(y1+15)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x4+20)+","+(y2)+" "+(x4+20)+","+(y4)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else if(x4<x2-75) {
                    if(y3<y2+153){
                        negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x2)+","+(y2+45)+" "+(x4)+","+(y2+45)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x2)+","+(y4)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                }
                else{
                    if(y3>y2+153){
                        negHTML = "<polyline class='connecting-wires' points='"+x2+","+y2+" "+(x2)+","+(y4)+" "+x4+","+y4+"' transform=\"scale(0.09)\" style=\"fill:none; stroke:black;stroke-width:5mm;stroke-linecap: round;z-index: -1;\"/>";
                    }
                    else{
                        alert('Resistor is on Battery!');
                    }
                }
            }
            mainWindow.insertAdjacentHTML('beforeend', negHTML);
        }
    }
})

/* Resetting the connections */
$('#reset-wire-ckt').click( () => {
    debugger;
    $('.connecting-wires').remove();
    $('#led-btn').attr('disabled', false);
    $('#battery-btn').attr('disabled', false);
    $('#resistor-btn').attr('disabled', false);
    $('#switch-btn').attr('disabled', false);
    createCktBtn.disabled = false;
});

/* Resetting the circuit */

const resetBtn = document.querySelector('#reset-ckt');

resetBtn.addEventListener('click', () => {
    if(mainWindow.innerHTML != '') {
        mainWindow.innerHTML = '';
        $('#led-btn').attr('disabled', false);
        $('#battery-btn').attr('disabled', false);
        $('#resistor-btn').attr('disabled', false);
        $('#switch-btn').attr('disabled', false);
        $('#buzzer-btn').attr('disabled', false);
        $('#led-container').find(".leds").attr('disabled', false);
        $('#battery-container').find(".batterys").attr('disabled', false);
        $('#resistor-container').find('.resistors').attr('disabled', false);
        $('#magnetic-container').find('.sensor').attr('disabled', false);
        $('#light-container').find('.sensor').attr('disabled', false);
        $('#diode-container').find('.sensor').attr('disabled', false);
        $('#tilt-container').find('.sensor').attr('disabled', false);
        $('#buzzer-container').find('.buzzer').attr('disabled', false);
        createCktBtn.disabled = false;
    }
})

/* Making it downloadable */

function svgDataURL(svg) {
  var svgAsXML = (new XMLSerializer).serializeToString(svg);
  return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
}

function download() {
    const $downloadLink = document.createElement('a');
    let clnSvgWindow = svgWindow.cloneNode(true);
    // clnSvgWindow.removeChild(clnSvgWindow.querySelector('#workspace-img'));
    const dataURL = svgDataURL(clnSvgWindow);
    $downloadLink.setAttribute('href', dataURL);
    $downloadLink.setAttribute('download', 'circuit.svg');
    $downloadLink.click();
    window.print();
}


/* Element Lists */

$('#led-container').hide();
$('#battery-container').hide();
$('#resistor-container').hide();
$('#sensor-container').hide();
$('#magnetic-container').hide();
$('#light-container').hide();
$('#diode-container').hide();
$('#tilt-container').hide();
$('#buzzer-container').hide();

$('#led-btn').click( () => {
    $('#led-container').slideToggle();
});
$('#battery-btn').click( () => {
    $('#battery-container').slideToggle();
});
$('#resistor-btn').click( () => {
     $('#resistor-container').slideToggle();
});
$('#switch-btn').click( () => {
    $('#sensor-container').slideToggle();
});
$('#magnetic-btn').click( () => {
    $('#magnetic-container').slideToggle();
});
$('#light-btn').click( () => {
    $('#light-container').slideToggle();
});
$('#diode-btn').click( () => {
    $('#diode-container').slideToggle();
});
$('#tilt-btn').click( () => {
    $('#tilt-container').slideToggle();
});
$('#buzzer-btn').click( () => {
    $('#buzzer-container').slideToggle();
});

$('#led01').click( () => {
    mainWindow.insertAdjacentHTML('beforeend',$('#greenLED01').html());
});
$('#led02').click( () => {
    mainWindow.insertAdjacentHTML('beforeend',$('#redLED01').html());
});
$('#led03').click( () => {
    mainWindow.insertAdjacentHTML('beforeend',$('#blueLED01').html());
});
$('#led04').click( () => {
    mainWindow.insertAdjacentHTML('beforeend',$('#yellowLED01').html());
});
$('#led05').click( () => {
    mainWindow.insertAdjacentHTML('beforeend',$('#greenLED02').html());
});
$('#led06').click( () => {
    mainWindow.insertAdjacentHTML('beforeend',$('#redLED02').html());
});
$('#led07').click( () => {
    mainWindow.insertAdjacentHTML('beforeend',$('#blueLED02').html());
});
$('#led08').click( () => {
    mainWindow.insertAdjacentHTML('beforeend',$('#yellowLED02').html());
});

$('#battery01').click( () => {
    $('#battery01').attr('disabled', true);
    $('#battery02').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#battery-template').html());
});
$('#battery02').click( () => {
    $('#battery01').attr('disabled', true);
    $('#battery02').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#battery-template02').html());
});

$('#comp01').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r1').html());
});
$('#comp02').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r2').html());
});
$('#comp03').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r3').html());
});
$('#comp04').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r9').html());
});
$('#comp05').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r10').html());
});
$('#comp06').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r11').html());
});
$('#comp07').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r21').html());
});
$('#comp08').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r22').html());
});
$('#comp09').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r25').html());
});
$('#comp10').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r23').html());
});
$('#comp11').click( () => {
    $('#resistor-container').find('.resistors').attr('disabled', true);
    $('#sensor-container').find('.sensor').attr('disabled', true);
    $('#buzzer-container').find('.buzzer').attr('disabled', true);
    mainWindow.insertAdjacentHTML('beforeend', $('#r12').html());
});