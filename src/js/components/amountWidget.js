import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class amountWidget extends BaseWidget{  // rozszerzenie klasy BaseWidget 
  constructor(element){
    super(element, settings.amountWidget.defaultValue); // odwo\lanie do konstruktora klasy nadrzędnej ; Super - oznacza konstruktora klasy BaseWidget 
    const thisWidget = this;
    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
    thisWidget.getElements(element);
    // thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue); // wartość startowa ..... albo ......
    thisWidget.initActions();
  }

  getElements(/*element*/){
    const thisWidget = this;
    // thisWidget.element = element; - tym zajmuje sie teraz klasa Base Widget
    thisWidget.dom.input = /*thisWidget.element*/thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = /*thisWidget.element*/thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = /*thisWidget.element*/thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  
  isValid(value){  // zwraca prawde lub fałsz
    return !isNaN(value)  // spr czy value nie jest nieliczbą  NaN - not a number  ! - zanegowanie  value-> tekst -> isValid -> fałsz

    && value <= settings.amountWidget.defaultMax 
    && value >= settings.amountWidget.defaultMin;
  } 

  renderValue(){  // bierząca wartość widgetu będzie wyświetlona na stronie
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions(){           
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function() { thisWidget.setValue(this.value);});
    thisWidget.dom.linkDecrease.addEventListener('click', function(e) { 
      e.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
      
    thisWidget.dom.linkIncrease.addEventListener('click', function(e) { 
      e.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

  announce(){
    const thisWidget = this;
    // const event = new Event('updated');    zmiana kodu na:
    const event = new CustomEvent('updated', {
      bubbles: true                            // Z bubbles event będzie emitowany na elemencie, ale również na jego rodzicu, oraz dziadku, itd az do <body>, document i window
    });
    /*thisWidget.element*/thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default amountWidget;