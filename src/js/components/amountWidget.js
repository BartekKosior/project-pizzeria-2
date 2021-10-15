import {settings, select} from './settings.js';


class amountWidget{
  constructor(element){
    const thisWidget = this;
    console.log('AmountWidget:', thisWidget);
    console.log('constructor arguments:', element);
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value || settings.amountWidget.defaultValue); // wartość startowa ..... albo ......
    thisWidget.initActions();
  }

  getElements(element){
    const thisWidget = this;
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value){
    const thisWidget = this;
    const newValue = parseInt(value);    //konwertowanie tekstu do liczby. Każdy input daje tekst
    /* TODO: Add validation */
    if(thisWidget.value !== newValue && !isNaN(newValue) && newValue <= settings.amountWidget.defaultMax && newValue >= settings.amountWidget.defaultMin) { // czemu wykrzyknik????????  (!isNaN) // !== różne wartości i typy danych ; czy wartość, która przychodzi do funkcji, jest inna niż ta, która jest już aktualnie w thisWidget.value i czy nie jest nullem - tekstem
      thisWidget.value = newValue;                 // thisWidget.value zmieni się tylko wtedy, jeśli nowa wpisana w input wartość będzie inna niż obecna.
    }
    thisWidget.input.value = thisWidget.value;
    thisWidget.announce();
  }

  initActions(){           
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function() { thisWidget.setValue(this.value);});
    thisWidget.linkDecrease.addEventListener('click', function(e) { 
      e.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
      
    thisWidget.linkIncrease.addEventListener('click', function(e) { 
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
    thisWidget.element.dispatchEvent(event);
  }
}

export default amountWidget;