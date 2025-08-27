"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/medical-kit.js
  $('[s-lightbox-link="trigger"]').on("click", function(e) {
    e.preventDefault();
    $('[s-lightbox-link="open"]').eq(0).trigger("click");
  });
})();
//# sourceMappingURL=medical-kit.js.map
