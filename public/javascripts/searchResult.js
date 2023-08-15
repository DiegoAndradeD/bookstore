//This script is responsible for the search result page functionality
//The comments in this section shall be plentier to facilitate the understand of its functionality


// Selects all images inside elements with the 'imageContainer' class
const images = document.querySelectorAll('.imageContainer img');

// For each image, add a click event listener
images.forEach(image => {
    // Get the image ID and remove the 'bookImage' part to get the book ID
    const bookId = image.id.replace('bookImage', '');
    // When the image is clicked, it redirects to the book page with the ID as a parameter
    image.addEventListener('click', () => {
        window.location.href = '/bookPageRedirect?id=' + bookId;
    });
});

// Select filter elements
const firstFilter = document.getElementById('firstFilter');
const secondFilter = document.getElementById('secondFilter');
const mainContainers = document.querySelectorAll('.mainContainer');

// Add an event listener for the first filter
firstFilter.addEventListener('change', () => {
    // Gets the value selected in the first filter
    const selectedFirstFilter = firstFilter.value;
    // Update second filter options based on selected value
    updateSecondFilterOptions(selectedFirstFilter);
});

// Function to update the second filter options
function updateSecondFilterOptions(selectedFirstFilter) {
    const secondFilterOptions = document.getElementById('secondFilter');
    // Reinitialize the second filter options with a default option
    secondFilterOptions.innerHTML = '<option value="all">All</option>';


    /*
        Update the options based on the value selected in the first filter
        Get all containers from the selectedFirstFilter value
        Populate second filter options with unique option of the selectedFirstFilter value
        (This proceding repeats itself for the whole if-else structure, onyl changing the first filter value: category, author, etc...)
    */
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

// Function to fill in the second filter options
function fillSecondFilterOptions(options, filterElement) {
    options.forEach(optionValue => {
        // Create an option element
        const option = document.createElement('option');
        // Set the option values
        option.value = optionValue;
        option.textContent = optionValue;
        // Add the option to the filter element
        filterElement.appendChild(option);
    });
}

// Functions to get unique options for categories, authors, languages, etc.
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

// Function to check if a value meets a certain filter
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

// Add an event listener for the second filter
secondFilter.addEventListener('change', () => {
    // Gets the values selected in the filters
    const selectedFirstFilter = firstFilter.value;
    const selectedSecondFilter = secondFilter.value;
    // Filter books based on filter values
    filterBooks(selectedFirstFilter, selectedSecondFilter);
});


// Function to filter books based on filter values
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