/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input:'input.amount', // CODE CHANGED   /* input: 'input[name="amount"]', */
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: '.cart__total-number',
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',   
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong', 
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    }
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart:{
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
    db: {
      url: '//localhost:3131',
      products: 'products',
      orders: 'orders',
    },

  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;    /* data zawiera wszystkie właściwości produktu (name, price, desctription) */
      thisProduct.amount = 1;
      thisProduct.renderInMenu();  /* uruchomienie metody */
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget(); // czemu przed processOrder ?????????
      thisProduct.processOrder();

      console.log('new Product:', thisProduct);
    }
    renderInMenu(){
      const thisProduct = this;
      /* generate HTML based on template */   /* wygenerować kod HTML pojedynczego produktu */
      const generatedHTML = templates.menuProduct(thisProduct.data);  /* wywołanie metody templates.menuProduct i przekazanie jej danych produktu */
      /* create element using utils.createElementFromHTML */    /* stworzyć element DOM na podstawie tego kodu produktu */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /* find menu container */   /* znaleźć na stronie kontener menu */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* add element to menu */   /* wstawić stworzony element DOM do znalezionego kontenera menu */
      menuContainer.appendChild(thisProduct.element);
    }
    
    getElements(){    /* metoda do znalezienia elementów w kontenerze produktu ; swego rodzaju spis treści */
      const thisProduct = this;
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);                                 
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion(){
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      /* const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);    /* zbędna linijka */
      /* START: add event listener to clickable trigger on event click */
      /* clickableTrigger.addEventListener('click', function(event) {     clickableTrigger mozna zastapic 'thisProduct.accordionTrigger */     
      thisProduct.accordionTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */
        event.preventDefault();
        /* find active product (product that has active class) */
        const activeProduct = document.querySelector('.active.product');   /* musi miec obie klasy */
        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if(activeProduct != thisProduct.element && activeProduct){  /* jezeli aktywny elem jest inny niz klikniety elem i w ogole istnieje to schowaj go */
          activeProduct.classList.remove('active');
        }
        /* toggle active class on thisProduct.element */ /* przełączenie klasy active */
        thisProduct.element.classList.toggle('active');
      });
    }
    
    initOrderForm(){
      const thisProduct = this;
      console.log('initOrderForm:');

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();  /* blokowanie wysłanie formularza z przeładowaniem strony */
        thisProduct.processOrder(); /* obliczenie ceny produktu */
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();  /* obliczenie ceny produktu */
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault(); /* blokowanie zmiany adresu strony po kliknięciu w link */
        thisProduct.processOrder();  /* obliczenie ceny produktu */
        thisProduct.addToCart();
      });
    }
        
    processOrder(){
      const thisProduct = this;
      console.log('processOrder:');
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}  Dostęp do formularza
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      // set price to default price      zapisanie startowej ceny produktu do zmiennej 
      let price = thisProduct.data.price;

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId]; // pętla for..in zwraca tylko nazwę właśc. Ta linijka dba o to, aby dostać się do całego obiektu dost. pod tą właśc.
        console.log(paramId, param);
        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];    // dostanie się do całego obiektu dost. pod tą właśc.
          console.log(optionId, option);

          // check if there is param with a name of paramId in formData and if it includes optionId
          
          if(formData[paramId] && formData[paramId].includes(optionId)) {          
            // check if the option is not default - sprawdz czy opcja nie jest domyslna
            if(!option.default) {     //sprawdzić czy opcja jest domyślna - default: true   ! - spr czy option default jest czyms pustym
              // add option price to price variable
              price = price + option.price;
            }
          } else {
            // check if the option is default - sprawdz czy opcja jest domyslna
            if(option.default) {     // czy option default istnieje i ma jakas wartosc
              // reduce price variable
              price = price - option.price;
            }     
          }

          // Add component picture
          const optionImage = thisProduct.imageWrapper.querySelector('.'+paramId+'-'+optionId);  // selektor  .paramId-optionId
          if(optionImage){                                                         /* czemu tylko optionImage w if'ie - spr czy istnieje */
            if(formData[paramId] && formData[paramId].includes(optionId)){
              optionImage.classList.add(classNames.menuProduct.imageVisible);        /* stała przechowująca klasę active */
            } else {
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }
      // update calculated price in the HTML
      thisProduct.price = price * thisProduct.amount;
      thisProduct.priceSingle = price;
      thisProduct.priceElem.innerHTML = price * thisProduct.amount;  // wpisanie przeliczonej ceny do elementu w HTML-u:   //pomnozenie ceny przez ilosc szt wybraną w widgecie
    } 

    initAmountWidget(){
      const thisProduct = this;
      thisProduct.amountWidget = new amountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.amount = thisProduct.amountWidget.value;
        thisProduct.processOrder();
      });
    }

    addToCart(){
      const thisProduct = this;
      app.cart.add(thisProduct.prepareCartProduct());
    }

    prepareCartProduct(){
      const thisProduct = this;
      const productSummary = {};
      productSummary.id = thisProduct.id;                   
      productSummary.name = thisProduct.data.name;          
      productSummary.amount = thisProduct.amount;           
      productSummary.priceSingle = thisProduct.priceSingle; 
      productSummary.price = thisProduct.price * thisProduct.amount;    //cena całkowita, czyli c.j. pomnożona przez ilość sztuk 
      productSummary.params = thisProduct.prepareCartProductParams();   // () w\laczaja funkcje  // jako wartość params prepareCartProduct ustawia to, co zwraca metoda prepareCartProductParams
      return productSummary;                                            //zwrócenie całego obiektu
    }

    prepareCartProductParams(){    //przejście po wszystkich kategoriach produktu, następnie po ich opcjach,sprawdzenie czy są one wybrane i wygenerowania podsumowania w formie małego obiektu
      const thisProduct = this;
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}  Dostęp do formularza
      const formData = utils.serializeFormToObject(thisProduct.form);
      const params = {};
      
      
      // for every category (param)
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId]; // pętla for..in zwraca tylko nazwę właśc. Ta linijka dba o to, aby dostać się do całego obiektu dost. pod tą właśc.
        // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
        params[paramId] = {
          label:param.label,
          options:{}
        };
        // for every option in this category
        for(let optionId in param.options) {
          const option = param.options[optionId];    // dostanie się do całego obiektu dost. pod tą właśc.
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          if(optionSelected){
            // Option is selected
            params[paramId].options[optionId] = option.label;
          }
        }
      }
      return params;
    }
  }

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

  // Cały koszyk:
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

    remove(thisCartProduct){
      const thisCart = this;
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
      thisCart.payload = {
        address: thisCart.address,   // .value
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

  const app = {
    initMenu: function(){                                                 /* metoda app.initMenu */
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);
      /* const testProduct = new Product();
      console.log('testProduct:', testProduct); */
      for(let productData in thisApp.data.products){                    /* Tworzenie w pętli nowej instancji dla każdego produktu */ /* pobranie cake, breakfast, pizza, salad - jak pobiera z data.js */
        // new Product(productData, thisApp.data.products[productData]);
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    initData: function(){                                                /* dostęp do danych z obiektu dataSource z pliku data.js */
      const thisApp = this;
      // thisApp.data = dataSource;  - zmiana w związku z API
      // ADDED NEW CODE:
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);

          /* save parsedResponse as thisApp.data.products */
          thisApp.data.products = parsedResponse;
          /* execute initMenu method */
          thisApp.initMenu();

        });
      console.log('thisApp.data', JSON.stringify(thisApp.data));
    },

    initCart: function(){
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },
    
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      // thisApp.initMenu();    API
      thisApp.initCart();

    },
  };

  app.init();    
}
