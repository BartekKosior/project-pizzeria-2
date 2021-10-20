import {select} from '../settings.js';
import amountWidget from './amountWidget.js';

// Pojedyńczy produkt w koszyku:
class CartProduct{
  constructor(menuProduct, element){
    const thisCartProduct = this;
    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.getElements(element);
    thisCartProduct.amountWidget();
    thisCartProduct.initActions();
    console.log(thisCartProduct);
  }

  getElements(element){
    const thisCartProduct = this;
    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
  }

  amountWidget(){
    const thisCartProduct = this;
    thisCartProduct.amountWidget = new amountWidget(thisCartProduct.dom.amountWidget);
    thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      thisCartProduct.price = thisCartProduct.priceSingle*thisCartProduct.amount;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }

  remove(){
    const thisCartProduct = this;
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {                               // wskazanie co ma być usunięte
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  initActions(){
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click', function(event){
      event.preventDefault();
      thisCartProduct.remove();   //wywołanie metody
    });
    thisCartProduct.dom.remove.addEventListener('click', function(event){
      event.preventDefault();
      thisCartProduct.remove();   //wywołanie metody
    });
  }
    
  //metoda zwraca obiekt, który posiada właściwości z instancji thisCartProduct, które będą potrzebne w momencie zapisywania zamówienia: id, amount, price, priceSingle, name i params.
  getData(){                              
    const thisCartProduct = this;
    thisCartProduct.data = {
      id: thisCartProduct.id,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      name: thisCartProduct.name,
      params: thisCartProduct.params,
    };
  }

}

export default CartProduct;