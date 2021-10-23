import {settings, select, classNames} from './settings.js';     //  ./ - musi być
import Product from './components/product.js';   // importowanie domyslne
import Cart from './components/cart.js';
import Booking from './components/booking.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;   // kontener z podstronami. Właciwosc pages. Children - podstrony we właściwości pages są dzieci kontenera stron czyli sekcje order i booking
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    
    const idFromHash = window.location.hash.replace('#/', '');
    // console.log('idFromHash', idFromHash);
    let pageMatchingHash = thisApp.pages[0].id;
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;                         // przerwanie kolejnych iteracji pętli
      }
    }
        
    // po otwarciu strony aktywuje się pierwsza z podstron:
    thisApp.activatePage(pageMatchingHash);  // thisApp.pages[0].id      0 - pierwsza ze znalezionych stron (order lub booking) 
        
    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#','');  // usięcie # - zamiana na pusty ciag znakow
        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);
        /* change URL hash */
        window.location.hash = '#/' + id; 
      });
    } 
  },

  activatePage: function(pageId){     // aktywowanie podstrony
    const thisApp = this;
    /* add class "active" to matching pages, remove from non-matching */
    for (let page of thisApp.pages){
      //if(page.id == pageId){
      //  p/age.classList.add(classNames.pages.active);
      //} else {
      //  page.classList.remove(classNames.pages.active);
      //}
      page.classList.toggle(classNames.pages.active, page.id == pageId);   // toggle nadaje klase jeśli jej nie ma. Odbiera jeśli jest. To jest to samo to 5 linijek wyżej, drugi argument (page.id ==pageId) dec czy klasa jest nadaana czy nie
    }

    /* add class "active" to matching links, remove from non-matching */
    for (let link of thisApp.navLinks){ //dla każdego z linków zapisanych w t..ks chcemy dodac lub usunac klase zdef. w cl...ve, w zaleznosci od tego czy atrybut href linka rowny jest # i id podstrony podany jako argument w metodzie activatePage
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId   // w HTML - <a href="#order">Order</a>
      );
    }
  },

  initMenu: function(){                                                 /* metoda app.initMenu */
    const thisApp = this;
    // console.log('thisApp.data:', thisApp.data);
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
        //console.log('parsedResponse', parsedResponse);
        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();

      });
    //console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initCart: function(){
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
  
  initBooking: function(){
    const thisApp = this;
    const booking = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(booking);



  },


  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
  },

};
app.init();