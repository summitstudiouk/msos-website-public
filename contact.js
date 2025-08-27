"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/google-map.js
  async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const markerImage = "https://cdn.prod.website-files.com/67ec0fac2b87c50a2530a138/688b7d97791f6a0778828cb0_map-pin.svg";
    document.querySelectorAll("[s-google-map]").forEach((el) => {
      const lat = parseFloat(el.getAttribute("s-google-map-lat"));
      const lng = parseFloat(el.getAttribute("s-google-map-lng"));
      const zoom = parseInt(el.getAttribute("s-google-map-zoom"), 10) || 12;
      const title = el.getAttribute("s-google-map-title") || "";
      const map = new Map(el, {
        center: { lat, lng },
        zoom,
        mapId: "fd313f797f0ec742cad0a626",
        draggable: false,
        scrollwheel: false,
        disableDefaultUI: true,
        gestureHandling: "none",
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        }
      });
      const img = document.createElement("img");
      img.src = markerImage;
      img.style.width = "42px";
      img.style.height = "56px";
      new AdvancedMarkerElement({
        map,
        position: { lat, lng },
        content: img,
        title
      });
    });
  }
  window.initMap = initMap;
  if (true) {
    console.log("google-map.js loaded");
  }

  // src/contact.js
  (function() {
    const contactForm = document.getElementById("wf-form-Contact-Form");
    if (!contactForm) return;
    const params = new URLSearchParams(window.location.search);
    const queryValue = params.get("query");
    if (queryValue) {
      const decodedQueryValue = decodeURIComponent(queryValue);
      const radio = contactForm.querySelector(`input[type="radio"][name="Query"][value="${decodedQueryValue}"]`);
      if (radio) {
        radio.click();
        radio.dispatchEvent(new Event("change"));
      }
    }
  })();
  if (true) {
    console.log("contact.js loaded");
  }
})();
//# sourceMappingURL=contact.js.map
