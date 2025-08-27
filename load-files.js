"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/load-files.js
  (function() {
    let windowLocationHash = window.location.hash;
    if (windowLocationHash) {
      var hash = windowLocationHash.substring(1).toLowerCase();
      let target = $("#" + hash);
      if (target.length) {
        let navigationWrapper = $(".nav_component").length ? $(".nav_component").height() : 0;
        $("html,body").animate({
          scrollTop: target.offset().top - navigationWrapper
        }, 200, "swing", function() {
        });
      }
    }
  })();
  var ipCheckPromise = null;
  var cachedIsDev = null;
  var isDevelopingLocally = () => {
    if (cachedIsDev !== null) {
      return Promise.resolve(cachedIsDev);
    }
    if (ipCheckPromise) {
      return ipCheckPromise;
    }
    ipCheckPromise = fetch("https://api.ipify.org?format=json").then((response) => response.json()).then((data) => {
      let developerIp = "62.31.169.177";
      if (data.ip === developerIp) {
        console.log("You are me!", data.ip);
        cachedIsDev = true;
        return true;
      } else {
        console.log("You are not me!", data.ip);
        cachedIsDev = false;
        return false;
      }
    }).catch((error) => {
      console.error("Error fetching IP:", error);
      cachedIsDev = false;
      return false;
    });
    return ipCheckPromise;
  };
  var deviceIsMobile = () => {
    if (/Mobile|Tablet|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )) {
      return true;
    }
    return false;
  };
  function loadFiles(_options) {
    if (!_options.hasOwnProperty("files")) {
      console.warn("Please format loadFiles() options correctly");
      return;
    }
    let count = 0;
    const cdnUrl = "https://cdn.jsdelivr.net/gh/summitdigitaluk/msos-website-public@0.0.0/";
    const files = _options["files"];
    const globalScrollTrigger = _options.hasOwnProperty("globalScrollTrigger") ? _options["globalScrollTrigger"] : false;
    const globalScrollTriggerRootMargin = _options.hasOwnProperty("globalScrollTriggerRootMargin") ? _options["globalScrollTriggerRootMargin"] : false;
    window.Webflow = window.Webflow || [];
    window.Webflow.push(async () => {
      const isDev = await isDevelopingLocally();
      function getScriptsInOrder(_index) {
        const getNextFile = () => {
          count += 1;
          if (count < files.length) {
            getScriptsInOrder(count);
          }
        };
        let index = _index ? _index : 0;
        let file = files[index];
        const url = file.hasOwnProperty("url") ? file["url"] : false;
        const elementMustExist = file.hasOwnProperty("elementMustExist") && file.hasOwnProperty("elementMustExist") !== false ? file["elementMustExist"] : false;
        let elementExists = false;
        if (elementMustExist !== false) {
          $.each(elementMustExist, function(index2, value) {
            if ($(value).length > 0) {
              elementExists = true;
              return false;
            }
          });
        }
        let scrollTrigger = false;
        if (file.hasOwnProperty("scrollTrigger") && file.hasOwnProperty("scrollTrigger") !== false) {
          $.each(file["scrollTrigger"], function(index2, value) {
            if ($(value).length > 0) {
              scrollTrigger = value;
              return false;
            }
          });
        }
        const scrollTriggerRootMargin = file.hasOwnProperty("scrollTriggerRootMargin") ? file["scrollTriggerRootMargin"] : false;
        const ignoreOnMobile = file.hasOwnProperty("ignoreOnMobile") ? file["ignoreOnMobile"] : false;
        const ignoreOnHomepage = file.hasOwnProperty("ignoreOnHomepage") ? file["ignoreOnHomepage"] : false;
        const ignoreOnThisPage = file.hasOwnProperty("ignoreOnThisPage") ? file["ignoreOnThisPage"] : false;
        let loader = file.hasOwnProperty("loader") ? file["loader"] : false;
        const success = file.hasOwnProperty("success") ? file["success"] : false;
        const fail = file.hasOwnProperty("fail") ? file["fail"] : false;
        if (url !== false) {
          const fileUrl = () => {
            if (url.indexOf("//") > -1) {
              return url;
            }
            if (isDev) {
              return "http://localhost:3000/" + url;
            }
            return cdnUrl + url;
          };
          if (url.slice(-4).indexOf(".css") > -1) {
            let linkEle = document.createElement("link");
            linkEle.href = fileUrl();
            linkEle.rel = "stylesheet";
            linkEle.type = "text/css";
            document.body.appendChild(linkEle);
            getNextFile();
          } else {
            if (elementMustExist === false || elementExists === true) {
              if (loader !== false && elementExists === true) {
                loader = true;
                $.each(elementMustExist, function(index2, value) {
                  $(value).addClass("loading");
                });
              }
              if (ignoreOnMobile === true && deviceIsMobile()) {
                if (fail !== false) fail();
                getNextFile();
              } else if (ignoreOnHomepage === true && window.location.origin === window.location.href.slice(0, -1)) {
                if (fail !== false) fail();
                getNextFile();
              } else if (ignoreOnThisPage !== false && ignoreOnThisPage === window.location.pathname) {
                if (fail !== false) fail();
                getNextFile();
              } else {
                if (globalScrollTrigger !== false || scrollTrigger !== false) {
                  let observerScrollTrigger = globalScrollTrigger !== false ? document.querySelectorAll(globalScrollTrigger) : document.querySelectorAll(scrollTrigger);
                  let config = {
                    rootMargin: globalScrollTriggerRootMargin !== false ? globalScrollTriggerRootMargin : scrollTriggerRootMargin !== false ? scrollTriggerRootMargin : "0px 0px 50px 0px",
                    threshold: 0
                  };
                  let observer = new IntersectionObserver(function(entries, self) {
                    entries.forEach(function(entry) {
                      if (entry.isIntersecting) {
                        $.ajax({
                          type: "GET",
                          url: fileUrl(),
                          dataType: "script",
                          cache: isDev ? false : true
                        }).done(function(script, textStatus) {
                          self.unobserve(entry.target);
                          if (loader === true) {
                            $.each(elementMustExist, function(index2, value) {
                              $(value).removeClass("loading");
                            });
                          }
                          if (success !== false) success();
                          if (globalScrollTrigger !== false) {
                            getNextFile();
                          }
                        }).fail(function(jqxhr, settings, exception) {
                          if (fail !== false) fail();
                          if (globalScrollTrigger !== false) {
                            getNextFile();
                          }
                        });
                      }
                    });
                  }, config);
                  observerScrollTrigger.forEach(function(ele) {
                    observer.observe(ele);
                  });
                  getNextFile();
                } else {
                  $.ajax({
                    type: "GET",
                    url: fileUrl(),
                    dataType: "script",
                    cache: isDev ? false : true
                  }).done(function(script, textStatus) {
                    if (loader === true) {
                      $.each(elementMustExist, function(index2, value) {
                        $(value).removeClass("loading");
                      });
                    }
                    if (success !== false) success();
                    getNextFile();
                  }).fail(function(jqxhr, settings, exception) {
                    if (fail !== false) fail();
                    getNextFile();
                  });
                }
              }
            } else {
              getNextFile();
            }
          }
        } else {
          getNextFile();
        }
      }
      getScriptsInOrder();
    });
  }
  window.loadFiles = loadFiles;
})();
//# sourceMappingURL=load-files.js.map
