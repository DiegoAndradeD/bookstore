function getCurrentRoute() {
    return window.location.pathname;
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', function() {
        event.preventDefault();

    var formData = new FormData(this);
    var currentRoute = getCurrentRoute();

    var xhr = new XMLHttpRequest();
    xhr.open('POST', currentRoute, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
        var response = JSON.parse(xhr.responseText);
        if (xhr.status === 500 || xhr.status === 400) {
            document.getElementById('errorMessage').innerHTML = response.errorMessage;
            document.getElementById('successMessage').classList.add('d-none'); 
            document.getElementById('errorMessage').classList.remove('d-none');
            document.getElementById('errorMessage').classList.add('d-block');         
        } else if (xhr.status === 201) {
            document.getElementById('successMessage').innerHTML = response.successMessage;
            document.getElementById('errorMessage').classList.add('d-none');  
            document.getElementById('successMessage').classList.remove('d-none');
            document.getElementById('successMessage').classList.add('d-block');  
            setTimeout(function() {
            location.reload();
        }, 1000); 
        }
        }
    };
    xhr.send(new URLSearchParams(formData).toString());
    });
});