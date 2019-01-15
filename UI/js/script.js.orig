if(document.getElementById("js-navbar-toggle")) {
	let mainNav = document.getElementById("js-menu");
	let navBarToggle = document.getElementById("js-navbar-toggle");
	navBarToggle.addEventListener("click", function() {
	mainNav.classList.toggle("active");
	});
}
let clicknbr = 0;
function nextimage(){
	clicknbr++;
	let image = "";
	if (clicknbr % 3 == 0) {
		image = "slider-1.png";
	}
	if (clicknbr % 3 == 1) {
		image = "slider-2.png";
	}
	if (clicknbr % 3 == 2) {
		image = "slider-3.png";
	}
	let section = document.getElementsByClassName('header-home-transparent');
	section[0].removeAttribute("href");
	section[0].setAttribute("style", "background-image: url('../images/"+image+"')");
}

function previousimage(){
	clicknbr++;
	nextimage();
}



if(document.getElementsByClassName("slide").length != 0){
	var slideIndex = 1;
	showSlides(slideIndex);

	setInterval(
		function(){
			plusSlides(1);
		},
	5000);
}

function plusSlides(n) {
	showSlides(slideIndex += n);
}

function showSlides(n) {
	var i;
	var x = document.getElementsByClassName("slide");
	if (n > x.length) {
		slideIndex = 1;
	}    
	if (n < 1) {
		slideIndex = x.length;
	}
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";  
	}
	x[slideIndex-1].style.display = "block";
}