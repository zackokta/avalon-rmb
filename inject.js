(function () {
  "use strict";

  // 1. DAFTAR API TARGET (Penyaring Sampah & Pencegah Memory Leak)
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

  // Helper untuk mengekstrak URL dengan aman dari argumen fetch
  function getSafeUrl(arg) {
    if (typeof arg === "string") return arg;
    if (arg instanceof URL) return arg.href;
    if (arg instanceof Request) return arg.url;
    if (arg && typeof arg === "object" && arg.url) return String(arg.url);
    return "";
  }

  // ==========================================
  // 2. MODIFIKASI FETCH (Modern API - Enterprise Grade)
  // ==========================================
  const OriginalFetch = window.fetch;
  window.fetch = new Proxy(OriginalFetch, {
    apply: function (target, thisArg, args) {
      const fetchPromise = Reflect.apply(target, thisArg, args);

      fetchPromise
        .then((response) => {
          try {
            const fetchUrl = getSafeUrl(args[0]);

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
                      console.error(
                        "[Avalon Injector] Gagal mengirim event sync:",
                        dispatchError,
                      );
                    }
                  })
                  .catch((parseError) => {
                    // Abaikan silent error jika JSON tidak valid dari server
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
          // Abaikan network error asli (seperti timeout internet)
        });

      return fetchPromise;
    },
  });

  // ==========================================
  // 3. MODIFIKASI XHR (Legacy API - Enterprise Grade)
  // ==========================================
  const OriginalXHR = window.XMLHttpRequest;
  const OriginalOpen = OriginalXHR.prototype.open;

  OriginalXHR.prototype.open = new Proxy(OriginalOpen, {
    apply: function (target, thisArg, args) {
      try {
        thisArg._intercepted_url = getSafeUrl(args[1]);
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
                let parsedData = null;

                // [AVALON FIX]: Menghindari InvalidStateError jika tipe respon bukan text
                if (this.responseType === "json") {
                  parsedData = this.response; // Sudah dalam bentuk Objek JSON
                } else if (
                  this.responseType === "" ||
                  this.responseType === "text"
                ) {
                  parsedData = JSON.parse(this.responseText); // Masih dalam bentuk String
                }

                if (parsedData) {
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
            }
          } catch (e) {
            console.error(
              "[Avalon Injector] Gagal memproses data XHR JSON:",
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
    "[Avalon Injector] Berhasil dimuat dengan perlindungan XHR/Fetch tingkat lanjut.",
  );
})();
