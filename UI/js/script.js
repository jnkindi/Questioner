
if (document.getElementById('js-navbar-toggle')) {
    const mainNav = document.getElementById('js-menu');
    const navBarToggle = document.getElementById('js-navbar-toggle');
    navBarToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    });
}
let clicknbr = 0;
function nextimage() {
    clicknbr += 1;
    let image = '';
    if (clicknbr % 3 === 0) {
        image = 'slider-1.png';
    }
    if (clicknbr % 3 === 1) {
        image = 'slider-2.png';
    }
    if (clicknbr % 3 === 2) {
        image = 'slider-3.png';
    }
    const section = document.getElementsByClassName('header-home-transparent');
    section[0].removeAttribute('href');
    section[0].setAttribute('style', `background-image: url('../images/${image}')`);
}

function previousimage() {
    clicknbr += 1;
    nextimage();
}

let slideIndex = 1;
if (document.getElementsByClassName('slide').length !== 0) {
    slideIndex = 1;
    showSlides(slideIndex);

    setInterval(
        () => {
            plusSlides(1);
    }, 5000,
    );
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let i;
    const x = document.getElementsByClassName('slide');
    if (n > x.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = x.length;
    }
    for (i = 0; i < x.length; i += 1) {
        x[i].style.display = 'none';
    }
    x[slideIndex - 1].style.display = 'block';
}
