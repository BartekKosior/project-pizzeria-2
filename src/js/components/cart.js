// Cały koszyk:
import {settings, select, classNames, templates} from './settings.js';
import utils from './components/utils.js';
import CartProduct from './cartProduct.js';


class Cart{
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    console.log('new cart', thisCart);
  }

  getElements(element){
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
  }

  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function() {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);      // zwijanie i rozwijanie koszyka
    });
    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;
    console.log('menuProduct', menuProduct);
    /* generate HTML based on template */   /* wygenerować kod HTML pojedynczego produktu */
    const generatedHTML = templates.cartProduct(menuProduct);  /* wywołanie metody templates.menuProduct i przekazanie jej danych produktu */
    /* create element using utils.createElementFromHTML */    /* stworzyć element DOM na podstawie tego kodu produktu */
    thisCart.element = utils.createDOMFromHTML(generatedHTML);
    const generatedDOM = thisCart.element;
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }

  //Sumowanie koszyka
  update(){
    const thisCart = this;
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;            // cena dostawy
    thisCart.totalNumber = 0;                                           // całościowa liczba sztuk
    thisCart.subTotalPrice = 0;                                         // zsumowana cena za wszystko - bez kosztu dostawy
    for(let thisCartProduct of thisCart.products){                    
      thisCart.totalNumber = thisCart.totalNumber + thisCartProduct.amount;            // zwiększenie totalNumber o liczbę sztuk danego produktu
      thisCart.subTotalPrice = thisCart.subTotalPrice + thisCartProduct.price;                  
    }
    if (thisCart.subTotalPrice == 0){
      thisCart.deliveryFee = 0;
    }
    thisCart.totalPrice = thisCart.subTotalPrice + thisCart.deliveryFee;    // własciwosć thisCart.totalPrice - jej wartoscią jest cena całkowita i koszt dostawy. Własciwosc jest dostepna w całej instancji - stała nie.
              
    console.log('thisCart.totalNumber', thisCart.totalNumber);
    console.log('thisCart.subTotalPrice',thisCart.subTotalPrice);
    console.log('thisCart.totalPrice', thisCart.totalPrice);
    console.log('thisCart.deliveryFee', thisCart.deliveryFee);
      
    thisCart.dom.subTotalPrice.innerHTML = thisCart.subTotalPrice;
    for(const LM of thisCart.dom.totalPrice){
      LM.innerHTML = thisCart.totalPrice;
    }
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
  }

  remove(thisCartProduct){   const thisCart = this;
    // Usunięcie reprezentacji produktu z HTML-a,
    thisCartProduct.dom.wrapper.remove();
    // console.log('thisCartProduct', thisCartProduct);
    // Usunięcie informacji o danym produkcie z tablicy thisCart.products.
    const thisCartproductsLenght = thisCart.products.lenght;       // odczytanie ilosci elementów
    console.log('thisCartproductsLenght', thisCartproductsLenght);
    const index = thisCart.products.indexOf(thisCartProduct);
    thisCart.products.splice(index, 1);

    // Wywołać metodę update w celu przeliczenia sum po usunięciu produktu.
    thisCart.update();

  }

  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;
    thisCart.payload = {       address: thisCart.address,   // .value
      phone: thisCart.phone,       // .value
      totalPrice: thisCart.totalPrice,
      subTotalPrice: thisCart.subTotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: thisCart.products,
    }; 
    const payload = {
      products: []
    };
    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),   //przekonwertowanie obiektu payload na ciąg znaków w formacie JSON
    };
    fetch(url, options);
  }

}

export default Cart;