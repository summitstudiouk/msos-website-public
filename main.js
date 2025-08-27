"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/main.js
  var scrollPosition = 0;
  function isDesktop() {
    return window.innerWidth >= 992;
  }
  function openOverlay() {
    scrollPosition = $(window).scrollTop();
    $("body").css({
      position: "fixed",
      top: `-${scrollPosition}px`,
      width: "100%",
      overflow: "hidden"
    });
  }
  function closeOverlay() {
    $("body").css({
      position: "",
      top: "",
      width: "",
      overflow: ""
    });
    $(window).scrollTop(scrollPosition);
  }
  var $navBar = $(".nav_component");
  function resetNav() {
    $("html").attr("style", "--_navigation---navigation-background-colour: rgba(255, 255, 255, 0); --_navigation---navigation-text-colour: rgba(255, 255, 255, 1); --_navigation---navigation-logo-colour-red: rgba(255, 255, 255, 1); --_navigation---navigation-logo-colour-blue: rgba(255, 255, 255, 1);");
    $navBar.removeClass("s--open");
    closeOverlay();
  }
  $(".navbar29_dropdown-toggle").on("click", function() {
    if (isDesktop()) {
      const $toggle = $(this);
      if ($toggle.hasClass("w--open")) {
        resetNav();
      } else if (!$navBar.hasClass("s--open")) {
        $navBar.addClass("s--open");
        openOverlay();
      }
    }
  });
  $(document).on("click", function(event) {
    if (!$(event.target).closest(".navbar29_component").length && $navBar.hasClass("s--open")) {
      resetNav();
    }
  });
  $(".grid_item").on("mouseenter", function() {
    const $this = $(this);
    $this.siblings().removeClass("active");
    $this.addClass("active");
  });
  $(".grid_item").on("mouseleave", function() {
    const $this = $(this);
    $this.addClass("leaving");
    setTimeout(() => {
      $this.removeClass("active leaving");
    }, 200);
  });
  var colorMap = {};
  var usedColors = /* @__PURE__ */ new Set();
  var classCounter = 1;
  var styleEl = $("<style></style>").appendTo("head");
  function normalizeColor(rawColor) {
    const $dummy = $("<div></div>").css({
      position: "absolute",
      left: "-9999px",
      top: "-9999px",
      visibility: "hidden"
    }).appendTo("body");
    $dummy.css("color", "");
    $dummy.css("color", rawColor);
    const computed = getComputedStyle($dummy[0]).color;
    $dummy.remove();
    if (!computed || computed === "inherit" || computed === "rgba(0, 0, 0, 0)") {
      return null;
    }
    return computed;
  }
  $("[s-accent-colour]").each(function() {
    const $el = $(this);
    const rawColor = $el.attr("s-accent-colour");
    const targetAttr = $el.attr("s-accent-colour-target") || "";
    const classList = $el.attr("class") ? "." + $el.attr("class").split(/\s+/).join(".") : "";
    const normalizedColor = normalizeColor(rawColor);
    if (!normalizedColor) {
      console.warn(`Skipping invalid color: "${rawColor}"`);
      return;
    }
    const baseSelector = `${classList ? classList + "." : "."}s-accent-colour-${classCounter}`;
    const fullSelector = `${baseSelector}${targetAttr}`;
    if (!colorMap[normalizedColor] || colorMap[normalizedColor] !== fullSelector) {
      const classToApply = `s-accent-colour-${classCounter++}`;
      colorMap[normalizedColor] = fullSelector;
      usedColors.add(normalizedColor);
      styleEl.append(`${baseSelector} { background: ${normalizedColor}; }
`);
      if (targetAttr) {
        styleEl.append(`${fullSelector} { background: ${normalizedColor}; }
`);
      }
      $el.addClass(classToApply);
    } else {
      const assignedClass = colorMap[normalizedColor].split(targetAttr)[0].replace(/^\./, "");
      $el.addClass(assignedClass);
    }
  });
  console.log(colorMap);
  $(".section_services").each(function() {
    const $section = $(this);
    let sectionHeight = 0;
    const $services = $section.find(".services_link");
    const totalServices = $services.length;
    if (totalServices <= 1) return true;
    let tallestService = 0;
    $services.each(function() {
      const $service = $(this);
      const $serviceBlock = $service.find(".services_block");
      const iconHeight = $service.find(".services_icon").outerHeight(true);
      const headingHeight = $service.find(".services_heading").outerHeight(true);
      let serviceHeight = iconHeight > headingHeight ? iconHeight : headingHeight;
      serviceHeight += parseFloat($service.css("padding-bottom")) || 0;
      serviceHeight += parseFloat($serviceBlock.css("padding-top")) || 0;
      serviceHeight += parseFloat($serviceBlock.css("padding-bottom")) || 0;
      serviceHeight += parseFloat($serviceBlock.css("border-bottom-width")) || 0;
      let serviceContentHeight = 0;
      $service.find(".services_description > *").each(function() {
        serviceContentHeight += $(this).outerHeight(true);
      });
      serviceHeight += serviceContentHeight;
      if (serviceHeight > tallestService) {
        tallestService = serviceHeight;
      }
    });
    sectionHeight = tallestService;
    $section.css("min-height", Math.ceil(sectionHeight) + "px");
  });
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push(
    [
      "cmstabs",
      () => {
        Webflow.require("ix2").init();
        Webflow.require("tabs").redraw();
        $('[s-accordion-tabs="source"] .accordion-tabs_tab-link-content').each(function() {
          const $this = $(this);
          const tabIndex = $this.closest(".accordion-tabs_tab-link").index();
          const $destinationTab = $this.closest(".accordion-tabs_tabs").siblings('[s-accordion-tabs="destination"]').find(".accordion-tabs_tab-link").eq(tabIndex);
          $this.appendTo($destinationTab);
        });
        document.querySelectorAll('[s-accordion-tabs-content="map"]').forEach(function(tabsSection) {
          const tabPanes = tabsSection.querySelectorAll(".accordion-tabs_tab-pane");
          const tabLinks = tabsSection.querySelectorAll(".accordion-tabs_tab-link");
          tabPanes.forEach(function(tabPane, index) {
            const desktopImageWrapper = tabPane.querySelector(".accordion-tabs_desktop-image .accordion-tabs_image-wrapper");
            const tabLink = tabLinks[index];
            if (desktopImageWrapper && tabLink) {
              const mobileImageContainer = tabLink.querySelector(".accordion-tabs_mobile-image");
              if (mobileImageContainer) {
                mobileImageContainer.appendChild(desktopImageWrapper.cloneNode(true));
              }
            }
          });
        });
        $('[s-accordion-tabs="source"]').each(function(index) {
          $(this).remove();
        });
        function setActiveAccordionTabs() {
          $("[s-active-tab]").each(function() {
            const $this = $(this);
            const $tabLinks = $this.find(".accordion-tabs_tab-link");
            let currentIndex = $tabLinks.index($tabLinks.filter(".w--current"));
            if (currentIndex === -1) {
              currentIndex = 0;
            }
            if ($tabLinks.length > 1) {
              let altIndex = currentIndex === 0 ? 1 : 0;
              $tabLinks.eq(altIndex).trigger("click");
            }
            $tabLinks.eq(currentIndex).trigger("click");
          });
        }
        setActiveAccordionTabs();
        (function() {
          const params = new URLSearchParams(window.location.search);
          const locationValue = params.get("location");
          if (locationValue) {
            const decodedLocationValue = decodeURIComponent(locationValue);
            const locationsSection = document.getElementById("locations");
            if (locationsSection) {
              const tabLinks = locationsSection.querySelectorAll(".accordion-tabs_tab-link");
              tabLinks.forEach((tabLink) => {
                const heading = tabLink.querySelector(".accordion-tabs_heading");
                if (heading && heading.textContent.trim().toLowerCase().replace(/\s+/g, "") === decodedLocationValue.toLowerCase()) {
                  tabLink.click();
                }
              });
            }
          }
        })();
        let resizeTimeout;
        $(window).on("resize", function() {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(function() {
            setActiveAccordionTabs();
          }, 100);
        });
        (function() {
          function easeOutQuad(t) {
            return t * (2 - t);
          }
          function animate({ duration, onUpdate, onComplete }) {
            const start = performance.now();
            function frame(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = easeOutQuad(progress);
              onUpdate(eased);
              if (progress < 1) {
                requestAnimationFrame(frame);
              } else {
                onComplete?.();
              }
            }
            requestAnimationFrame(frame);
          }
          function fadeScaleIn(el) {
            if (window.jQuery && el instanceof jQuery) {
              el = el[0];
            }
            if (!el || el.dataset.hasAnimated === "true") return;
            el.style.opacity = "0";
            el.style.transform = "scale(1)";
            el.style.transition = "none";
            void el.offsetWidth;
            animate({
              duration: 2e3,
              onUpdate: (t) => {
                el.style.opacity = t.toString();
              }
            });
            animate({
              duration: 4e3,
              onUpdate: (t) => {
                const scale = 1 + 0.05 * t;
                el.style.transform = `scale(${scale})`;
              }
            });
            el.dataset.hasAnimated = "true";
          }
          function fadeScaleInFromTab(el) {
            if (window.jQuery && el instanceof jQuery) {
              el = el[0];
            }
            if (!el) return;
            delete el.dataset.hasAnimated;
            fadeScaleIn(el);
          }
          function setupScrollAnimation(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => {
              el.style.opacity = "0";
              el.style.transform = "scale(1)";
            });
            const observer = new IntersectionObserver((entries, observer2) => {
              entries.forEach((entry) => {
                const el = entry.target;
                if (entry.isIntersecting && el.dataset.hasAnimated !== "true") {
                  fadeScaleIn(el);
                  observer2.unobserve(el);
                }
              });
            }, {
              threshold: 0.1
            });
            elements.forEach((el) => observer.observe(el));
          }
          setupScrollAnimation("[s-animate-zoom]");
          $(".accordion-tabs_tab-link").on("click", function(e) {
            const $this = $(this);
            const tabIndex = $this.index();
            const $imageRatio = $this.closest(".accordion-tabs_tabs").find(".accordion-tabs_tab-pane").eq(tabIndex).find("[s-animate-zoom]");
            console.log($imageRatio);
            fadeScaleInFromTab($imageRatio);
          });
        })();
        document.addEventListener("click", (e) => {
          const anchor = e.target.closest('.w-tab-menu a:not([href="#"])');
          if (!anchor) return;
          e.preventDefault();
          const href = anchor.getAttribute("href");
          if (href.includes("https://www.google.com/maps")) {
            window.open(href, "_blank");
          } else {
            window.location.href = href;
          }
        });
        const styleLines = [];
        const gradientClass = "s-gradient";
        $('[data-wf--accordion--variant="full-width"] [s-gradient-colour]').each(function(index) {
          const $this = $(this);
          const gradientColour = $this.attr("s-gradient-colour");
          if (!gradientColour || gradientColour.trim() === "") return;
          const trimmed = gradientColour.replace(/rgb\(|\)|\s+/g, "");
          const className = `${gradientClass}-${index}`;
          $this.addClass(className);
          styleLines.push(`
        .${className} {
         --gradient: ${trimmed};
          background: linear-gradient(to right, rgba(var(--gradient), 1) 0%, rgba(var(--gradient), 0) 65%), linear-gradient(to right, rgba(var(--gradient), 1) 0%, rgba(var(--gradient), 0) 35%);
        }
        
        @media (max-width: 991px) {
          .${className} {
            background: linear-gradient(to right, rgba(var(--gradient), 1) 0%, rgba(var(--gradient), 0) 65%), linear-gradient(to right, rgba(var(--gradient), 0.9) 0%, rgba(var(--gradient), 0) 55%);
          }
        }
        
        @media (max-width: 768px) {
          .${className} {
            background: linear-gradient(to right, rgba(var(--gradient), 1) 10%, rgba(var(--gradient), 0) 120%), linear-gradient(to right, rgba(var(--gradient), 1) -20%, rgba(var(--gradient), 0) 120%);
          }
        }
      `);
        });
        const backgroundClass = "s-background";
        $('[data-wf--accordion--variant="full-width"] [s-background-colour]').each(function(index) {
          const $this = $(this);
          const backgroundColour = $this.attr("s-background-colour");
          if (!backgroundColour || backgroundColour.trim() === "") return;
          const trimmed = backgroundColour.replace(/rgb\(|\)|\s+/g, "");
          const className = `${backgroundClass}-${index}`;
          $this.addClass(className);
          styleLines.push(`
        .${className} {
         --background: ${trimmed};
          background: rgba(var(--background), 1);
        }
      `);
        });
        if (styleLines.length) {
          const styleTag = `<style>${styleLines.join("\n")}</style>`;
          $("head").append(styleTag);
        }
        $(".accordion-tabs_tabs").each(function() {
          const $section = $(this);
          let sectionHeight = 0;
          sectionHeight += parseFloat($section.find(".accordion-tabs_tabs-menu").css("margin-bottom")) || 0;
          const $tabs = $section.find(".accordion-tabs_tab-link");
          const totalTabs = $tabs.length;
          if (totalTabs <= 1) return true;
          let tallestTab = 0;
          $tabs.each(function() {
            const $tab = $(this);
            const iconHeight = $tab.find(".accordion-tabs_tab-icon-wrapper").outerHeight(true);
            const headingHeight = $tab.find(".accordion-tabs_heading").outerHeight(true);
            let closedTabHeight = iconHeight > headingHeight ? iconHeight : headingHeight;
            closedTabHeight += parseFloat($tab.css("padding-top")) || 0;
            closedTabHeight += parseFloat($tab.css("padding-bottom")) || 0;
            closedTabHeight += parseFloat($tab.css("border-bottom-width")) || 0;
            sectionHeight += closedTabHeight;
            let tabContentHeight = 0;
            $tab.find(".accordion-tabs_paragraph > *").each(function() {
              tabContentHeight += $(this).outerHeight(true);
            });
            if (tabContentHeight > tallestTab) {
              tallestTab = tabContentHeight;
            }
          });
          sectionHeight += tallestTab;
          $section.css("min-height", Math.ceil(sectionHeight) + "px");
        });
        function applyFocalPointsToAllImages() {
          const images = document.querySelectorAll("[s-data-focal-x]");
          for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const focalX = parseFloat(img.getAttribute("s-data-focal-x")) || 0.5;
            const focalY = parseFloat(img.getAttribute("s-data-focal-y")) || 0.5;
            const posX = (focalX * 100).toFixed(2) + "%";
            const posY = (focalY * 100).toFixed(2) + "%";
            img.style.objectFit = "cover";
            img.style.objectPosition = `${posX} ${posY}`;
            img.style.width = "100%";
            img.style.height = "100%";
          }
        }
        applyFocalPointsToAllImages();
      }
    ]
  );
  function applyTargetBlankToLinks() {
    const links = document.querySelectorAll("a[s-target]");
    links.forEach(function(link) {
      const sTarget = link.getAttribute("s-target");
      if (sTarget === "_blank") {
        link.setAttribute("target", "_blank");
      }
    });
  }
  applyTargetBlankToLinks();
  if (true) {
    console.log("main.js loaded");
  }
})();
//# sourceMappingURL=main.js.map
