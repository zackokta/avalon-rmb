(function () {
  "use strict";

  // ==================== TARGET API FILTER ====================
  const TARGET_APIS = [
    "/api/v4/pdp/",
    "/api/v2/add_on_deal/",
    "/api/v2/bundle_deal/",
    "/api/v4/collection/",
    "/api/v2/item/",
    "/api/v4/recommend/",
    "/api/v4/search/",
    "/api/v4/mart/",
    "/api/v4/shop/",
    "/api/v4/traffic/",
    "/api/v4/flash_sale/",
    "/api/v2/voucher_wallet/",
    "tiktok/router/data",
  ];

  function isTargetUrl(url) {
    if (!url || typeof url !== "string") return false;
    return TARGET_APIS.some((api) => url.includes(api));
  }

  // ==================== STEALTH: Spoof toString ====================
  function spoofToString(originalFn, name) {
    try {
      Object.defineProperty(originalFn, "toString", {
        value: () => `function ${name}() { [native code] }`,
        writable: false,
        enumerable: false,
        configurable: true,
      });
    } catch (e) {}
  }

  // ==================== FETCH INTERCEPTOR ====================
  const OriginalFetch = window.fetch;

  const ProxiedFetch = new Proxy(OriginalFetch, {
    apply: function (target, thisArg, args) {
      const fetchPromise = Reflect.apply(target, thisArg, args);

      fetchPromise.then((response) => {
        try {
          const fetchUrl = args[0] && typeof args[0] === "object" && args[0].url
            ? args[0].url
            : args[0];

          if (isTargetUrl(fetchUrl)) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("json")) {
              response.clone().json().then((data) => {
                try {
                  // Jitter kecil agar tidak terlalu burst
                  setTimeout(() => {
                    window.dispatchEvent(
                      new CustomEvent("VyuSys_Internal_Sync_99", {
                        detail: {
                          type: "fetch",
                          url: fetchUrl,
                          data: data,
                          args: args.length > 1 && typeof args[1] === "object"
                            ? {
                                method: args[1].method,
                                headers: args[1].headers,
                              }
                            : [],
                        },
                      })
                    );
                  }, Math.random() * 80 + 20);
                } catch (dispatchError) {
                  // Silent error (kurangi jejak)
                }
              }).catch(() => {});
            }
          }
        } catch (e) {}
      }).catch(() => {});

      return fetchPromise;
    },
  });

  // Spoof toString agar terlihat native
  spoofToString(ProxiedFetch, "fetch");
  window.fetch = ProxiedFetch;

  // ==================== XHR INTERCEPTOR ====================
  const OriginalXHR = window.XMLHttpRequest;
  const OriginalOpen = OriginalXHR.prototype.open;
  const OriginalSend = OriginalXHR.prototype.send;

  OriginalXHR.prototype.open = new Proxy(OriginalOpen, {
    apply: function (target, thisArg, args) {
      try {
        thisArg._intercepted_url = args[1];
      } catch (e) {}
      return Reflect.apply(target, thisArg, args);
    },
  });

  OriginalXHR.prototype.send = new Proxy(OriginalSend, {
    apply: function (target, thisArg, args) {
      try {
        thisArg.addEventListener("load", function () {
          try {
            if (isTargetUrl(this._intercepted_url)) {
              const contentType = this.getResponseHeader("content-type");
              if (contentType && contentType.includes("json")) {
                const parsedData = JSON.parse(this.responseText);

                // Jitter kecil
                setTimeout(() => {
                  window.dispatchEvent(
                    new CustomEvent("VyuSys_Internal_Sync_99", {
                      detail: {
                        type: "xhr",
                        url: this._intercepted_url,
                        data: parsedData,
                        args: [],
                      },
                    })
                  );
                }, Math.random() * 80 + 20);
              }
            }
          } catch (e) {}
        });
      } catch (e) {}

      return Reflect.apply(target, thisArg, args);
    },
  });

  // Spoof toString untuk XHR
  spoofToString(OriginalXHR.prototype.open, "open");
  spoofToString(OriginalXHR.prototype.send, "send");

  // ==================== STEALTH: Optional - Hide proxy from devtools ====================
  // (Tidak diaktifkan karena bisa menimbulkan masalah compatibility)
})();
