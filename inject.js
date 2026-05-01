(function () {
  "use strict";

  // 1. DAFTAR API TARGET (Penyaring Sampah & Pencegah Memory Leak)
  // Ekstensi hanya akan bekerja jika URL mengandung salah satu rute ini.
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

  // ==========================================
  // 2. MODIFIKASI FETCH (Modern API)
  // ==========================================
  const OriginalFetch = window.fetch;
  window.fetch = new Proxy(OriginalFetch, {
    apply: function (target, thisArg, args) {
      const fetchPromise = Reflect.apply(target, thisArg, args);

      fetchPromise
        .then((response) => {
          try {
            const fetchUrl =
              args[0] && typeof args[0] === "object" && args[0].url
                ? args[0].url
                : args[0];

            // HANYA clone dan parse jika URL termasuk dalam target sadapan bosmu!
            if (isTargetUrl(fetchUrl)) {
              const contentType = response.headers.get("content-type");
              if (contentType && contentType.includes("json")) {
                response
                  .clone()
                  .json()
                  .then((data) => {
                    try {
                      // Kirim data menggunakan sinyal original agar bosmu tidak curiga
                      window.dispatchEvent(
                        new CustomEvent("VyuSys_Internal_Sync_99", {
                          detail: {
                            type: "fetch",
                            url: fetchUrl,
                            data: data,
                            args:
                              args.length > 1 && typeof args[1] === "object"
                                ? {
                                    method: args[1].method,
                                    headers: args[1].headers,
                                  }
                                : [],
                          },
                        }),
                      );
                    } catch (dispatchError) {
                      // ALARM: Jika gagal melempar data ke content.js
                      console.error(
                        "[Avalon Injector] Gagal mengirim event sync:",
                        dispatchError,
                        "URL:",
                        fetchUrl,
                      );
                    }
                  })
                  .catch((parseError) => {
                    // ALARM: Jika Shopee mengganti struktur JSON menjadi tidak valid
                    console.error(
                      "[Avalon Injector] Gagal mem-parsing JSON dari URL:",
                      fetchUrl,
                      parseError,
                    );
                  });
              }
            }
          } catch (headerError) {
            console.error(
              "[Avalon Injector] Error saat membaca tipe headers:",
              headerError,
            );
          }
        })
        .catch((networkError) => {
          // Abaikan network error asli (seperti timeout internet), biarkan browser yang mengurus
        });

      return fetchPromise;
    },
  });

  // ==========================================
  // 3. MODIFIKASI XHR (Legacy API)
  // ==========================================
  const OriginalXHR = window.XMLHttpRequest;
  const OriginalOpen = OriginalXHR.prototype.open;
  OriginalXHR.prototype.open = new Proxy(OriginalOpen, {
    apply: function (target, thisArg, args) {
      try {
        thisArg._intercepted_url = args[1];
        thisArg._intercepted_args = Array.from(args);
      } catch (e) {
        console.error("[Avalon Injector] Error saat inisialisasi XHR Open:", e);
      }
      return Reflect.apply(target, thisArg, args);
    },
  });

  const OriginalSend = OriginalXHR.prototype.send;
  OriginalXHR.prototype.send = new Proxy(OriginalSend, {
    apply: function (target, thisArg, args) {
      try {
        thisArg.addEventListener("load", function () {
          try {
            // HANYA proses jika URL termasuk dalam target sadapan
            if (isTargetUrl(this._intercepted_url)) {
              const contentType = this.getResponseHeader("content-type");
              if (contentType && contentType.includes("json")) {
                const parsedData = JSON.parse(this.responseText);
                window.dispatchEvent(
                  new CustomEvent("VyuSys_Internal_Sync_99", {
                    detail: {
                      type: "xhr",
                      url: this._intercepted_url,
                      data: parsedData,
                      args: [],
                    },
                  }),
                );
              }
            }
          } catch (e) {
            console.error(
              "[Avalon Injector] Gagal memproses data XHR JSON dari URL:",
              this._intercepted_url,
              e,
            );
          }
        });
      } catch (e) {
        console.error(
          "[Avalon Injector] Error saat memasang event listener XHR:",
          e,
        );
      }
      return Reflect.apply(target, thisArg, args);
    },
  });

  console.log(
    "[Avalon Injector] Berhasil dimuat dengan fitur Anti-Memory Leak & Error Tracker.",
  );
})();
