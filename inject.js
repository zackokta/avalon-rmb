(function () {
  "use strict";

  const OriginalFetch = window.fetch;
  window.fetch = new Proxy(OriginalFetch, {
    apply: function (target, thisArg, args) {
      const fetchPromise = Reflect.apply(target, thisArg, args);
      fetchPromise
        .then((response) => {
          try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("json")) {
              response
                .clone()
                .json()
                .then((data) => {
                  try {
                    const fetchUrl =
                      args[0] && typeof args[0] === "object" && args[0].url
                        ? args[0].url
                        : args[0];
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
                  } catch (e) {}
                })
                .catch((e) => {});
            }
          } catch (e) {}
        })
        .catch((e) => {});
      return fetchPromise;
    },
  });

  const OriginalXHR = window.XMLHttpRequest;
  const OriginalOpen = OriginalXHR.prototype.open;
  OriginalXHR.prototype.open = new Proxy(OriginalOpen, {
    apply: function (target, thisArg, args) {
      try {
        thisArg._intercepted_url = args[1];
        thisArg._intercepted_args = Array.from(args);
      } catch (e) {}
      return Reflect.apply(target, thisArg, args);
    },
  });

  const OriginalSend = OriginalXHR.prototype.send;
  OriginalXHR.prototype.send = new Proxy(OriginalSend, {
    apply: function (target, thisArg, args) {
      try {
        thisArg.addEventListener("load", function () {
          try {
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
          } catch (e) {}
        });
      } catch (e) {}
      return Reflect.apply(target, thisArg, args);
    },
  });
})();
