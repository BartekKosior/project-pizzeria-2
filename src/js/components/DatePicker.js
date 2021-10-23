import BaseWidget from '../components/BaseWidget.js';
import utils from '../utils.js';
import {select, settings} from '../settings.js';

class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(); 
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,  // domyslna data - aktualna data
      minDate: thisWidget.minDate,      // min data - aktualna data - nie można wybrac daty przeszłej 
      maxDate: thisWidget.maxDate,    
      locale: {
        firstDayOfWeek: 1
      },
      disable: [                        // blokowanie poniedziałku  ?????/ Jak ta funkcja to robi??
        function(date) {
          return (date.getDay() === 1);
        }
      ],
      onChange: function(selectedDates, dateStr) {  
        thisWidget.value = dateStr;
      },
    });
  }
  parseValue(value){
    return value;
  }

  isValid(){
    return true;
  }

  renderValue(){

  }
}

export default DatePicker;
