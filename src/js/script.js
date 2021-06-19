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
      thisProduct.renderInMenu();
      thisProduct.initAccordion();
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

    initAccordion(){
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = document.querySelectorAll(select.menuProduct.clickable);

      /* START: add event listener to clickable trigger on event click */
      clickableTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */
        event.preventDefault();
        /* find active product (product that has active class) */
        
        /* if there is active product and it's not thisProduct.element, remove class active from it */

        /* toggle active class on thisProduct.element */
      });

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

  app.init();     /* czemu wywołanie app.init poza app ? */
}
