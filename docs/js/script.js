let products = [];
let searchForm = document.getElementById("search-form");
let filterForm = document.getElementById("type-form");
let searchInputElement = document.getElementById("search-input")
let filterInputElement = document.getElementById("type-input")


// Loads all products data
window.onload = () => {
    updateContent(productDataWomens)
}

// Handle Search By Title
const search = e => {
    e.preventDefault();
    const searchInputValue = e.target[0].value
    products = productDataWomens.filter(x => x.productTitle === searchInputValue);
    reset()
    updateContent(products)

    // clean input
    searchInputElement.value = "";
}
searchForm.addEventListener('submit', search);

// Handle Filter by Type
const filter = e => {
    e.preventDefault();
    const filterInputValue = e.target[0].value
    products = productDataWomens.filter(x => x.productUrl.includes(filterInputValue));
    reset()
    updateContent(products)

    // clean input
    filterInputElement.value = "";
}
filterForm.addEventListener('submit', filter);

// Handle Filter by price
const priceRange = value => {

    let range = '';

    switch (value) {
        case '0-10-range':
            range = x => x.price > 0 && x.price < 10;
            break;
        case '10-20-range':
            range = x => x.price > 10 && x.price < 20;
            break;
        case '20-40-range':
            range = x => x.price > 20 && x.price < 40;
            break;
        case '40-100-range':
            range = x => x.price > 40 && x.price < 100;
            break;
    }
    products = productDataWomens.filter(range);
    reset()
    updateContent(products)
}

// Reset existing carousel content
const reset = () => {
    const nodeParent = document.getElementById('carousel-wrapper');
    const node = document.getElementById('results');
    node.remove();
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "carousel");
    newDiv.setAttribute("id", "results");
    nodeParent.append(newDiv)
}

// ====  UPDATE CAROUSEL CONTENT  ==== \\

const updateContent = (content) => {

    // Mustache - Carousel Generator \\

    const templateList = document.getElementById('template-cell-list').innerHTML;

    Mustache.parse(templateList);

    let listItems = '';

    for (let item in content) {
        listItems = Mustache.render(templateList, content[item]);
        let carouselResults = document.getElementById('results');
        carouselResults.insertAdjacentHTML('beforeend', listItems);
    }

    const elem = document.querySelector('.carousel');
    const flkty = new Flickity(elem, {
        cellAlign: 'center',
        pageDots: true,
    });

    // ==== POPUP HANDLE ==== \\

    //Product Popup Open on Carousel Item Click
    document.querySelectorAll('.cell-image').forEach(btn => {
        btn.addEventListener('click', e => {

            // Selected item to dispaly in popup
            const clickedArrayElement = productDataWomens.find(x => x.imageSrc === e.target.id)
            let indexOfclickedArrayElement = productDataWomens.indexOf(clickedArrayElement)
            console.log('indexOfclickedArrayElement:', indexOfclickedArrayElement)

            // ==== Mustache - Popup Generator ==== \\

            const templatePopup = document.getElementById('template-popup').innerHTML;

            Mustache.parse(templatePopup);

            let popup = '';

            popup = Mustache.render(templatePopup, productDataWomens[indexOfclickedArrayElement]);
            const popupResults = document.getElementById('popup-results');
            popupResults.insertAdjacentHTML('beforeend', popup);

            // POPUP HANDLE METHODS

            const closePopup = () => {
                document.getElementById('overlay').classList.remove('show');
                popupResults.innerHTML = '';
            };

            const openPopup = pop => {
                document.querySelectorAll('#overlay > *').forEach(pop => {
                    pop.classList.remove('show');
                });
                document.querySelector('#overlay').classList.add('show');
                document.querySelector(pop).classList.add('show');
            };

            // Close popup with overlay click
            document.querySelector('#overlay').addEventListener('click', e => {
                if (e.target.id === 'overlay') {
                    closePopup();
                };
            });

            //Close popup with top-corner button click
            document.querySelectorAll('#button-close').forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    closePopup();
                });
            });

            e.preventDefault();
            openPopup('#description');
        });

    });
}
