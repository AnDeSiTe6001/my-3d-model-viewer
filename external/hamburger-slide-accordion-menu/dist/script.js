document.addEventListener("DOMContentLoaded", function () {
  function slideMenu() {
    const menuList = document.querySelector("#menu-container .menu-list");
    const activeState = menuList.classList.contains("active");
    menuList.style.transition = "left 0.4s";
    menuList.style.left = activeState ? "0%" : "-100%";
  }

  document
    .querySelector("#menu-wrapper")
    .addEventListener("click", function (event) {
      //event.stopPropagation();
      document.querySelector("#hamburger-menu").classList.toggle("open");
      const menuList = document.querySelector("#menu-container .menu-list");
      menuList.classList.toggle("active");
      slideMenu();

      document.body.classList.toggle("overflow-hidden");
    });

  document
    .querySelectorAll(".menu-list .accordion-toggle")
    .forEach((toggle) => {
      toggle.addEventListener("click", function () {
        const nextElement = this.nextElementSibling;

        nextElement.classList.toggle("open");
        nextElement.style.display = nextElement.classList.contains("open")
          ? "block"
          : "none";
        this.classList.toggle("active-tab");
        this.querySelector(".menu-link").classList.toggle("active");

        document
          .querySelectorAll(".menu-list .accordion-content")
          .forEach((content) => {
            if (content !== nextElement) {
              content.classList.remove("open");
              content.style.display = "none";
            }
          });

        document
          .querySelectorAll(".menu-list .accordion-toggle")
          .forEach((otherToggle) => {
            if (otherToggle !== this) {
              otherToggle.classList.remove("active-tab");
              otherToggle
                .querySelector(".menu-link")
                .classList.remove("active");
            }
          });
      });
    });
});
