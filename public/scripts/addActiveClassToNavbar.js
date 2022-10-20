const navbarLinks = Array.from(
  document.querySelectorAll(".navbar-div-holding-links a")
);

const urlString = window.location.href;
const urlPath = urlString.split("http://localhost:3000").join("");

function removeActiveClassFromNavLinks() {
  navbarLinks.forEach((navbarLink) => {
    navbarLink.classList.remove("active");
  });
}

function findAnchorElement(pathOfUrl) {
  return navbarLinks.find(
    (navbarLink) => navbarLink.dataset.path === pathOfUrl
  );
}

function triggerUrlPath() {
  removeActiveClassFromNavLinks();
  const navbarLinkToActive = findAnchorElement(urlPath);
  // if the navbar link exists (that means that it may not exist because
  //  the user might be in a show campground page, and that page is not in the navbar links)
  if (navbarLinkToActive) {
    navbarLinkToActive.classList.add("active");
  }
}

triggerUrlPath();
