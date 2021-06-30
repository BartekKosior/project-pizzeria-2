/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;    /* data zawiera wszystkie właściwości produktu (name, price, desctription) */
      thisProduct.renderInMenu();  /* uruchomienie metody */
      thisProduct.getElements();
      thisProduct.initAccordion();  /* uruchomienie metody */
      thisProduct.initOrderForm();
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
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);                                   /* czy jest ok ?????????? */
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
          const optionImage = thisProduct.imageWrapper.querySelector('.'+paramId+'-'+optionId);
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
      thisProduct.priceElem.innerHTML = price;  // wpisanie przeliczonej ceny do elementu w HTML-u:
    } 
  }


  const app = {
    initMenu: function(){                                                 /* metoda app.initMenu */
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);
      /* const testProduct = new Product();
      console.log('testProduct:', testProduct); */
      for(let productData in thisApp.data.products){                    /* Tworzenie w pętli nowej instancji dla każdego produktu */ /* pobranie cake, breakfast, pizza, salad - jak pobiera z data.js */
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){                                                /* dostęp do danych z obiektu dataSource z pliku data.js */
      const thisApp = this;
      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();    
}
