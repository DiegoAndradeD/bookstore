const images = document.querySelectorAll('.imageContainer img');
        
images.forEach(image => {
    const bookId = image.id.replace('bookImage', '');
    image.addEventListener('click', () => {
        window.location.href = '/bookPageRedirect?id=' + bookId;
    });
});

const firstFilter = document.getElementById('firstFilter');
const secondFilter = document.getElementById('secondFilter');
const mainContainers = document.querySelectorAll('.mainContainer');

firstFilter.addEventListener('change', () => {
    const selectedFirstFilter = firstFilter.value;
    updateSecondFilterOptions(selectedFirstFilter);
});

function updateSecondFilterOptions(selectedFirstFilter) {
    const secondFilterOptions = document.getElementById('secondFilter');
    secondFilterOptions.innerHTML = '<option value="all">All</option>';

    if (selectedFirstFilter === 'category') {
        const categoryContainers = document.querySelectorAll('.categoryContainer');
        fillSecondFilterOptions(getUniqueCategories(categoryContainers), secondFilterOptions);
    } else if (selectedFirstFilter === 'author') {
        const authorContainers = document.querySelectorAll('.authorContainer');
        fillSecondFilterOptions(getUniqueAuthors(authorContainers), secondFilterOptions);
    } else if (selectedFirstFilter === 'idiom') {
        const idiomContainers = document.querySelectorAll('.idiomContainer');
        fillSecondFilterOptions(getUniqueIdioms(idiomContainers), secondFilterOptions);
    } else if (selectedFirstFilter === 'length') {
        const pagesContainer = document.querySelectorAll('.pagesContainer');
        fillSecondFilterOptions(getUniquePageLength(pagesContainer), secondFilterOptions);
    } else if (selectedFirstFilter === 'price') {
        const priceContainer = document.querySelectorAll('.priceContainer');
        fillSecondFilterOptions(getUniquePrices(priceContainer), secondFilterOptions);
    } 
}


function fillSecondFilterOptions(options, filterElement) {
    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        filterElement.appendChild(option);
    });
}

function getUniqueCategories() {
    const categories = [];
    mainContainers.forEach(container => {
        const categoryContainer = container.querySelector('#categoryContainer');
        if (!categories.includes(categoryContainer.textContent)) {
            categories.push(categoryContainer.textContent);
        }
    });
    return categories;
}

function getUniqueAuthors() {
    const authors = [];
    mainContainers.forEach(container => {
        const authorContainer = container.querySelector('#authorContainer');
        if (!authors.includes(authorContainer.textContent)) {
            authors.push(authorContainer.textContent);
        }
    });
    return authors;
}

function getUniqueIdioms() {
    const idioms = [];
    mainContainers.forEach(container => {
        const idiomContainer = container.querySelector('#idiomContainer');
        if (!idioms.includes(idiomContainer.textContent)) {
            idioms.push(idiomContainer.textContent);
        }
    });
    return idioms;
}

function getUniquePageLength() {
    return ['< 100', '100', '100 - 300', '300 - 600', '600 - 900', '> 1000'];
}

function getUniquePrices() {
    return ['< 10', '10 - 30', '30 - 60', '60 - 90', '> 100'];
}

function checkValueFilter(value, selectedSecondFilter) {
    switch (selectedSecondFilter) {
        case '< 100':
            return value < 100;
        case '100':
            return value === 100;
        case '100 - 300':
            return value >= 100 && value < 300;
        case '300 - 600':
            return value >= 300 && value < 600;
        case '600 - 900':
            return value >= 600 && value < 900;
        case '> 1000':
            return value > 1000;

        case '< 10':
            return value < 10;
        case '10 - 30':
            return value >= 10 && value < 30;
        case '30 - 60':
            return value >= 30 && value < 60;
        case '60 - 90':
            return value >= 60 && value < 90;
        case '> 100':
            return value > 100;
        default:
            return true; 
    }
}

secondFilter.addEventListener('change', () => {
    const selectedFirstFilter = firstFilter.value;
    const selectedSecondFilter = secondFilter.value;
    filterBooks(selectedFirstFilter, selectedSecondFilter);
});

function filterBooks(selectedFirstFilter, selectedSecondFilter) {
    mainContainers.forEach(container => {
        let showBook = true;

        if (selectedFirstFilter === 'category') {
            const categoryContainer = container.querySelector('#categoryContainer');
            showBook = selectedSecondFilter === 'all' || categoryContainer.textContent.includes(selectedSecondFilter);
        } else if (selectedFirstFilter === 'author') {
            const authorContainer = container.querySelector('#authorContainer');
            showBook = selectedSecondFilter === 'all' || authorContainer.textContent.includes(selectedSecondFilter);
        } else if (selectedFirstFilter === 'idiom') {
            const idiomContainer = container.querySelector('#idiomContainer');
            showBook = selectedSecondFilter === 'all' || idiomContainer.textContent.includes(selectedSecondFilter);
        } else if (selectedFirstFilter === 'length') {
            const pagesContainer = container.querySelector('#pagesContainer p');
            const pageLength = parseInt(pagesContainer.textContent.split(' ')[1]);
            showBook = checkValueFilter(pageLength, selectedSecondFilter);
        } else if (selectedFirstFilter === 'price') {
            const priceContainer = container.querySelector('#priceContainer p');
            const prices = priceContainer.textContent.split(' ')[1];
            const numericPrices = parseFloat(prices.replace('R$', ''));
            showBook = checkValueFilter(numericPrices, selectedSecondFilter);
        }
        container.style.display = showBook ? 'flex' : 'none';
    });
}