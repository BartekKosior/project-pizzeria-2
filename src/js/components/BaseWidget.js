// import  from './amountWidget.js';

class BaseWidget{
  constructor(wrapperElememt, initialValue){
    const thisWidget = this;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElememt;
    thisWidget.correctValue = initialValue;  // przypisanie wartości do właściwości Value
  }

  get value(){       // geter
    const thisWidget = this;
    return thisWidget.correctValue;
  }

  set value(value){  //seter
    const thisWidget = this;
    const newValue = thisWidget.parseValue(value); // parseInt(value);    //konwertowanie tekstu do liczby. Każdy input daje tekst
    /* TODO: Add validation */
    if(thisWidget.correctValue !== newValue && !isNaN(newValue) && thisWidget.isValid(newValue)){ /*newValue <= settings.amountWidget.defaultMax && newValue >= settings.amountWidget.defaultMin*/ // czemu wykrzyknik????????  (!isNaN) // !== różne wartości i typy danych ; czy wartość, która przychodzi do funkcji, jest inna niż ta, która jest już aktualnie w thisWidget.correctValue i czy nie jest nullem - tekstem
      thisWidget.correctValue = newValue;                 // thisWidget.correctValue zmieni się tylko wtedy, jeśli nowa wpisana w input wartość będzie inna niż obecna.
    }
    // thisWidget.dom.input.value = thisWidget.correctValue; zamiat tego, ta metoda:
    thisWidget.renderValue();
    thisWidget.announce();
  }

  setValue(value){
    const thisWidget = this;
    thisWidget.value = value;
  }

  parseValue(value){  // przeksztalcenie wartości na odpowiedni typ lub format
    return parseInt(value); //zwraca wynik funkcji parseInt
  }

  isValid(value){  // zwraca prawde lub fałsz
    return !isNaN(value);  // spr czy value nie jest nieliczbą  NaN - not a number  ! - zanegowanie  value-> tekst -> isValid -> fałsz
  }
    
  renderValue(){  // bierząca wartość widgetu będzie wyświetlona na stronie
    const thisWidget = this;
    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
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

export default BaseWidget;
