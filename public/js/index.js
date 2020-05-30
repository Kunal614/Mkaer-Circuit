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
            // console.log(selectedElement);
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
            transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
        }
    }

    function endDrag(evt) {
        selectedElement = null;
    }
}

/* Loading of Image into DOM */

const $svgWindow = document.querySelector('#root');
const $mainWindow = $svgWindow.querySelector('#main-group');

window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = $svgWindow.querySelector('#workspace-img');
            img.setAttribute('href', URL.createObjectURL(this.files[0]));
            img.onload = imageIsLoaded;
        }
    });
});

function imageIsLoaded() {
    this.setAttribute('width', 100);
    this.setAttribute('height', 100);
}

/* Loading of LED & Battery upon clicking respective buttons */

const $ledBtn = document.querySelector('#led-btn');
const $batteryBtn = document.querySelector('#battery-btn');
const $ledTemplate = document.querySelector('#led-template').innerHTML;
const $batteryTemplate = document.querySelector('#battery-template').innerHTML;

$ledBtn.addEventListener('click', () => {
    const html = Mustache.render($ledTemplate);
    $mainWindow.insertAdjacentHTML('beforeend', html);
})  

$batteryBtn.addEventListener('click', () => {
    $batteryBtn.setAttribute('disabled', true);
    const html = Mustache.render($batteryTemplate);
    $mainWindow.insertAdjacentHTML('beforeend', html);
})

/* Creating ckt upon clicking create-ckt button */

const $createCktBtn = document.querySelector('#create-ckt');
const $ledWireTemplate = document.querySelector('#led-wire-template').innerHTML;
const $batteryWireTemplate = document.querySelector('#battery-wire-template').innerHTML;

$createCktBtn.addEventListener('click', () => {
    const components = Array.from($mainWindow.children);
    const ledArray = components.filter(component => component.classList.contains('LEDRed'));
    const battery = components.filter(component => component.classList.contains('9VBattery'));
    if (ledArray.length != 0 && battery.length != 0) {
        $ledBtn.setAttribute('disabled', true);
        $batteryBtn.setAttribute('disabled', true);
        $createCktBtn.setAttribute('disabled', true);
    }
    let ledDist = []

    ledArray.forEach(led => {
        let posX = 15.98, posY = 58.94;

        const transforms = led.children[0].transform.baseVal;

        if (transforms.length != 0) {
            const translate = transforms.getItem(0);
        
            posX = translate.matrix.e + 15.98;
            posY = translate.matrix.f + 58.94;
        }

        const dis = Math.sqrt(Math.pow(posX,2) + Math.pow(posY,2));
        const obj = {
            led: led,
            x: posX,
            y: posY,
            dis: dis,
        }
        ledDist.push(obj);
    });
    ledDist.sort((a, b) => a.dis-b.dis);
    for(let i = 0; i<ledDist.length-1; ++i) {
        const html = Mustache.render($ledWireTemplate, {
            x1: ledDist[i].x,
            y1: ledDist[i].y,
            x2: ledDist[i+1].x - 8.98,
            y2: ledDist[i+1].y
        })
        $mainWindow.insertAdjacentHTML('beforeend', html);
    }

    /* Connecting to Battery */

    let posX1 = 10, posY1 = 20.85, posX2 = 10, posY2 = 23.85;

    const transforms = battery[0].children[0].transform.baseVal;

    if (transforms.length != 0) {
        const translate = transforms.getItem(0);
        
        posX1 = translate.matrix.e + 1.98;
        posY1 = translate.matrix.f + 18.85;
        posX2 = translate.matrix.e + 10;
        posY2 = translate.matrix.f + 20.85;
    }

    /* Connecting positive Terminal */
    const posHTML = Mustache.render($batteryWireTemplate, {    
        x1: ledDist[0].x - 8.98,
        y1: ledDist[0].y,
        x2: posX1,
        y2: posY1
    });
    $mainWindow.insertAdjacentHTML('beforeend', posHTML);

    /* Connecting negative Terminal */ 
    const negHTML = Mustache.render($batteryWireTemplate, {
        x1: ledDist[ledDist.length-1].x,
        y1: ledDist[ledDist.length-1].y,
        x2: posX2,
        y2: posY2
    });

    $mainWindow.insertAdjacentHTML('beforeend', negHTML);
})

/* Resetting the circuit */

const $resetBtn = document.querySelector('#reset-ckt');

$resetBtn.addEventListener('click', () => {
    if($mainWindow.innerHTML != '') {
        $mainWindow.innerHTML = '';
        $ledBtn.disabled = false;
        $batteryBtn.disabled = false;
        $createCktBtn.disabled = false;
    }
})

/* Making it downloadable */

function svgDataURL(svg) {
  var svgAsXML = (new XMLSerializer).serializeToString(svg);
  return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
}

function download() {
    const $downloadLink = document.createElement('a');
    let clnSvgWindow = $svgWindow.cloneNode(true);
    clnSvgWindow.removeChild(clnSvgWindow.querySelector('#workspace-img'));
    const dataURL = svgDataURL(clnSvgWindow);
    $downloadLink.setAttribute('href', dataURL);
    $downloadLink.setAttribute('download', 'circuit.svg');
    $downloadLink.click();
    window.print();
}
  