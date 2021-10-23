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
    amountWidget.thisWidget.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);  // czy dobrze ? referencja do inputu w obiekcie thisWidget.dom (jest w pliku amountwidget) w metodzie render
    amountWidget.thisWidget.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);  // czy dobrze ? referencja do inputu w obiekcie thisWidget.dom w metodzie render
    
  }   

  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('click', function(){
    });

    thisBooking.hoursAmount = new amountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('click', function(){
    });

    thisBooking.datePicker = new amountWidget(amountWidget.thisWidget.dom.datePicker);
    amountWidget.thisWidget.dom.addEventListener('click', function(){
    });

    thisBooking.hourPicker = new amountWidget(amountWidget.thisWidget.dom.hourPicker);
    amountWidget.thisWidget.dom.addEventListener('click', function(){
    });

  }



}

export default Booking;