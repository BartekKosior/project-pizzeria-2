import {templates, select} from '../settings.js';
import amountWidget from './amountWidget.js';

class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();



  }
  
  render(container){        // w argumencie metody referencja do kontenera
    const thisBooking = this;
    /* generated HTML code with 'templates.bookingWidget' template */
    const generatedHTML = templates.bookingWidget();
    /* create object thisBooking.dom */
    thisBooking.dom = {
      wrapper: container,
    };
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    /* dostęp do inputów */
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount =  document.querySelector(select.booking.hoursAmount);
    
  }   

  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('click', function(){

    });
    thisBooking.hoursAmount = new amountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('click', function(){

    });

  }





}

export default Booking;