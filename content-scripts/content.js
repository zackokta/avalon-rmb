var content = function() {
    "use strict";

    // Disable Back/Forward Cache to prevent port disconnection errors
    window.addEventListener("pageshow", function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    });
    window.addEventListener("beforeunload", function () {
      try {
        Y("taskFailed", { reason: "Unexpected Navigation" });
      } catch (e) {}
    });

    function Ms(t) {
      return t;
    }
    const te = globalThis.browser?.runtime?.id
        ? globalThis.browser
        : globalThis.chrome,
      Ut = !1,
      zt = (t, e) => t === e,
      K = Symbol("solid-proxy"),
      ot = Symbol("solid-track"),
      de = {
        equals: zt,
      };
    let it = mt;
    const W = 1,
      me = 2,
      at = {
        owned: null,
        cleanups: null,
        context: null,
        owner: null,
      };
    var C = null;
    let Ie = null,
      Wt = null,
      _ = null,
      T = null,
      B = null,
      ge = 0;

    function Kt(t, e) {
      const n = _,
        s = C,
        r = t.length === 0,
        o = e === void 0 ? s : e,
        i = r
          ? at
          : {
              owned: null,
              cleanups: null,
              context: o ? o.context : null,
              owner: o,
            },
        a = r ? t : () => t(() => se(() => oe(i)));
      ((C = i), (_ = null));
      try {
        return V(a, !0);
      } finally {
        ((_ = n), (C = s));
      }
    }

    function lt(t, e) {
      e = e ? Object.assign({}, de, e) : de;
      const n = {
          value: t,
          observers: null,
          observerSlots: null,
          comparator: e.equals || void 0,
        },
        s = (r) => (typeof r == "function" && (r = r(n.value)), dt(n, r));
      return [ut.bind(n), s];
    }

    function ne(t, e, n) {
      const s = Oe(t, e, !1, W);
      re(s);
    }

    function ct(t, e, n) {
      it = Ht;
      const s = Oe(t, e, !1, W);
      ((s.user = !0), B ? B.push(s) : re(s));
    }

    function Me(t, e, n) {
      n = n ? Object.assign({}, de, n) : de;
      const s = Oe(t, e, !0, 0);
      return (
        (s.observers = null),
        (s.observerSlots = null),
        (s.comparator = n.equals || void 0),
        re(s),
        ut.bind(s)
      );
    }

    function qt(t) {
      return V(t, !1);
    }

    function se(t) {
      if (_ === null) return t();
      const e = _;
      _ = null;
      try {
        return t();
      } finally {
        _ = e;
      }
    }

    function Gt(t) {
      return (
        C === null ||
          (C.cleanups === null ? (C.cleanups = [t]) : C.cleanups.push(t)),
        t
      );
    }

    function Te() {
      return _;
    }

    function ut() {
      if (this.sources && this.state)
        if (this.state === W) re(this);
        else {
          const t = T;
          ((T = null), V(() => he(this), !1), (T = t));
        }
      if (_) {
        const t = this.observers ? this.observers.length : 0;
        (_.sources
          ? (_.sources.push(this), _.sourceSlots.push(t))
          : ((_.sources = [this]), (_.sourceSlots = [t])),
          this.observers
            ? (this.observers.push(_),
              this.observerSlots.push(_.sources.length - 1))
            : ((this.observers = [_]),
              (this.observerSlots = [_.sources.length - 1])));
      }
      return this.value;
    }

    function dt(t, e, n) {
      let s = t.value;
      return (
        (!t.comparator || !t.comparator(s, e)) &&
          ((t.value = e),
          t.observers &&
            t.observers.length &&
            V(() => {
              for (let r = 0; r < t.observers.length; r += 1) {
                const o = t.observers[r],
                  i = Ie && Ie.running;
                (i && Ie.disposed.has(o),
                  (i ? !o.tState : !o.state) &&
                    (o.pure ? T.push(o) : B.push(o), o.observers && gt(o)),
                  i || (o.state = W));
              }
              if (T.length > 1e6) throw ((T = []), new Error());
            }, !1)),
        e
      );
    }

    function re(t) {
      if (!t.fn) return;
      oe(t);
      const e = ge;
      Zt(t, t.value, e);
    }

    function Zt(t, e, n) {
      let s;
      const r = C,
        o = _;
      _ = C = t;
      try {
        s = t.fn(e);
      } catch (i) {
        return (
          t.pure &&
            ((t.state = W), t.owned && t.owned.forEach(oe), (t.owned = null)),
          (t.updatedAt = n + 1),
          ft(i)
        );
      } finally {
        ((_ = o), (C = r));
      }
      (!t.updatedAt || t.updatedAt <= n) &&
        (t.updatedAt != null && "observers" in t ? dt(t, s) : (t.value = s),
        (t.updatedAt = n));
    }

    function Oe(t, e, n, s = W, r) {
      const o = {
        fn: t,
        state: s,
        updatedAt: null,
        owned: null,
        sources: null,
        sourceSlots: null,
        cleanups: null,
        value: e,
        owner: C,
        context: C ? C.context : null,
        pure: n,
      };
      return (
        C === null ||
          (C !== at && (C.owned ? C.owned.push(o) : (C.owned = [o]))),
        o
      );
    }

    function fe(t) {
      if (t.state === 0) return;
      if (t.state === me) return he(t);
      if (t.suspense && se(t.suspense.inFallback))
        return t.suspense.effects.push(t);
      const e = [t];
      for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < ge); )
        t.state && e.push(t);
      for (let n = e.length - 1; n >= 0; n--)
        if (((t = e[n]), t.state === W)) re(t);
        else if (t.state === me) {
          const s = T;
          ((T = null), V(() => he(t, e[0]), !1), (T = s));
        }
    }

    function V(t, e) {
      if (T) return t();
      let n = !1;
      (e || (T = []), B ? (n = !0) : (B = []), ge++);
      try {
        const s = t();
        return (Vt(n), s);
      } catch (s) {
        (n || (B = null), (T = null), ft(s));
      }
    }

    function Vt(t) {
      if ((T && (mt(T), (T = null)), t)) return;
      const e = B;
      ((B = null), e.length && V(() => it(e), !1));
    }

    function mt(t) {
      for (let e = 0; e < t.length; e++) fe(t[e]);
    }

    function Ht(t) {
      let e,
        n = 0;
      for (e = 0; e < t.length; e++) {
        const s = t[e];
        s.user ? (t[n++] = s) : fe(s);
      }
      for (e = 0; e < n; e++) fe(t[e]);
    }

    function he(t, e) {
      t.state = 0;
      for (let n = 0; n < t.sources.length; n += 1) {
        const s = t.sources[n];
        if (s.sources) {
          const r = s.state;
          r === W
            ? s !== e && (!s.updatedAt || s.updatedAt < ge) && fe(s)
            : r === me && he(s, e);
        }
      }
    }

    function gt(t) {
      for (let e = 0; e < t.observers.length; e += 1) {
        const n = t.observers[e];
        n.state ||
          ((n.state = me),
          n.pure ? T.push(n) : B.push(n),
          n.observers && gt(n));
      }
    }

    function oe(t) {
      let e;
      if (t.sources)
        for (; t.sources.length; ) {
          const n = t.sources.pop(),
            s = t.sourceSlots.pop(),
            r = n.observers;
          if (r && r.length) {
            const o = r.pop(),
              i = n.observerSlots.pop();
            s < r.length &&
              ((o.sourceSlots[i] = s), (r[s] = o), (n.observerSlots[s] = i));
          }
        }
      if (t.tOwned) {
        for (e = t.tOwned.length - 1; e >= 0; e--) oe(t.tOwned[e]);
        delete t.tOwned;
      }
      if (t.owned) {
        for (e = t.owned.length - 1; e >= 0; e--) oe(t.owned[e]);
        t.owned = null;
      }
      if (t.cleanups) {
        for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
        t.cleanups = null;
      }
      t.state = 0;
    }

    function Jt(t) {
      return t instanceof Error
        ? t
        : new Error(typeof t == "string" ? t : "Unknown error", {
            cause: t,
          });
    }

    function ft(t, e = C) {
      throw Jt(t);
    }

    function Re(t, e) {
      return se(() => t(e || {}));
    }
    const Xt = (t) => `Stale read from <${t}>.`;

    function ke(t) {
      const e = t.keyed,
        n = Me(() => t.when, void 0, void 0),
        s = e
          ? n
          : Me(n, void 0, {
              equals: (r, o) => !r == !o,
            });
      return Me(
        () => {
          const r = s();
          if (r) {
            const o = t.children;
            return typeof o == "function" && o.length > 0
              ? se(() =>
                  o(
                    e
                      ? r
                      : () => {
                          if (!se(s)) throw Xt("Show");
                          return n();
                        },
                  ),
                )
              : o;
          }
          return t.fallback;
        },
        void 0,
        void 0,
      );
    }

    function Ne(t) {
      return t &&
        t.__esModule &&
        Object.prototype.hasOwnProperty.call(t, "default")
        ? t.default
        : t;
    }
    var Le, ht;

    function Yt() {
      if (ht) return Le;
      ht = 1;
      var t =
          /^[a-z](?:[\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\x2D\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/,
        e = function (n) {
          return t.test(n);
        };
      return ((Le = e), Le);
    }
    var Qt = Yt();
    const en = Ne(Qt);
    var tn = (t, e, n) =>
      new Promise((s, r) => {
        var o = (l) => {
            try {
              a(n.next(l));
            } catch (c) {
              r(c);
            }
          },
          i = (l) => {
            try {
              a(n.throw(l));
            } catch (c) {
              r(c);
            }
          },
          a = (l) =>
            l.done ? s(l.value) : Promise.resolve(l.value).then(o, i);
        a((n = n.apply(t, e)).next());
      });

    function nn(t) {
      return tn(this, null, function* () {
        const {
          name: e,
          mode: n = "closed",
          css: s,
          isolateEvents: r = !1,
        } = t;
        if (!en(e))
          throw Error(
            `"${e}" is not a valid custom element name. It must be two words and kebab-case, with a few exceptions. See spec for more details: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name`,
          );
        const o = document.createElement(e),
          i = o.attachShadow({
            mode: n,
          }),
          a = document.createElement("html"),
          l = document.createElement("body"),
          c = document.createElement("head");
        if (s) {
          const m = document.createElement("style");
          ("url" in s
            ? (m.textContent = yield fetch(s.url).then((f) => f.text()))
            : (m.textContent = s.textContent),
            c.appendChild(m));
        }
        return (
          a.appendChild(c),
          a.appendChild(l),
          i.appendChild(a),
          r &&
            (Array.isArray(r) ? r : ["keydown", "keyup", "keypress"]).forEach(
              (f) => {
                l.addEventListener(f, (h) => h.stopPropagation());
              },
            ),
          {
            parentElement: o,
            shadow: i,
            isolatedElement: l,
          }
        );
      });
    }
    const sn = Symbol("null");
    let rn = 0;
    class on extends Map {
      constructor() {
        (super(),
          (this._objectHashes = new WeakMap()),
          (this._symbolHashes = new Map()),
          (this._publicKeys = new Map()));
        const [e] = arguments;
        if (e != null) {
          if (typeof e[Symbol.iterator] != "function")
            throw new TypeError(
              typeof e +
                " is not iterable (cannot read property Symbol(Symbol.iterator))",
            );
          for (const [n, s] of e) this.set(n, s);
        }
      }
      _getPublicKeys(e, n = !1) {
        if (!Array.isArray(e))
          throw new TypeError("The keys parameter must be an array");
        const s = this._getPrivateKey(e, n);
        let r;
        return (
          s && this._publicKeys.has(s)
            ? (r = this._publicKeys.get(s))
            : n && ((r = [...e]), this._publicKeys.set(s, r)),
          {
            privateKey: s,
            publicKey: r,
          }
        );
      }
      _getPrivateKey(e, n = !1) {
        const s = [];
        for (let r of e) {
          r === null && (r = sn);
          const o =
            typeof r == "object" || typeof r == "function"
              ? "_objectHashes"
              : typeof r == "symbol"
                ? "_symbolHashes"
                : !1;
          if (!o) s.push(r);
          else if (this[o].has(r)) s.push(this[o].get(r));
          else if (n) {
            const i = `@@mkm-ref-${rn++}@@`;
            (this[o].set(r, i), s.push(i));
          } else return !1;
        }
        return JSON.stringify(s);
      }
      set(e, n) {
        const { publicKey: s } = this._getPublicKeys(e, !0);
        return super.set(s, n);
      }
      get(e) {
        const { publicKey: n } = this._getPublicKeys(e);
        return super.get(n);
      }
      has(e) {
        const { publicKey: n } = this._getPublicKeys(e);
        return super.has(n);
      }
      delete(e) {
        const { publicKey: n, privateKey: s } = this._getPublicKeys(e);
        return !!(n && super.delete(n) && this._publicKeys.delete(s));
      }
      clear() {
        (super.clear(), this._symbolHashes.clear(), this._publicKeys.clear());
      }
      get [Symbol.toStringTag]() {
        return "ManyKeysMap";
      }
      get size() {
        return super.size;
      }
    }

    function De(t) {
      if (t === null || typeof t != "object") return !1;
      const e = Object.getPrototypeOf(t);
      return (e !== null &&
        e !== Object.prototype &&
        Object.getPrototypeOf(e) !== null) ||
        Symbol.iterator in t
        ? !1
        : Symbol.toStringTag in t
          ? Object.prototype.toString.call(t) === "[object Module]"
          : !0;
    }

    function Fe(t, e, n = ".", s) {
      if (!De(e)) return Fe(t, {}, n, s);
      const r = Object.assign({}, e);
      for (const o in t) {
        if (o === "__proto__" || o === "constructor") continue;
        const i = t[o];
        i != null &&
          ((s && s(r, o, i, n)) ||
            (Array.isArray(i) && Array.isArray(r[o])
              ? (r[o] = [...i, ...r[o]])
              : De(i) && De(r[o])
                ? (r[o] = Fe(i, r[o], (n ? `${n}.` : "") + o.toString(), s))
                : (r[o] = i)));
      }
      return r;
    }

    function an(t) {
      return (...e) => e.reduce((n, s) => Fe(n, s, "", t), {});
    }
    const ln = an(),
      pt = (t) =>
        t !== null
          ? {
              isDetected: !0,
              result: t,
            }
          : {
              isDetected: !1,
            },
      cn = (t) =>
        t === null
          ? {
              isDetected: !0,
              result: null,
            }
          : {
              isDetected: !1,
            },
      un = () => ({
        target: globalThis.document,
        unifyProcess: !0,
        detector: pt,
        observeConfigs: {
          childList: !0,
          subtree: !0,
          attributes: !0,
        },
        signal: void 0,
        customMatcher: void 0,
      }),
      dn = (t, e) => ln(t, e),
      $e = new on();

    function mn(t) {
      const { defaultOptions: e } = t;
      return (n, s) => {
        const {
            target: r,
            unifyProcess: o,
            observeConfigs: i,
            detector: a,
            signal: l,
            customMatcher: c,
          } = dn(s, e),
          m = [n, r, o, i, a, l, c],
          f = $e.get(m);
        if (o && f) return f;
        const h = new Promise(async (d, p) => {
          if (l?.aborted) return p(l.reason);
          const w = new MutationObserver(async (x) => {
            for (const S of x) {
              if (l?.aborted) {
                w.disconnect();
                break;
              }
              const I = await yt({
                selector: n,
                target: r,
                detector: a,
                customMatcher: c,
              });
              if (I.isDetected) {
                (w.disconnect(), d(I.result));
                break;
              }
            }
          });
          l?.addEventListener("abort", () => (w.disconnect(), p(l.reason)), {
            once: !0,
          });
          const b = await yt({
            selector: n,
            target: r,
            detector: a,
            customMatcher: c,
          });
          if (b.isDetected) return d(b.result);
          w.observe(r, i);
        }).finally(() => {
          $e.delete(m);
        });
        return ($e.set(m, h), h);
      };
    }
    async function yt({
      target: t,
      selector: e,
      detector: n,
      customMatcher: s,
    }) {
      const r = s ? s(e) : t.querySelector(e);
      return await n(r);
    }
    const gn = mn({
      defaultOptions: un(),
    });

    function pe(t, ...e) {}
    const je = {
      debug: (...t) => pe(console.debug, ...t),
      log: (...t) => pe(console.log, ...t),
      warn: (...t) => pe(console.warn, ...t),
      error: (...t) => pe(console.error, ...t),
    };

    function fn(t, e, n) {
      n.position !== "inline" &&
        (n.zIndex != null && (t.style.zIndex = String(n.zIndex)),
        (t.style.overflow = "visible"),
        (t.style.position = "relative"),
        (t.style.width = "0"),
        (t.style.height = "0"),
        (t.style.display = "block"),
        e &&
          (n.position === "overlay"
            ? ((e.style.position = "absolute"),
              n.alignment?.startsWith("bottom-")
                ? (e.style.bottom = "0")
                : (e.style.top = "0"),
              n.alignment?.endsWith("-right")
                ? (e.style.right = "0")
                : (e.style.left = "0"))
            : ((e.style.position = "fixed"),
              (e.style.top = "0"),
              (e.style.bottom = "0"),
              (e.style.left = "0"),
              (e.style.right = "0"))));
    }

    function Be(t) {
      if (t.anchor == null) return document.body;
      let e = typeof t.anchor == "function" ? t.anchor() : t.anchor;
      return typeof e == "string"
        ? e.startsWith("/")
          ? (document.evaluate(
              e,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null,
            ).singleNodeValue ?? void 0)
          : (document.querySelector(e) ?? void 0)
        : (e ?? void 0);
    }

    function hn(t, e) {
      const n = Be(e);
      if (n == null)
        throw Error(
          "Failed to mount content script UI: could not find anchor element",
        );
      switch (e.append) {
        case void 0:
        case "last":
          n.append(t);
          break;
        case "first":
          n.prepend(t);
          break;
        case "replace":
          n.replaceWith(t);
          break;
        case "after":
          n.parentElement?.insertBefore(t, n.nextElementSibling);
          break;
        case "before":
          n.parentElement?.insertBefore(t, n);
          break;
        default:
          e.append(n, t);
          break;
      }
    }

    function pn(t, e) {
      let n;
      const s = () => {
          (n?.stopAutoMount(), (n = void 0));
        },
        r = () => {
          t.mount();
        },
        o = t.remove;
      return {
        mount: r,
        remove: () => {
          (s(), t.remove());
        },
        autoMount: (l) => {
          (n && je.warn("autoMount is already set."),
            (n = yn(
              {
                mount: r,
                unmount: o,
                stopAutoMount: s,
              },
              {
                ...e,
                ...l,
              },
            )));
        },
      };
    }

    function yn(t, e) {
      const n = new AbortController(),
        s = "explicit_stop_auto_mount",
        r = () => {
          (n.abort(s), e.onStop?.());
        };
      let o = typeof e.anchor == "function" ? e.anchor() : e.anchor;
      if (o instanceof Element)
        throw Error(
          "autoMount and Element anchor option cannot be combined. Avoid passing `Element` directly or `() => Element` to the anchor.",
        );
      async function i(a) {
        let l = !!Be(e);
        for (l && t.mount(); !n.signal.aborted; )
          try {
            ((l = !!(await gn(a ?? "body", {
              customMatcher: () => Be(e) ?? null,
              detector: l ? cn : pt,
              signal: n.signal,
            }))),
              l ? t.mount() : (t.unmount(), e.once && t.stopAutoMount()));
          } catch (c) {
            if (n.signal.aborted && n.signal.reason === s) break;
            throw c;
          }
      }
      return (
        i(o),
        {
          stopAutoMount: r,
        }
      );
    }

    function wn(t) {
      let e = t,
        n = "";
      const s = /(\s*@(property|font-face)[\s\S]*?{[\s\S]*?})/gm;
      let r;
      for (; (r = s.exec(t)) !== null; )
        ((n += r[1]), (e = e.replace(r[1], "")));
      return {
        documentCss: n.trim(),
        shadowCss: e.trim(),
      };
    }
    async function An(t, e) {
      const n = Math.random().toString(36).substring(2, 15),
        s = [];
      if (
        (e.inheritStyles ||
          s.push("/* WXT Shadow Root Reset */ :host{all:initial !important;}"),
        e.css && s.push(e.css),
        t.options?.cssInjectionMode === "ui")
      ) {
        const d = await bn();
        s.push(d.replaceAll(":root", ":host"));
      }
      const { shadowCss: r, documentCss: o } = wn(
          s
            .join(
              `
`,
            )
            .trim(),
        ),
        {
          isolatedElement: i,
          parentElement: a,
          shadow: l,
        } = await nn({
          name: e.name,
          css: {
            textContent: r,
          },
          mode: e.mode ?? "open",
          isolateEvents: e.isolateEvents,
        });
      a.setAttribute("data-wxt-shadow-root", "");
      let c;
      const m = () => {
          if (
            (hn(a, e),
            fn(a, l.querySelector("html"), e),
            o &&
              !document.querySelector(
                `style[wxt-shadow-root-document-styles="${n}"]`,
              ))
          ) {
            const d = document.createElement("style");
            ((d.textContent = o),
              d.setAttribute("wxt-shadow-root-document-styles", n),
              (document.head ?? document.body).append(d));
          }
          c = e.onMount(i, l, a);
        },
        f = () => {
          for (
            e.onRemove?.(c),
              a.remove(),
              document
                .querySelector(`style[wxt-shadow-root-document-styles="${n}"]`)
                ?.remove();
            i.lastChild;
          )
            i.removeChild(i.lastChild);
          c = void 0;
        },
        h = pn(
          {
            mount: m,
            remove: f,
          },
          e,
        );
      return (
        t.onInvalidated(f),
        {
          shadow: l,
          shadowHost: a,
          uiContainer: i,
          ...h,
          get mounted() {
            return c;
          },
        }
      );
    }
    async function bn() {
      const t = te.runtime.getURL("/content-scripts/content.css");
      try {
        return await (await fetch(t)).text();
      } catch (e) {
        return (
          je.warn(
            `Failed to load styles @ ${t}. Did you forget to import the stylesheet in your entrypoint?`,
            e,
          ),
          ""
        );
      }
    }

    function En(t, e, n) {
      let s = n.length,
        r = e.length,
        o = s,
        i = 0,
        a = 0,
        l = e[r - 1].nextSibling,
        c = null;
      for (; i < r || a < o; ) {
        if (e[i] === n[a]) {
          (i++, a++);
          continue;
        }
        for (; e[r - 1] === n[o - 1]; ) (r--, o--);
        if (r === i) {
          const m = o < s ? (a ? n[a - 1].nextSibling : n[o - a]) : l;
          for (; a < o; ) t.insertBefore(n[a++], m);
        } else if (o === a)
          for (; i < r; ) ((!c || !c.has(e[i])) && e[i].remove(), i++);
        else if (e[i] === n[o - 1] && n[a] === e[r - 1]) {
          const m = e[--r].nextSibling;
          (t.insertBefore(n[a++], e[i++].nextSibling),
            t.insertBefore(n[--o], m),
            (e[r] = n[o]));
        } else {
          if (!c) {
            c = new Map();
            let f = a;
            for (; f < o; ) c.set(n[f], f++);
          }
          const m = c.get(e[i]);
          if (m != null)
            if (a < m && m < o) {
              let f = i,
                h = 1,
                d;
              for (
                ;
                ++f < r && f < o && !((d = c.get(e[f])) == null || d !== m + h);
              )
                h++;
              if (h > m - a) {
                const p = e[i];
                for (; a < m; ) t.insertBefore(n[a++], p);
              } else t.replaceChild(n[a++], e[i++]);
            } else i++;
          else e[i++].remove();
        }
      }
    }

    function vn(t, e, n, s = {}) {
      let r;
      return (
        Kt((o) => {
          ((r = o),
            e === document ? t() : F(e, t(), e.firstChild ? null : void 0, n));
        }, s.owner),
        () => {
          (r(), (e.textContent = ""));
        }
      );
    }

    function q(t, e, n, s) {
      let r;
      const o = () => {
          const a = document.createElement("template");
          return ((a.innerHTML = t), a.content.firstChild);
        },
        i = () => (r || (r = o())).cloneNode(!0);
      return ((i.cloneNode = i), i);
    }

    function _n(t, e, n) {
      n == null ? t.removeAttribute(e) : t.setAttribute(e, n);
    }

    function F(t, e, n, s) {
      if ((n !== void 0 && !s && (s = []), typeof e != "function"))
        return ye(t, e, s, n);
      ne((r) => ye(t, e(), r, n), s);
    }

    function ye(t, e, n, s, r) {
      for (; typeof n == "function"; ) n = n();
      if (e === n) return n;
      const o = typeof e,
        i = s !== void 0;
      if (
        ((t = (i && n[0] && n[0].parentNode) || t),
        o === "string" || o === "number")
      ) {
        if (o === "number" && ((e = e.toString()), e === n)) return n;
        if (i) {
          let a = n[0];
          (a && a.nodeType === 3
            ? a.data !== e && (a.data = e)
            : (a = document.createTextNode(e)),
            (n = H(t, n, s, a)));
        } else
          n !== "" && typeof n == "string"
            ? (n = t.firstChild.data = e)
            : (n = t.textContent = e);
      } else if (e == null || o === "boolean") n = H(t, n, s);
      else {
        if (o === "function")
          return (
            ne(() => {
              let a = e();
              for (; typeof a == "function"; ) a = a();
              n = ye(t, a, n, s);
            }),
            () => n
          );
        if (Array.isArray(e)) {
          const a = [],
            l = n && Array.isArray(n);
          if (Ue(a, e, n, r))
            return (ne(() => (n = ye(t, a, n, s, !0))), () => n);
          if (a.length === 0) {
            if (((n = H(t, n, s)), i)) return n;
          } else
            l
              ? n.length === 0
                ? wt(t, a, s)
                : En(t, n, a)
              : (n && H(t), wt(t, a));
          n = a;
        } else if (e.nodeType) {
          if (Array.isArray(n)) {
            if (i) return (n = H(t, n, s, e));
            H(t, n, null, e);
          } else
            n == null || n === "" || !t.firstChild
              ? t.appendChild(e)
              : t.replaceChild(e, t.firstChild);
          n = e;
        }
      }
      return n;
    }

    function Ue(t, e, n, s) {
      let r = !1;
      for (let o = 0, i = e.length; o < i; o++) {
        let a = e[o],
          l = n && n[t.length],
          c;
        if (!(a == null || a === !0 || a === !1))
          if ((c = typeof a) == "object" && a.nodeType) t.push(a);
          else if (Array.isArray(a)) r = Ue(t, a, l) || r;
          else if (c === "function")
            if (s) {
              for (; typeof a == "function"; ) a = a();
              r =
                Ue(t, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) ||
                r;
            } else (t.push(a), (r = !0));
          else {
            const m = String(a);
            l && l.nodeType === 3 && l.data === m
              ? t.push(l)
              : t.push(document.createTextNode(m));
          }
      }
      return r;
    }

    function wt(t, e, n = null) {
      for (let s = 0, r = e.length; s < r; s++) t.insertBefore(e[s], n);
    }

    function H(t, e, n, s) {
      if (n === void 0) return (t.textContent = "");
      const r = s || document.createTextNode("");
      if (e.length) {
        let o = !1;
        for (let i = e.length - 1; i >= 0; i--) {
          const a = e[i];
          if (r !== a) {
            const l = a.parentNode === t;
            !o && !i
              ? l
                ? t.replaceChild(r, a)
                : t.insertBefore(r, n)
              : l && a.remove();
          } else o = !0;
        }
      } else t.insertBefore(r, n);
      return [r];
    }
    const ze = Symbol("store-raw"),
      J = Symbol("store-node"),
      U = Symbol("store-has"),
      At = Symbol("store-self");

    function bt(t) {
      let e = t[K];
      if (
        !e &&
        (Object.defineProperty(t, K, {
          value: (e = new Proxy(t, Cn)),
        }),
        !Array.isArray(t))
      ) {
        const n = Object.keys(t),
          s = Object.getOwnPropertyDescriptors(t);
        for (let r = 0, o = n.length; r < o; r++) {
          const i = n[r];
          s[i].get &&
            Object.defineProperty(t, i, {
              enumerable: s[i].enumerable,
              get: s[i].get.bind(e),
            });
        }
      }
      return e;
    }

    function we(t) {
      let e;
      return (
        t != null &&
        typeof t == "object" &&
        (t[K] ||
          !(e = Object.getPrototypeOf(t)) ||
          e === Object.prototype ||
          Array.isArray(t))
      );
    }

    function ie(t, e = new Set()) {
      let n, s, r, o;
      if ((n = t != null && t[ze])) return n;
      if (!we(t) || e.has(t)) return t;
      if (Array.isArray(t)) {
        Object.isFrozen(t) ? (t = t.slice(0)) : e.add(t);
        for (let i = 0, a = t.length; i < a; i++)
          ((r = t[i]), (s = ie(r, e)) !== r && (t[i] = s));
      } else {
        Object.isFrozen(t) ? (t = Object.assign({}, t)) : e.add(t);
        const i = Object.keys(t),
          a = Object.getOwnPropertyDescriptors(t);
        for (let l = 0, c = i.length; l < c; l++)
          ((o = i[l]),
            !a[o].get && ((r = t[o]), (s = ie(r, e)) !== r && (t[o] = s)));
      }
      return t;
    }

    function Ae(t, e) {
      let n = t[e];
      return (
        n ||
          Object.defineProperty(t, e, {
            value: (n = Object.create(null)),
          }),
        n
      );
    }

    function ae(t, e, n) {
      if (t[e]) return t[e];
      const [s, r] = lt(n, {
        equals: !1,
        internal: !0,
      });
      return ((s.$ = r), (t[e] = s));
    }

    function xn(t, e) {
      const n = Reflect.getOwnPropertyDescriptor(t, e);
      return (
        !n ||
          n.get ||
          !n.configurable ||
          e === K ||
          e === J ||
          (delete n.value, delete n.writable, (n.get = () => t[K][e])),
        n
      );
    }

    function Et(t) {
      Te() && ae(Ae(t, J), At)();
    }

    function Sn(t) {
      return (Et(t), Reflect.ownKeys(t));
    }
    const Cn = {
      get(t, e, n) {
        if (e === ze) return t;
        if (e === K) return n;
        if (e === ot) return (Et(t), n);
        const s = Ae(t, J),
          r = s[e];
        let o = r ? r() : t[e];
        if (e === J || e === U || e === "__proto__") return o;
        if (!r) {
          const i = Object.getOwnPropertyDescriptor(t, e);
          Te() &&
            (typeof o != "function" || t.hasOwnProperty(e)) &&
            !(i && i.get) &&
            (o = ae(s, e, o)());
        }
        return we(o) ? bt(o) : o;
      },
      has(t, e) {
        return e === ze ||
          e === K ||
          e === ot ||
          e === J ||
          e === U ||
          e === "__proto__"
          ? !0
          : (Te() && ae(Ae(t, U), e)(), e in t);
      },
      set() {
        return !0;
      },
      deleteProperty() {
        return !0;
      },
      ownKeys: Sn,
      getOwnPropertyDescriptor: xn,
    };

    function be(t, e, n, s = !1) {
      if (!s && t[e] === n) return;
      const r = t[e],
        o = t.length;
      n === void 0
        ? (delete t[e], t[U] && t[U][e] && r !== void 0 && t[U][e].$())
        : ((t[e] = n), t[U] && t[U][e] && r === void 0 && t[U][e].$());
      let i = Ae(t, J),
        a;
      if (
        ((a = ae(i, e, r)) && a.$(() => n), Array.isArray(t) && t.length !== o)
      ) {
        for (let l = t.length; l < o; l++) (a = i[l]) && a.$();
        (a = ae(i, "length", o)) && a.$(t.length);
      }
      (a = i[At]) && a.$();
    }

    function vt(t, e) {
      const n = Object.keys(e);
      for (let s = 0; s < n.length; s += 1) {
        const r = n[s];
        be(t, r, e[r]);
      }
    }

    function Pn(t, e) {
      if (
        (typeof e == "function" && (e = e(t)), (e = ie(e)), Array.isArray(e))
      ) {
        if (t === e) return;
        let n = 0,
          s = e.length;
        for (; n < s; n++) {
          const r = e[n];
          t[n] !== r && be(t, n, r);
        }
        be(t, "length", s);
      } else vt(t, e);
    }

    function le(t, e, n = []) {
      let s,
        r = t;
      if (e.length > 1) {
        s = e.shift();
        const i = typeof s,
          a = Array.isArray(t);
        if (Array.isArray(s)) {
          for (let l = 0; l < s.length; l++) le(t, [s[l]].concat(e), n);
          return;
        } else if (a && i === "function") {
          for (let l = 0; l < t.length; l++)
            s(t[l], l) && le(t, [l].concat(e), n);
          return;
        } else if (a && i === "object") {
          const { from: l = 0, to: c = t.length - 1, by: m = 1 } = s;
          for (let f = l; f <= c; f += m) le(t, [f].concat(e), n);
          return;
        } else if (e.length > 1) {
          le(t[s], e, [s].concat(n));
          return;
        }
        ((r = t[s]), (n = [s].concat(n)));
      }
      let o = e[0];
      (typeof o == "function" && ((o = o(r, n)), o === r)) ||
        (s === void 0 && o == null) ||
        ((o = ie(o)),
        s === void 0 || (we(r) && we(o) && !Array.isArray(o))
          ? vt(r, o)
          : be(t, s, o));
    }

    function In(...[t, e]) {
      const n = ie(t || {}),
        s = Array.isArray(n),
        r = bt(n);

      function o(...i) {
        qt(() => {
          s && i.length === 1 ? Pn(n, i[0]) : le(n, i);
        });
      }
      return [r, o];
    }
    var Ee = {
        exports: {},
      },
      _t;

    function Mn() {
      if (_t) return Ee.exports;
      _t = 1;
      const t = (n) =>
          typeof crypto < "u" && typeof crypto.getRandomValues == "function"
            ? () => {
                const s = crypto.getRandomValues(new Uint8Array(1))[0];
                return (s >= n ? s % n : s).toString(n);
              }
            : () => Math.floor(Math.random() * n).toString(n),
        e = (n = 7, s = !1) =>
          Array.from(
            {
              length: n,
            },
            t(s ? 16 : 36),
          ).join("");
      return ((Ee.exports = e), (Ee.exports.default = e), Ee.exports);
    }
    var Tn = Mn();
    const ve = Ne(Tn);
    var On = () => `uid::${ve(7)}`,
      Rn = (t, e = ["endpointName", "fingerprint"]) =>
        typeof t == "object" && t !== null && e.every((n) => n in t),
      kn = (t) => {
        if (!Rn(t)) throw new TypeError("Invalid connection args");
        return JSON.stringify(t);
      },
      Nn = () => {
        let t = [];
        return {
          add: (...e) => {
            t = [...t, ...e];
          },
          remove: (e) => {
            t =
              typeof e == "string"
                ? t.filter((n) => n.message.transactionId !== e)
                : t.filter((n) => !e.includes(n));
          },
          entries: () => t,
        };
      },
      We = class {
        static toBackground(t, e) {
          return t.postMessage(e);
        }
        static toExtensionContext(t, e) {
          return t.postMessage(e);
        }
      },
      _e = {
        exports: {},
      },
      Ln = _e.exports,
      xt;

    function Dn() {
      return (
        xt ||
          ((xt = 1),
          (function (t, e) {
            (function (n, s) {
              s(t);
            })(
              typeof globalThis < "u"
                ? globalThis
                : typeof self < "u"
                  ? self
                  : Ln,
              function (n) {
                if (
                  typeof globalThis != "object" ||
                  typeof chrome != "object" ||
                  !chrome ||
                  !chrome.runtime ||
                  !chrome.runtime.id
                )
                  throw new Error(
                    "This script should only be loaded in a browser extension.",
                  );
                if (
                  typeof globalThis.browser > "u" ||
                  Object.getPrototypeOf(globalThis.browser) !== Object.prototype
                ) {
                  const s =
                      "The message port closed before a response was received.",
                    r =
                      "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)",
                    o = (i) => {
                      const a = {
                        alarms: {
                          clear: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          clearAll: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          get: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          getAll: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                        },
                        bookmarks: {
                          create: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          get: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getChildren: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getRecent: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getSubTree: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getTree: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          move: {
                            minArgs: 2,
                            maxArgs: 2,
                          },
                          remove: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removeTree: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          search: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          update: {
                            minArgs: 2,
                            maxArgs: 2,
                          },
                        },
                        browserAction: {
                          disable: {
                            minArgs: 0,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                          enable: {
                            minArgs: 0,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                          getBadgeBackgroundColor: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getBadgeText: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getPopup: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getTitle: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          openPopup: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          setBadgeBackgroundColor: {
                            minArgs: 1,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                          setBadgeText: {
                            minArgs: 1,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                          setIcon: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          setPopup: {
                            minArgs: 1,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                          setTitle: {
                            minArgs: 1,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                        },
                        browsingData: {
                          remove: {
                            minArgs: 2,
                            maxArgs: 2,
                          },
                          removeCache: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removeCookies: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removeDownloads: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removeFormData: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removeHistory: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removeLocalStorage: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removePasswords: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removePluginData: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          settings: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                        },
                        commands: {
                          getAll: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                        },
                        contextMenus: {
                          remove: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removeAll: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          update: {
                            minArgs: 2,
                            maxArgs: 2,
                          },
                        },
                        cookies: {
                          get: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getAll: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getAllCookieStores: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          remove: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          set: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                        },
                        devtools: {
                          inspectedWindow: {
                            eval: {
                              minArgs: 1,
                              maxArgs: 2,
                              singleCallbackArg: !1,
                            },
                          },
                          panels: {
                            create: {
                              minArgs: 3,
                              maxArgs: 3,
                              singleCallbackArg: !0,
                            },
                            elements: {
                              createSidebarPane: {
                                minArgs: 1,
                                maxArgs: 1,
                              },
                            },
                          },
                        },
                        downloads: {
                          cancel: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          download: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          erase: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getFileIcon: {
                            minArgs: 1,
                            maxArgs: 2,
                          },
                          open: {
                            minArgs: 1,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                          pause: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removeFile: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          resume: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          search: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          show: {
                            minArgs: 1,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                        },
                        extension: {
                          isAllowedFileSchemeAccess: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          isAllowedIncognitoAccess: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                        },
                        history: {
                          addUrl: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          deleteAll: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          deleteRange: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          deleteUrl: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getVisits: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          search: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                        },
                        i18n: {
                          detectLanguage: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getAcceptLanguages: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                        },
                        identity: {
                          launchWebAuthFlow: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                        },
                        idle: {
                          queryState: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                        },
                        management: {
                          get: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getAll: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          getSelf: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          setEnabled: {
                            minArgs: 2,
                            maxArgs: 2,
                          },
                          uninstallSelf: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                        },
                        notifications: {
                          clear: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          create: {
                            minArgs: 1,
                            maxArgs: 2,
                          },
                          getAll: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          getPermissionLevel: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          update: {
                            minArgs: 2,
                            maxArgs: 2,
                          },
                        },
                        pageAction: {
                          getPopup: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getTitle: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          hide: {
                            minArgs: 1,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                          setIcon: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          setPopup: {
                            minArgs: 1,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                          setTitle: {
                            minArgs: 1,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                          show: {
                            minArgs: 1,
                            maxArgs: 1,
                            fallbackToNoCallback: !0,
                          },
                        },
                        permissions: {
                          contains: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getAll: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          remove: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          request: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                        },
                        runtime: {
                          getBackgroundPage: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          getPlatformInfo: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          openOptionsPage: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          requestUpdateCheck: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          sendMessage: {
                            minArgs: 1,
                            maxArgs: 3,
                          },
                          sendNativeMessage: {
                            minArgs: 2,
                            maxArgs: 2,
                          },
                          setUninstallURL: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                        },
                        sessions: {
                          getDevices: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          getRecentlyClosed: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          restore: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                        },
                        storage: {
                          local: {
                            clear: {
                              minArgs: 0,
                              maxArgs: 0,
                            },
                            get: {
                              minArgs: 0,
                              maxArgs: 1,
                            },
                            getBytesInUse: {
                              minArgs: 0,
                              maxArgs: 1,
                            },
                            remove: {
                              minArgs: 1,
                              maxArgs: 1,
                            },
                            set: {
                              minArgs: 1,
                              maxArgs: 1,
                            },
                          },
                          managed: {
                            get: {
                              minArgs: 0,
                              maxArgs: 1,
                            },
                            getBytesInUse: {
                              minArgs: 0,
                              maxArgs: 1,
                            },
                          },
                          sync: {
                            clear: {
                              minArgs: 0,
                              maxArgs: 0,
                            },
                            get: {
                              minArgs: 0,
                              maxArgs: 1,
                            },
                            getBytesInUse: {
                              minArgs: 0,
                              maxArgs: 1,
                            },
                            remove: {
                              minArgs: 1,
                              maxArgs: 1,
                            },
                            set: {
                              minArgs: 1,
                              maxArgs: 1,
                            },
                          },
                        },
                        tabs: {
                          captureVisibleTab: {
                            minArgs: 0,
                            maxArgs: 2,
                          },
                          create: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          detectLanguage: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          discard: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          duplicate: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          executeScript: {
                            minArgs: 1,
                            maxArgs: 2,
                          },
                          get: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getCurrent: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                          getZoom: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          getZoomSettings: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          goBack: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          goForward: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          highlight: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          insertCSS: {
                            minArgs: 1,
                            maxArgs: 2,
                          },
                          move: {
                            minArgs: 2,
                            maxArgs: 2,
                          },
                          query: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          reload: {
                            minArgs: 0,
                            maxArgs: 2,
                          },
                          remove: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          removeCSS: {
                            minArgs: 1,
                            maxArgs: 2,
                          },
                          sendMessage: {
                            minArgs: 2,
                            maxArgs: 3,
                          },
                          setZoom: {
                            minArgs: 1,
                            maxArgs: 2,
                          },
                          setZoomSettings: {
                            minArgs: 1,
                            maxArgs: 2,
                          },
                          update: {
                            minArgs: 1,
                            maxArgs: 2,
                          },
                        },
                        topSites: {
                          get: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                        },
                        webNavigation: {
                          getAllFrames: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          getFrame: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                        },
                        webRequest: {
                          handlerBehaviorChanged: {
                            minArgs: 0,
                            maxArgs: 0,
                          },
                        },
                        windows: {
                          create: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          get: {
                            minArgs: 1,
                            maxArgs: 2,
                          },
                          getAll: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          getCurrent: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          getLastFocused: {
                            minArgs: 0,
                            maxArgs: 1,
                          },
                          remove: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          update: {
                            minArgs: 2,
                            maxArgs: 2,
                          },
                        },
                      };
                      if (Object.keys(a).length === 0)
                        throw new Error(
                          "api-metadata.json has not been included in browser-polyfill",
                        );
                      class l extends WeakMap {
                        constructor(g, u = void 0) {
                          (super(u), (this.createItem = g));
                        }
                        get(g) {
                          return (
                            this.has(g) || this.set(g, this.createItem(g)),
                            super.get(g)
                          );
                        }
                      }
                      const c = (y) =>
                          y &&
                          typeof y == "object" &&
                          typeof y.then == "function",
                        m =
                          (y, g) =>
                          (...u) => {
                            i.runtime.lastError
                              ? y.reject(new Error(i.runtime.lastError.message))
                              : g.singleCallbackArg ||
                                  (u.length <= 1 && g.singleCallbackArg !== !1)
                                ? y.resolve(u[0])
                                : y.resolve(u);
                          },
                        f = (y) => (y == 1 ? "argument" : "arguments"),
                        h = (y, g) =>
                          function (E, ...M) {
                            if (M.length < g.minArgs)
                              throw new Error(
                                `Expected at least ${g.minArgs} ${f(g.minArgs)} for ${y}(), got ${M.length}`,
                              );
                            if (M.length > g.maxArgs)
                              throw new Error(
                                `Expected at most ${g.maxArgs} ${f(g.maxArgs)} for ${y}(), got ${M.length}`,
                              );
                            return new Promise((k, L) => {
                              if (g.fallbackToNoCallback)
                                try {
                                  E[y](
                                    ...M,
                                    m(
                                      {
                                        resolve: k,
                                        reject: L,
                                      },
                                      g,
                                    ),
                                  );
                                } catch (A) {
                                  (console.warn(
                                    `${y} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `,
                                    A,
                                  ),
                                    E[y](...M),
                                    (g.fallbackToNoCallback = !1),
                                    (g.noCallback = !0),
                                    k());
                                }
                              else
                                g.noCallback
                                  ? (E[y](...M), k())
                                  : E[y](
                                      ...M,
                                      m(
                                        {
                                          resolve: k,
                                          reject: L,
                                        },
                                        g,
                                      ),
                                    );
                            });
                          },
                        d = (y, g, u) =>
                          new Proxy(g, {
                            apply(E, M, k) {
                              return u.call(M, y, ...k);
                            },
                          });
                      let p = Function.call.bind(
                        Object.prototype.hasOwnProperty,
                      );
                      const w = (y, g = {}, u = {}) => {
                          let E = Object.create(null),
                            M = {
                              has(L, A) {
                                return A in y || A in E;
                              },
                              get(L, A, D) {
                                if (A in E) return E[A];
                                if (!(A in y)) return;
                                let P = y[A];
                                if (typeof P == "function")
                                  if (typeof g[A] == "function")
                                    P = d(y, y[A], g[A]);
                                  else if (p(u, A)) {
                                    let ee = h(A, u[A]);
                                    P = d(y, y[A], ee);
                                  } else P = P.bind(y);
                                else if (
                                  typeof P == "object" &&
                                  P !== null &&
                                  (p(g, A) || p(u, A))
                                )
                                  P = w(P, g[A], u[A]);
                                else if (p(u, "*")) P = w(P, g[A], u["*"]);
                                else
                                  return (
                                    Object.defineProperty(E, A, {
                                      configurable: !0,
                                      enumerable: !0,
                                      get() {
                                        return y[A];
                                      },
                                      set(ee) {
                                        y[A] = ee;
                                      },
                                    }),
                                    P
                                  );
                                return ((E[A] = P), P);
                              },
                              set(L, A, D, P) {
                                return (A in E ? (E[A] = D) : (y[A] = D), !0);
                              },
                              defineProperty(L, A, D) {
                                return Reflect.defineProperty(E, A, D);
                              },
                              deleteProperty(L, A) {
                                return Reflect.deleteProperty(E, A);
                              },
                            },
                            k = Object.create(y);
                          return new Proxy(k, M);
                        },
                        b = (y) => ({
                          addListener(g, u, ...E) {
                            g.addListener(y.get(u), ...E);
                          },
                          hasListener(g, u) {
                            return g.hasListener(y.get(u));
                          },
                          removeListener(g, u) {
                            g.removeListener(y.get(u));
                          },
                        }),
                        x = new l((y) =>
                          typeof y != "function"
                            ? y
                            : function (u) {
                                const E = w(
                                  u,
                                  {},
                                  {
                                    getContent: {
                                      minArgs: 0,
                                      maxArgs: 0,
                                    },
                                  },
                                );
                                y(E);
                              },
                        );
                      let S = !1;
                      const I = new l((y) =>
                          typeof y != "function"
                            ? y
                            : function (u, E, M) {
                                let k = !1,
                                  L,
                                  A = new Promise((ue) => {
                                    L = function (j) {
                                      (S ||
                                        (console.warn(r, new Error().stack),
                                        (S = !0)),
                                        (k = !0),
                                        ue(j));
                                    };
                                  }),
                                  D;
                                try {
                                  D = y(u, E, L);
                                } catch (ue) {
                                  D = Promise.reject(ue);
                                }
                                const P = D !== !0 && c(D);
                                if (D !== !0 && !P && !k) return !1;
                                const ee = (ue) => {
                                  ue.then(
                                    (j) => {
                                      M(j);
                                    },
                                    (j) => {
                                      let rt;
                                      (j &&
                                      (j instanceof Error ||
                                        typeof j.message == "string")
                                        ? (rt = j.message)
                                        : (rt = "An unexpected error occurred"),
                                        M({
                                          __mozWebExtensionPolyfillReject__: !0,
                                          message: rt,
                                        }));
                                    },
                                  ).catch((j) => {
                                    console.error(
                                      "Failed to send onMessage rejected reply",
                                      j,
                                    );
                                  });
                                };
                                return (ee(P ? D : A), !0);
                              },
                        ),
                        O = ({ reject: y, resolve: g }, u) => {
                          i.runtime.lastError
                            ? i.runtime.lastError.message === s
                              ? g()
                              : y(new Error(i.runtime.lastError.message))
                            : u && u.__mozWebExtensionPolyfillReject__
                              ? y(new Error(u.message))
                              : g(u);
                        },
                        N = (y, g, u, ...E) => {
                          if (E.length < g.minArgs)
                            throw new Error(
                              `Expected at least ${g.minArgs} ${f(g.minArgs)} for ${y}(), got ${E.length}`,
                            );
                          if (E.length > g.maxArgs)
                            throw new Error(
                              `Expected at most ${g.maxArgs} ${f(g.maxArgs)} for ${y}(), got ${E.length}`,
                            );
                          return new Promise((M, k) => {
                            const L = O.bind(null, {
                              resolve: M,
                              reject: k,
                            });
                            (E.push(L), u.sendMessage(...E));
                          });
                        },
                        Z = {
                          devtools: {
                            network: {
                              onRequestFinished: b(x),
                            },
                          },
                          runtime: {
                            onMessage: b(I),
                            onMessageExternal: b(I),
                            sendMessage: N.bind(null, "sendMessage", {
                              minArgs: 1,
                              maxArgs: 3,
                            }),
                          },
                          tabs: {
                            sendMessage: N.bind(null, "sendMessage", {
                              minArgs: 2,
                              maxArgs: 3,
                            }),
                          },
                        },
                        z = {
                          clear: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          get: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                          set: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                        };
                      return (
                        (a.privacy = {
                          network: {
                            "*": z,
                          },
                          services: {
                            "*": z,
                          },
                          websites: {
                            "*": z,
                          },
                        }),
                        w(i, Z, a)
                      );
                    };
                  n.exports = o(chrome);
                } else n.exports = globalThis.browser;
              },
            );
          })(_e)),
        _e.exports
      );
    }
    var Fn = Dn();
    const $n = Ne(Fn);
    var jn = (t = "") => {
        const e = On();
        let n,
          s = [];
        const r = Nn(),
          o = new Set(),
          i = new Set(),
          a = (c, m) => {
            switch (c.status) {
              case "undeliverable":
                s.some((f) => f.message.messageID === c.message.messageID) ||
                  (s = [
                    ...s,
                    {
                      message: c.message,
                      resolvedDestination: c.resolvedDestination,
                    },
                  ]);
                return;
              case "deliverable":
                s = s.reduce(
                  (f, h) =>
                    h.resolvedDestination === c.deliverableTo
                      ? (We.toBackground(m, {
                          type: "deliver",
                          message: h.message,
                        }),
                        f)
                      : [...f, h],
                  [],
                );
                return;
              case "delivered":
                c.receipt.message.messageType === "message" && r.add(c.receipt);
                return;
              case "incoming":
                (c.message.messageType === "reply" &&
                  r.remove(c.message.messageID),
                  o.forEach((f) => f(c.message, m)));
                return;
              case "terminated": {
                const f = r.entries().filter((h) => c.fingerprint === h.to);
                (r.remove(f),
                  f.forEach(({ message: h }) => i.forEach((d) => d(h))));
              }
            }
          },
          l = () => {
            ((n = $n.runtime.connect({
              name: kn({
                endpointName: t,
                fingerprint: e,
              }),
            })),
              n.onMessage.addListener(a),
              n.onDisconnect.addListener(l),
              We.toBackground(n, {
                type: "sync",
                pendingResponses: r.entries(),
                pendingDeliveries: [
                  ...new Set(s.map(({ resolvedDestination: c }) => c)),
                ],
              }));
          };
        return (
          l(),
          {
            onFailure(c) {
              i.add(c);
            },
            onMessage(c) {
              o.add(c);
            },
            postMessage(c) {
              We.toBackground(n, {
                type: "deliver",
                message: c,
              });
            },
          }
        );
      },
      Ke,
      Bn = (t, e, n) =>
        Ke ??
        (Ke = new Promise((s) => {
          const r = (i) => {
              const {
                data: { cmd: a, scope: l, context: c },
                ports: m,
              } = i;
              if (a === "webext-port-offer" && l === e && c !== t)
                return (
                  window.removeEventListener("message", r),
                  (m[0].onmessage = n),
                  m[0].postMessage("port-accepted"),
                  s(m[0])
                );
            },
            o = () => {
              const i = new MessageChannel();
              ((i.port1.onmessage = (a) => {
                if (a.data === "port-accepted")
                  return (window.removeEventListener("message", r), s(i.port1));
                n?.(a);
              }),
                window.postMessage(
                  {
                    cmd: "webext-port-offer",
                    scope: e,
                    context: t,
                  },
                  "*",
                  [i.port2],
                ));
            };
          (window.addEventListener("message", r), o());
        })),
      Un = (t) => {
        let e,
          n = !1,
          s,
          r;
        return {
          enable: () => (n = !0),
          onMessage: (o) => (s = o),
          postMessage: async (o) => {
            if (!n)
              throw new Error("Communication with window has not been allowed");
            return (zn(e), (await r).postMessage(o));
          },
          setNamespace: (o) => {
            if (e) throw new Error("Namespace once set cannot be changed");
            ((e = o), (r = Bn(t, o, ({ data: i }) => s?.(i))));
          },
        };
      };

    function zn(t) {
      if (typeof t != "string" || t.trim().length === 0)
        throw new Error(
          `webext-bridge uses window.postMessage to talk with other "window"(s) for message routingwhich is global/conflicting operation in case there are other scripts using webext-bridge. Call Bridge#setNamespace(nsps) to isolate your app. Example: setNamespace('com.facebook.react-devtools'). Make sure to use same namespace across all your scripts whereever window.postMessage is likely to be used\``,
        );
    }
    var Wn = Object.defineProperty,
      Kn = Object.defineProperties,
      qn = Object.getOwnPropertyDescriptors,
      St = Object.getOwnPropertySymbols,
      Gn = Object.prototype.hasOwnProperty,
      Zn = Object.prototype.propertyIsEnumerable,
      Ct = (t, e, n) =>
        e in t
          ? Wn(t, e, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: n,
            })
          : (t[e] = n),
      Pt = (t, e) => {
        for (var n in e || (e = {})) Gn.call(e, n) && Ct(t, n, e[n]);
        if (St) for (var n of St(e)) Zn.call(e, n) && Ct(t, n, e[n]);
        return t;
      },
      It = (t, e) => Kn(t, qn(e)),
      Vn =
        /^((?:background$)|devtools|popup|options|content-script|window)(?:@(\d+)(?:\.(\d+))?)?$/,
      Mt = (t) => {
        const [, e, n, s] = t.match(Vn) || [];
        return {
          context: e,
          tabId: +n,
          frameId: s ? +s : void 0,
        };
      };
    const Hn = [
        {
          property: "name",
          enumerable: !1,
        },
        {
          property: "message",
          enumerable: !1,
        },
        {
          property: "stack",
          enumerable: !1,
        },
        {
          property: "code",
          enumerable: !0,
        },
      ],
      qe = Symbol(".toJSON was called"),
      Jn = (t) => {
        t[qe] = !0;
        const e = t.toJSON();
        return (delete t[qe], e);
      },
      Tt = ({
        from: t,
        seen: e,
        to_: n,
        forceEnumerable: s,
        maxDepth: r,
        depth: o,
      }) => {
        const i = n || (Array.isArray(t) ? [] : {});
        if ((e.push(t), o >= r)) return i;
        if (typeof t.toJSON == "function" && t[qe] !== !0) return Jn(t);
        for (const [a, l] of Object.entries(t)) {
          if (typeof Buffer == "function" && Buffer.isBuffer(l)) {
            i[a] = "[object Buffer]";
            continue;
          }
          if (
            l !== null &&
            typeof l == "object" &&
            typeof l.pipe == "function"
          ) {
            i[a] = "[object Stream]";
            continue;
          }
          if (typeof l != "function") {
            if (!l || typeof l != "object") {
              i[a] = l;
              continue;
            }
            if (!e.includes(t[a])) {
              (o++,
                (i[a] = Tt({
                  from: t[a],
                  seen: [...e],
                  forceEnumerable: s,
                  maxDepth: r,
                  depth: o,
                })));
              continue;
            }
            i[a] = "[Circular]";
          }
        }
        for (const { property: a, enumerable: l } of Hn)
          typeof t[a] == "string" &&
            Object.defineProperty(i, a, {
              value: t[a],
              enumerable: !0,
              configurable: !0,
              writable: !0,
            });
        return i;
      };

    function Xn(t, e = {}) {
      const { maxDepth: n = Number.POSITIVE_INFINITY } = e;
      return typeof t == "object" && t !== null
        ? Tt({
            from: t,
            seen: [],
            forceEnumerable: !0,
            maxDepth: n,
            depth: 0,
          })
        : typeof t == "function"
          ? `[Function: ${t.name || "anonymous"}]`
          : t;
    }
    let Ot = () => ({
      events: {},
      emit(t, ...e) {
        (this.events[t] || []).forEach((n) => n(...e));
      },
      on(t, e) {
        return (
          (this.events[t] = this.events[t] || []).push(e),
          () => (this.events[t] = (this.events[t] || []).filter((n) => n !== e))
        );
      },
    });
    var Yn = (t, e, n) => {
        const s = ve(),
          r = new Map(),
          o = new Map(),
          i = (a) => {
            if (
              a.destination.context === t &&
              !a.destination.frameId &&
              !a.destination.tabId
            ) {
              const { transactionId: l, messageID: c, messageType: m } = a,
                f = () => {
                  const d = r.get(l);
                  if (d) {
                    const { err: p, data: w } = a;
                    if (p) {
                      const b = p,
                        x = self[b.name],
                        S = new (typeof x == "function" ? x : Error)(b.message);
                      for (const I in b) S[I] = b[I];
                      d.reject(S);
                    } else d.resolve(w);
                    r.delete(l);
                  }
                },
                h = async () => {
                  let d,
                    p,
                    w = !1;
                  try {
                    const b = o.get(c);
                    if (typeof b == "function")
                      d = await b({
                        sender: a.origin,
                        id: c,
                        data: a.data,
                        timestamp: a.timestamp,
                      });
                    else
                      throw (
                        (w = !0),
                        new Error(
                          `[webext-bridge] No handler registered in '${t}' to accept messages with id '${c}'`,
                        )
                      );
                  } catch (b) {
                    p = b;
                  } finally {
                    if (
                      (p && (a.err = Xn(p)),
                      i(
                        It(Pt({}, a), {
                          messageType: "reply",
                          data: d,
                          origin: {
                            context: t,
                            tabId: null,
                          },
                          destination: a.origin,
                          hops: [],
                        }),
                      ),
                      p && !w)
                    )
                      throw d;
                  }
                };
              switch (m) {
                case "reply":
                  return f();
                case "message":
                  return h();
              }
            }
            return (a.hops.push(`${t}::${s}`), e(a));
          };
        return {
          handleMessage: i,
          endTransaction: (a) => {
            const l = r.get(a);
            (l?.reject("Transaction was ended before it could complete"),
              r.delete(a));
          },
          sendMessage: (a, l, c = "background") => {
            const m = typeof c == "string" ? Mt(c) : c,
              f = "Bridge#sendMessage ->";
            if (!m.context)
              throw new TypeError(
                `${f} Destination must be any one of known destinations`,
              );
            return new Promise((h, d) => {
              const p = {
                messageID: a,
                data: l,
                destination: m,
                messageType: "message",
                transactionId: ve(),
                origin: {
                  context: t,
                  tabId: null,
                },
                hops: [],
                timestamp: Date.now(),
              };
              r.set(p.transactionId, {
                resolve: h,
                reject: d,
              });
              try {
                i(p);
              } catch (w) {
                (r.delete(p.transactionId), d(w));
              }
            });
          },
          onMessage: (a, l) => (o.set(a, l), () => o.delete(a)),
        };
      },
      X = class {
        constructor(t, e) {
          ((this.endpointRuntime = t),
            (this.streamInfo = e),
            (this.emitter = Ot()),
            (this.isClosed = !1),
            (this.handleStreamClose = () => {
              this.isClosed ||
                ((this.isClosed = !0),
                this.emitter.emit("closed", !0),
                (this.emitter.events = {}));
            }),
            X.initDone ||
              (t.onMessage("__crx_bridge_stream_transfer__", (n) => {
                const { streamId: s, streamTransfer: r, action: o } = n.data,
                  i = X.openStreams.get(s);
                i &&
                  !i.isClosed &&
                  (o === "transfer" && i.emitter.emit("message", r),
                  o === "close" &&
                    (X.openStreams.delete(s), i.handleStreamClose()));
              }),
              (X.initDone = !0)),
            X.openStreams.set(this.streamInfo.streamId, this));
        }
        get info() {
          return this.streamInfo;
        }
        send(t) {
          if (this.isClosed)
            throw new Error(
              "Attempting to send a message over closed stream. Use stream.onClose(<callback>) to keep an eye on stream status",
            );
          this.endpointRuntime.sendMessage(
            "__crx_bridge_stream_transfer__",
            {
              streamId: this.streamInfo.streamId,
              streamTransfer: t,
              action: "transfer",
            },
            this.streamInfo.endpoint,
          );
        }
        close(t) {
          (t && this.send(t),
            this.handleStreamClose(),
            this.endpointRuntime.sendMessage(
              "__crx_bridge_stream_transfer__",
              {
                streamId: this.streamInfo.streamId,
                streamTransfer: null,
                action: "close",
              },
              this.streamInfo.endpoint,
            ));
        }
        onMessage(t) {
          return this.getDisposable("message", t);
        }
        onClose(t) {
          return this.getDisposable("closed", t);
        }
        getDisposable(t, e) {
          const n = this.emitter.on(t, e);
          return Object.assign(n, {
            dispose: n,
            close: n,
          });
        }
      },
      xe = X;
    ((xe.initDone = !1), (xe.openStreams = new Map()));
    var Qn = (t) => {
        const e = new Map(),
          n = new Map(),
          s = Ot();
        t.onMessage(
          "__crx_bridge_stream_open__",
          (i) =>
            new Promise((a) => {
              const { sender: l, data: c } = i,
                { channel: m } = c;
              let f = !1,
                h = () => {};
              const d = () => {
                const p = n.get(m);
                typeof p == "function"
                  ? (p(
                      new xe(
                        t,
                        It(Pt({}, c), {
                          endpoint: l,
                        }),
                      ),
                    ),
                    f && h(),
                    a(!0))
                  : f ||
                    ((f = !0), (h = s.on("did-change-stream-callbacks", d)));
              };
              d();
            }),
        );
        async function r(i, a) {
          if (e.has(i))
            throw new Error(
              "webext-bridge: A Stream is already open at this channel",
            );
          const l = typeof a == "string" ? Mt(a) : a,
            c = {
              streamId: ve(),
              channel: i,
              endpoint: l,
            },
            m = new xe(t, c);
          return (
            m.onClose(() => e.delete(i)),
            await t.sendMessage("__crx_bridge_stream_open__", c, l),
            e.set(i, m),
            m
          );
        }

        function o(i, a) {
          if (n.has(i))
            throw new Error(
              "webext-bridge: This channel has already been claimed. Stream allows only one-on-one communication",
            );
          (n.set(i, a), s.emit("did-change-stream-callbacks"));
        }
        return {
          openStream: r,
          onOpenStreamChannel: o,
        };
      },
      Ge = Un("content-script"),
      Ze = jn(),
      ce = Yn("content-script", (t) => {
        t.destination.context === "window"
          ? Ge.postMessage(t)
          : Ze.postMessage(t);
      });
    (Ge.onMessage((t) => {
      ((t.origin = {
        context: "window",
        tabId: null,
      }),
        ce.handleMessage(t));
    }),
      Ze.onMessage(ce.handleMessage),
      Ze.onFailure((t) => {
        if (t.origin.context === "window") {
          Ge.postMessage({
            type: "error",
            transactionID: t.transactionId,
          });
          return;
        }
        ce.endTransaction(t.transactionId);
      }));
    var { sendMessage: Y, onMessage: $ } = ce;
    Qn(ce);
    const Rt = (t) => new Promise((e) => setTimeout(e, t));
    async function es(t, e = 100, n = 3e3) {
      try {
        const s = t.innerHeight,
          r = Math.floor(Math.random() * 7) + 3;
        let o = 0;
        for (let i = 0; i < r; i++) {
          ((o += Math.floor(Math.random() * s * 2)),
            t.scrollTo({
              top: o,
              behavior: "smooth",
            }));
          const a = Math.floor(Math.random() * n) + e;
          await Rt(a);
        }
      } catch (s) {
        console.error("[Content Script] Error during random scroll:", s);
      }
    }
    async function ts(t, e = 100, n = 5e3) {
      try {
        const s = t.document.querySelector(
            "div.overflow-y-scroll.overflow-x-visible",
          ),
          r = s || t,
          o = s ? s.scrollHeight : t.document.body.scrollHeight,
          i = s ? s.clientHeight : t.innerHeight;
        if (o <= i) {
          console.log("[Content Script] Page is not scrollable.");
          return;
        }
        const a = Math.floor(Math.random() * 5) + 3;
        for (let l = 0; l < a; l++) {
          const c = Math.random() * (o - i);
          r.scrollTo({
            top: c,
            behavior: "smooth",
          });
          const m = Math.floor(Math.random() * n) + e;
          await Rt(m);
        }
      } catch (s) {
        console.error("[Content Script] Error during random scroll:", s);
      }
    }
    var ns = q("<h4>Email: "),
      ss = q("<p><strong>"),
      rs = q(
        '<div class=current-task><p>­ƒôØ Next URL:</p><a rel="noopener noreferrer">',
      ),
      os = q(
        "<div class=hw-top><h4>Username: </h4><p>Status:  <span></span></p><details><summary>­ƒôè Data Statistics</summary><div>",
      ),
      is = q("<h4>Start scraping process at extension popup"),
      as = q("<p>­ƒô¡ No active task"),
      ls = q("<div>");
    const cs = (t) =>
      (() => {
        var e = os(),
          n = e.firstChild;
        n.firstChild;
        var s = n.nextSibling,
          r = s.firstChild,
          o = r.nextSibling,
          i = s.nextSibling,
          a = i.firstChild,
          l = a.nextSibling;
        return (
          e.style.setProperty("min-height", "250px"),
          e.style.setProperty("min-width", "250px"),
          e.style.setProperty("max-width", "300px"),
          e.style.setProperty("background-color", "#EE4D2D"),
          e.style.setProperty("color", "white"),
          e.style.setProperty("padding", "12px"),
          e.style.setProperty(
            "font-family",
            "system-ui, -apple-system, sans-serif",
          ),
          e.style.setProperty("word-wrap", "break-word"),
          e.style.setProperty("overflow-wrap", "break-word"),
          e.style.setProperty("opacity", "0.8"),
          e.style.setProperty("transition", "opacity 0.2s ease"),
          F(n, () => t.state.username, null),
          F(
            e,
            Re(ke, {
              get when() {
                return t.state.email && t.state.email !== "";
              },
              get fallback() {
                return is();
              },
              get children() {
                var c = ns();
                return (c.firstChild, F(c, () => t.state.email, null), c);
              },
            }),
            s,
          ),
          o.style.setProperty("font-weight", "bold"),
          F(o, () => (t.state.isFetching ? "ÔùÅ running" : "Ôùï idle")),
          F(
            e,
            Re(ke, {
              get when() {
                return t.state.message;
              },
              get children() {
                var c = ss(),
                  m = c.firstChild;
                return (F(m, () => t.state.message), c);
              },
            }),
            i,
          ),
          F(
            e,
            Re(ke, {
              get when() {
                return t.state.currentTask;
              },
              get fallback() {
                return as();
              },
              get children() {
                var c = rs(),
                  m = c.firstChild,
                  f = m.nextSibling;
                return (
                  c.style.setProperty("word-break", "break-all"),
                  c.style.setProperty("background-color", "rgba(0,0,0,0.2)"),
                  c.style.setProperty("padding", "8px"),
                  c.style.setProperty("border-radius", "4px"),
                  m.style.setProperty("font-weight", "bold"),
                  f.style.setProperty("font-size", "0.9em"),
                  F(f, () => t.state.currentTask),
                  ne(() => _n(f, "href", t.state.currentTask)),
                  c
                );
              },
            }),
            i,
          ),
          a.style.setProperty("cursor", "pointer"),
          a.style.setProperty("padding", "4px 0"),
          a.style.setProperty("font-weight", "bold"),
          l.style.setProperty("background-color", "rgba(0,0,0,0.2)"),
          l.style.setProperty("padding", "8px"),
          l.style.setProperty("border-radius", "4px"),
          l.style.setProperty("margin-top", "4px"),
          l.style.setProperty("font-family", "monospace"),
          F(l, () =>
            JSON.stringify(t.state.crawlStats)
              ?.replace(
                /[,\{\}]/g,
                `
`,
              )
              .replace(/["]/g, "")
              .replace(/:1/g, ": Ô£à")
              .split(
                `
`,
              )
              .filter((c) => c.trim())
              .map((c) =>
                (() => {
                  var m = ls();
                  return (F(m, c), m);
                })(),
              ),
          ),
          ne((c) =>
            (c = t.state.isFetching ? "#4CAF50" : "#FFA726") != null
              ? o.style.setProperty("color", c)
              : o.style.removeProperty("color"),
          ),
          e
        );
      })();

    function us(t) {
      return new Promise((e) => {
        if (document.querySelector(t)) return e(document.querySelector(t));
        const n = new MutationObserver((s) => {
          document.querySelector(t) &&
            (n.disconnect(), e(document.querySelector(t)));
        });
        n.observe(document.body, {
          childList: !0,
          subtree: !0,
        });
      });
    }
    const Ve = (t, e) => e.some((n) => t instanceof n);
    let kt, Nt;

    function ds() {
      return (
        kt ||
        (kt = [
          IDBDatabase,
          IDBObjectStore,
          IDBIndex,
          IDBCursor,
          IDBTransaction,
        ])
      );
    }

    function ms() {
      return (
        Nt ||
        (Nt = [
          IDBCursor.prototype.advance,
          IDBCursor.prototype.continue,
          IDBCursor.prototype.continuePrimaryKey,
        ])
      );
    }
    const He = new WeakMap(),
      Je = new WeakMap(),
      Se = new WeakMap();

    function gs(t) {
      const e = new Promise((n, s) => {
        const r = () => {
            (t.removeEventListener("success", o),
              t.removeEventListener("error", i));
          },
          o = () => {
            (n(G(t.result)), r());
          },
          i = () => {
            (s(t.error), r());
          };
        (t.addEventListener("success", o), t.addEventListener("error", i));
      });
      return (Se.set(e, t), e);
    }

    function fs(t) {
      if (He.has(t)) return;
      const e = new Promise((n, s) => {
        const r = () => {
            (t.removeEventListener("complete", o),
              t.removeEventListener("error", i),
              t.removeEventListener("abort", i));
          },
          o = () => {
            (n(), r());
          },
          i = () => {
            (s(t.error || new DOMException("AbortError", "AbortError")), r());
          };
        (t.addEventListener("complete", o),
          t.addEventListener("error", i),
          t.addEventListener("abort", i));
      });
      He.set(t, e);
    }
    let Xe = {
      get(t, e, n) {
        if (t instanceof IDBTransaction) {
          if (e === "done") return He.get(t);
          if (e === "store")
            return n.objectStoreNames[1]
              ? void 0
              : n.objectStore(n.objectStoreNames[0]);
        }
        return G(t[e]);
      },
      set(t, e, n) {
        return ((t[e] = n), !0);
      },
      has(t, e) {
        return t instanceof IDBTransaction && (e === "done" || e === "store")
          ? !0
          : e in t;
      },
    };

    function Lt(t) {
      Xe = t(Xe);
    }

    function hs(t) {
      return ms().includes(t)
        ? function (...e) {
            return (t.apply(Ye(this), e), G(this.request));
          }
        : function (...e) {
            return G(t.apply(Ye(this), e));
          };
    }

    function ps(t) {
      return typeof t == "function"
        ? hs(t)
        : (t instanceof IDBTransaction && fs(t),
          Ve(t, ds()) ? new Proxy(t, Xe) : t);
    }

    function G(t) {
      if (t instanceof IDBRequest) return gs(t);
      if (Je.has(t)) return Je.get(t);
      const e = ps(t);
      return (e !== t && (Je.set(t, e), Se.set(e, t)), e);
    }
    const Ye = (t) => Se.get(t);

    function ys(
      t,
      e,
      { blocked: n, upgrade: s, blocking: r, terminated: o } = {},
    ) {
      const i = indexedDB.open(t, e),
        a = G(i);
      return (
        s &&
          i.addEventListener("upgradeneeded", (l) => {
            s(G(i.result), l.oldVersion, l.newVersion, G(i.transaction), l);
          }),
        n &&
          i.addEventListener("blocked", (l) =>
            n(l.oldVersion, l.newVersion, l),
          ),
        a
          .then((l) => {
            (o && l.addEventListener("close", () => o()),
              r &&
                l.addEventListener("versionchange", (c) =>
                  r(c.oldVersion, c.newVersion, c),
                ));
          })
          .catch(() => {}),
        a
      );
    }
    const ws = ["get", "getKey", "getAll", "getAllKeys", "count"],
      As = ["put", "add", "delete", "clear"],
      Qe = new Map();

    function Dt(t, e) {
      if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string"))
        return;
      if (Qe.get(e)) return Qe.get(e);
      const n = e.replace(/FromIndex$/, ""),
        s = e !== n,
        r = As.includes(n);
      if (
        !(n in (s ? IDBIndex : IDBObjectStore).prototype) ||
        !(r || ws.includes(n))
      )
        return;
      const o = async function (i, ...a) {
        const l = this.transaction(i, r ? "readwrite" : "readonly");
        let c = l.store;
        return (
          s && (c = c.index(a.shift())),
          (await Promise.all([c[n](...a), r && l.done]))[0]
        );
      };
      return (Qe.set(e, o), o);
    }
    Lt((t) => ({
      ...t,
      get: (e, n, s) => Dt(e, n) || t.get(e, n, s),
      has: (e, n) => !!Dt(e, n) || t.has(e, n),
    }));
    const bs = ["continue", "continuePrimaryKey", "advance"],
      Ft = {},
      et = new WeakMap(),
      $t = new WeakMap(),
      Es = {
        get(t, e) {
          if (!bs.includes(e)) return t[e];
          let n = Ft[e];
          return (
            n ||
              (n = Ft[e] =
                function (...s) {
                  et.set(this, $t.get(this)[e](...s));
                }),
            n
          );
        },
      };
    async function* vs(...t) {
      let e = this;
      if ((e instanceof IDBCursor || (e = await e.openCursor(...t)), !e))
        return;
      e = e;
      const n = new Proxy(e, Es);
      for ($t.set(n, e), Se.set(n, Ye(e)); e; )
        (yield n, (e = await (et.get(n) || e.continue())), et.delete(n));
    }

    function jt(t, e) {
      return (
        (e === Symbol.asyncIterator &&
          Ve(t, [IDBIndex, IDBObjectStore, IDBCursor])) ||
        (e === "iterate" && Ve(t, [IDBIndex, IDBObjectStore]))
      );
    }
    Lt((t) => ({
      ...t,
      get(e, n, s) {
        return jt(e, n) ? vs : t.get(e, n, s);
      },
      has(e, n) {
        return jt(e, n) || t.has(e, n);
      },
    }));
    class Q {
      db;
      static instance;
      listeners;
      constructor() {
        ((this.db = ys("settings-db", 2, {
          upgrade(e) {
            e.objectStoreNames.contains("settings") ||
              e.createObjectStore("settings", {
                keyPath: "key",
              });
          },
        })),
          (this.listeners = new Map()));
      }
      static getInstance() {
        return (Q.instance || (Q.instance = new Q()), Q.instance);
      }
      async getSetting(e) {
        try {
          return (await (await this.db).get("settings", e))?.value;
        } catch (n) {
          console.error(`Error retrieving setting "${e}":`, n);
          return;
        }
      }
      async setSetting(e, n) {
        try {
          (await (
            await this.db
          ).put("settings", {
            key: e,
            value: n,
          }),
            this.notifyListeners(e, n));
        } catch (s) {
          throw (console.error(`Error storing setting "${e}":`, s), s);
        }
      }
      subscribe(e, n) {
        return (
          this.listeners.has(e) || this.listeners.set(e, new Set()),
          this.listeners.get(e)?.add(n),
          () => {
            this.listeners.get(e)?.delete(n);
          }
        );
      }
      notifyListeners(e, n) {
        this.listeners.get(e)?.forEach((s) => s(n));
      }
    }
    const R = Q.getInstance();
    class v {
      static CONTAINER = document.documentElement || document.body;
      static CREDITS_URL =
        "https://www.sadcaptcha.com/api/v1/license/credits?licenseKey=";
      static IMAGE_CRAWL_URL =
        "https://www.sadcaptcha.com/api/v1/shopee-image-crawl?licenseKey=";
      static PUZZLE_URL =
        "https://www.sadcaptcha.com/api/v1/puzzle?licenseKey=";
      static API_HEADERS = new Headers({
        "Content-Type": "application/json",
      });
      static IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR = ".DfwepB";
      static IMAGE_CRAWL_PIECE_IMAGE_SELECTOR = "#puzzleImgComponent";
      static IMAGE_CRAWL_BUTTON_SELECTOR = "#sliderContainer > div > div";
      static IMAGE_CRAWL_RESET_BUTTON = "button.CtJZAZ, button.XAny99";
      static IMAGE_CRAWL_UNIQUE_IDENTIFIERS = [
        v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR,
        v.IMAGE_CRAWL_PIECE_IMAGE_SELECTOR,
      ];
      static PUZZLE_BUTTON_SELECTOR =
        'aside[aria-modal=true] div[style="width: 40px; height: 40px; transform: translateX(0px);"]';
      static PUZZLE_PUZZLE_IMAGE_SELECTOR =
        "aside[aria-modal=true] div[aria-hidden=true] > div > div > img[draggable=false]";
      static PUZZLE_PIECE_IMAGE_SELECTOR =
        "aside[aria-modal=true] div[aria-hidden=true] > div > div > img[draggable=true]";
      static PUZZLE_UNIQUE_IDENTIFIERS = [
        "aside[aria-modal=true]",
        "#captcha-verify-image",
      ];
      static CAPTCHA_PRESENCE_INDICATORS = [
        'aside[aria-modal=true] div[style="width: 40px; height: 40px; transform: translateX(0px);"]',
        "#NEW_CAPTCHA",
        "#captchaMask",
        "body.captcha-disable-scroll",
      ];
      isCurrentlySolving = !1;
      constructor() {
        window.hasRun !== !0 &&
          ((window.hasRun = !0),
          this.setupMessageListener(),
          this.solveCaptchaLoop());
      }
      setupMessageListener() {
        te.runtime.onMessage.addListener((e, n, s) => {
          e.apiKey
            ? (localStorage.setItem("sadCaptchaKey", e.apiKey),
              s({
                message: "API key set.",
                success: 1,
              }))
            : s({
                message: "API key cannot be empty.",
                success: 0,
              });
        });
      }
      getApiKey() {
        return "2515d1a34dee431231d555fdbf8351f7";
      }
      async apiCall(e, n) {
        console.log("Making API call to: " + e);
        const s = await fetch(e + this.getApiKey(), {
          method: "POST",
          headers: v.API_HEADERS,
          body: JSON.stringify(n),
        });
        return (console.log("Received API response:", s), s);
      }
      async creditsApiCall() {
        console.log("Checking API credits...");
        const n = await (
          await fetch(v.CREDITS_URL + this.getApiKey(), {
            method: "GET",
            headers: v.API_HEADERS,
          })
        ).json();
        return (console.log("API credits = " + n.credits), n.credits);
      }
      async imageCrawlApiCall(e) {
        const s = await (await this.apiCall(v.IMAGE_CRAWL_URL, e)).json();
        return (
          console.log(
            "Pixels from slider origin = " + s.pixelsFromSliderOrigin,
          ),
          s.pixelsFromSliderOrigin
        );
      }
      async puzzleApiCall(e, n) {
        const r = await (
          await this.apiCall(v.PUZZLE_URL, {
            puzzleImageB64: e,
            pieceImageB64: n,
          })
        ).json();
        return (
          console.log("slideXProportion = " + r.slideXProportion),
          r.slideXProportion
        );
      }
      findFirstElementToAppear(e) {
        return new Promise((n) => {
          const s = new MutationObserver((r) => {
            for (const o of r)
              if (o.addedNodes) {
                for (const i of Array.from(o.addedNodes))
                  for (const a of e)
                    if (i instanceof Element && i.querySelector(a)) {
                      (console.debug(`Element matched ${a}`),
                        s.disconnect(),
                        n(i.querySelector(a)));
                      return;
                    }
              }
          });
          s.observe(v.CONTAINER, {
            childList: !0,
            subtree: !0,
          });
        });
      }
      waitForElement(e) {
        return new Promise((n) => {
          const s = document.querySelector(e);
          if (s) {
            (console.log("Selector found: " + e), n(s));
            return;
          }
          const r = new MutationObserver((o) => {
            const i = document.querySelector(e);
            i &&
              (r.disconnect(),
              console.log("Selector found by mutation observer: " + e),
              n(i));
          });
          r.observe(v.CONTAINER, {
            childList: !0,
            subtree: !0,
          });
        });
      }
      anySelectorInListPresent(e) {
        return e.some((n) =>
          document.querySelector(n)
            ? (console.log(`Selector ${n} is present`), !0)
            : !1,
        );
      }
      async identifyCaptcha() {
        for (let e = 0; e < 30; e++) {
          if (this.anySelectorInListPresent(v.IMAGE_CRAWL_UNIQUE_IDENTIFIERS))
            return (console.log("Image crawl detected"), 1);
          if (this.anySelectorInListPresent(v.PUZZLE_UNIQUE_IDENTIFIERS))
            return (console.log("Puzzle detected"), 0);
          await new Promise((n) => setTimeout(n, 1e3));
        }
        throw new Error("Could not identify CaptchaType");
      }
      async getImageSource(e) {
        const s = (await this.waitForElement(e)).getAttribute("src");
        if (!s)
          throw new Error(`Source attribute not found for selector: ${e}`);
        return (console.log("src = " + s), s);
      }
      async getImageBase64(e) {
        const s = await (await fetch(e)).blob();
        return new Promise((r, o) => {
          const i = new FileReader();
          ((i.onloadend = () => {
            const a = i.result;
            r(a.split(",")[1]);
          }),
            (i.onerror = o),
            i.readAsDataURL(s));
        });
      }
      getBase64StringFromDataURL(e) {
        return e.replace(/^data:image\/[a-z]+;base64,/, "");
      }
      dispatchMouseEvent(e, n, s, r) {
        ((r || document.elementFromPoint(n, s) || v.CONTAINER).dispatchEvent(
          new MouseEvent(e, {
            bubbles: !0,
            cancelable: !0,
            view: window,
            clientX: n,
            clientY: s,
          }),
        ),
          console.log(`Mouse ${e} at ${n}, ${s}`));
      }
      dispatchPointerEvent(e, n, s, r) {
        ((r || v.CONTAINER).dispatchEvent(
          new PointerEvent(e, {
            pointerType: "mouse",
            bubbles: !0,
            cancelable: !0,
            view: window,
            clientX: n,
            clientY: s,
          }),
        ),
          console.log(`Pointer ${e} at ${n}, ${s}`));
      }
      mouseUp(e, n) {
        this.dispatchMouseEvent("mouseup", e, n);
      }
      mouseDown(e, n) {
        this.dispatchMouseEvent("mousedown", e, n);
      }
      mouseOver(e, n) {
        this.dispatchMouseEvent("mouseover", e, n);
      }
      mouseMove(e, n, s) {
        this.dispatchPointerEvent("mousemove", e, n, s);
      }
      clickElement(e) {
        const n = document.querySelector(e);
        if (!n) throw new Error(`Element not found for selector: ${e}`);
        const s = n.getBoundingClientRect(),
          r = s.x + s.width / 2,
          o = s.y + s.height / 2;
        (this.mouseMove(r, o),
          this.mouseOver(r, o),
          this.dispatchPointerEvent("click", r, o, n));
      }
      getElementCenter(e) {
        const n = e.getBoundingClientRect(),
          s = {
            x: n.x + n.width / 2,
            y: n.y + n.height / 2,
          };
        return (console.log("Element center:", s), s);
      }
      getElementWidth(e) {
        const n = e.getBoundingClientRect().width;
        return (console.log("Element width: " + n), n);
      }
      computePuzzleSlideDistance(e, n) {
        const s = n.getBoundingClientRect().width * e;
        return (console.log("Puzzle slide distance = " + s), s);
      }
      async refreshImageCrawl() {
        const e = await this.getImageSource(
          v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR,
        );
        for (
          this.clickElement(v.IMAGE_CRAWL_RESET_BUTTON);
          (await this.getImageSource(v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR)) ===
          e;
        )
          (console.log("Waiting for refresh..."),
            await new Promise((n) => setTimeout(n, 100)));
        console.log("Refresh complete");
      }
      async refreshPuzzle() {
        const e = await this.getImageSource("#captcha-verify-image");
        for (
          this.clickElement(
            'a[class*="refresh-button___StyledA-wyjjd0-0 VWPcJ secsdk_captcha_refresh"]',
          );
          (await this.getImageSource(v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR)) ===
          e;
        )
          (console.log("Waiting for refresh..."),
            await new Promise((n) => setTimeout(n, 100)));
        console.log("Refresh complete");
      }
      generateNaturalApproach(e, n, s) {
        const r = {
            x: e.x + (n.x - e.x) * (0.2 + Math.random() * 0.2),
            y: e.y + (Math.random() * 15 - 5),
          },
          o = {
            x: e.x + (n.x - e.x) * (0.6 + Math.random() * 0.2),
            y: n.y + (Math.random() * 10 - 5),
          },
          i = [];
        for (let a = 0; a <= s; a++) {
          const l = a / s,
            c =
              Math.pow(1 - l, 3) * e.x +
              3 * Math.pow(1 - l, 2) * l * r.x +
              3 * (1 - l) * Math.pow(l, 2) * o.x +
              Math.pow(l, 3) * n.x,
            m =
              Math.pow(1 - l, 3) * e.y +
              3 * Math.pow(1 - l, 2) * l * r.y +
              3 * (1 - l) * Math.pow(l, 2) * o.y +
              Math.pow(l, 3) * n.y;
          i.push({
            x: c,
            y: m,
          });
        }
        return i;
      }
      async mouseApproach(e, n) {
        const s = e - 80 - Math.random() * 40,
          r = n + 40 + Math.random() * 30,
          o = this.generateNaturalApproach(
            {
              x: s,
              y: r,
            },
            {
              x: e,
              y: n,
            },
            8 + Math.floor(Math.random() * 4),
          );
        for (const i of o)
          (this.mouseMove(i.x, i.y),
            await new Promise((a) => setTimeout(a, 15 + Math.random() * 25)));
        (await new Promise((i) => setTimeout(i, 200 + Math.random() * 150)),
          this.mouseMove(
            e + (Math.random() * 1.5 - 0.75),
            n + (Math.random() * 1.5 - 0.75),
          ));
      }
      rotateAngleFromStyle(e) {
        const n = /rotate\((.+)deg\)/,
          s = e.match(n);
        return s ? parseFloat(s[1]) : 0;
      }
      xyToProportionalPoint(e, n) {
        return {
          proportionX: (n.x - e.x) / e.width,
          proportionY: (n.y - e.y) / e.height,
        };
      }
      getTrajectoryElement(e, n, s) {
        const r = s.getAttribute("style") || "",
          o = this.rotateAngleFromStyle(r),
          i = this.getElementCenter(s);
        return {
          piece_center: this.xyToProportionalPoint(n, i),
          piece_rotation_angle: o,
          pixels_from_slider_origin: e,
        };
      }
      async getSlidePieceTrajectory(e, n) {
        const s = document.querySelector(v.IMAGE_CRAWL_PIECE_IMAGE_SELECTOR);
        if (!s) throw new Error("Slider piece container not found");
        const r = this.getElementWidth(n),
          o = this.getElementCenter(e),
          i = n.getBoundingClientRect(),
          a = [],
          l = 3;
        (this.mouseDown(o.x, o.y),
          await new Promise((c) => setTimeout(c, 180 + Math.random() * 120)));
        for (let c = 0; c < r * 0.85; c += l) {
          const m = o.x + c,
            f = o.y - Math.log(c + 1);
          (this.mouseMove(m, f, e),
            await new Promise((d) => setTimeout(d, 10)));
          const h = this.getTrajectoryElement(c, i, s);
          a.push(h);
        }
        return a;
      }
      async solveImageCrawl() {
        (await this.refreshImageCrawl(),
          await new Promise((h) => setTimeout(h, 500)));
        const [e, n] = await Promise.all([
            this.getImageSource(v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR),
            this.getImageSource(v.IMAGE_CRAWL_PIECE_IMAGE_SELECTOR),
          ]),
          s = this.getBase64StringFromDataURL(e),
          r = this.getBase64StringFromDataURL(n),
          o = document.querySelector(v.IMAGE_CRAWL_BUTTON_SELECTOR),
          i = document.querySelector(v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR);
        if (!o || !i) throw new Error("Image crawl elements not found");
        const a = this.getElementCenter(o);
        (await this.mouseApproach(a.x, a.y),
          await new Promise((h) => setTimeout(h, 350 + Math.random() * 200)));
        const l = await this.getSlidePieceTrajectory(o, i),
          c = await this.imageCrawlApiCall({
            piece_image_b64: r,
            puzzle_image_b64: s,
            slide_piece_trajectory: l,
          }),
          m = a.x + c,
          f = this.generateNaturalApproach(
            a,
            {
              x: m,
              y: a.y,
            },
            20 + Math.floor(Math.random() * 10),
          );
        for (const h of f)
          (this.mouseMove(h.x, h.y),
            await new Promise((d) => setTimeout(d, 20 + Math.random() * 30)));
        (await new Promise((h) => setTimeout(h, 100 + Math.random() * 150)),
          this.mouseUp(m, a.y));
      }
      async solvePuzzle() {
        await new Promise((h) => setTimeout(h, 3e3));
        const e = document.querySelector(
          'img[class*="captcha_verify_img_slide"]',
        );
        if (!e) throw new Error("Puzzle slider button not found");
        const n = this.getElementCenter(e);
        (await this.mouseApproach(n.x, n.y),
          await new Promise((h) => setTimeout(h, 133.7)),
          this.mouseDown(n.x, n.y),
          await new Promise((h) => setTimeout(h, 133.7)));
        const [s, r] = await Promise.all([
            this.getImageSource("#captcha-verify-image"),
            this.getImageSource('img[class*="captcha_verify_img_slide"]'),
          ]),
          o = await this.getImageBase64(s),
          i = await this.getImageBase64(r),
          a = await this.puzzleApiCall(o, i),
          l = await this.waitForElement(
            'img[class*="sc-ifAKCX itlNmx sc-gqjmRU cHbGdz"]',
          );
        if ((console.log("Puzzle image element found:", l), !l))
          throw new Error("Puzzle image element not found");
        const c = this.computePuzzleSlideDistance(a, l),
          m = n.x + c,
          f = this.generateNaturalApproach(
            n,
            {
              x: m,
              y: n.y,
            },
            5 + Math.floor(Math.random() * 15),
          );
        for (const h of f) {
          const d = Math.random() * 4 - 2;
          (this.mouseMove(h.x, h.y + d),
            await new Promise((p) => setTimeout(p, 10 + Math.random() * 20)));
        }
        (await new Promise((h) => setTimeout(h, 133.7)), this.mouseUp(m, n.y));
      }
      captchaIsPresent() {
        return v.CAPTCHA_PRESENCE_INDICATORS.some((e) =>
          document.querySelector(e)
            ? (console.log("Captcha present based on selector: " + e), !0)
            : !1,
        );
      }
      async solveCaptchaLoop() {
        let retryCount = 0;
        for (;;) {
          if (!this.isCurrentlySolving) {
            (this.captchaIsPresent() ||
              (console.log("Waiting for captcha..."),
              await this.findFirstElementToAppear(
                v.CAPTCHA_PRESENCE_INDICATORS,
              ),
              console.log("Captcha detected by mutation observer.")),
              (this.isCurrentlySolving = !0));
            try {
              if ((await this.creditsApiCall()) <= 0) {
                this.isCurrentlySolving = !1;
                continue;
              }
              switch (await this.identifyCaptcha()) {
                case 0:
                  await this.solvePuzzle();
                  break;
                case 1:
                  await this.solveImageCrawl();
                  break;
              }
              retryCount = 0; // Reset on success
            } catch (e) {
              console.error("Error during captcha solving process:", e);
              retryCount++;
              if (retryCount >= 3) {
                try {
                  Y("captchaFailed", { attempts: retryCount });
                } catch (sendErr) {}
                break; // Stop trying after 3 failures
              }
            } finally {
              ((this.isCurrentlySolving = !1),
                await new Promise((e) => setTimeout(e, 5e3)));
            }
          }
          await new Promise((e) => setTimeout(e, 1e3));
        }
      }
      async solveCaptchaOnce() {
        try {
          if ((await this.creditsApiCall()) <= 0)
            return (
              console.log("Out of credits"),
              {
                isSolved: !1,
                message: "Out of SadCaptcha credits.",
              }
            );
          switch (await this.identifyCaptcha()) {
            case 0:
              await this.solvePuzzle();
              break;
            case 1:
              await this.solveImageCrawl();
              break;
          }
          return (
            console.log("Captcha solve attempt finished."),
            {
              isSolved: !0,
              message: "Captcha solve attempt finished.",
            }
          );
        } catch (e) {
          return (
            console.error("Error during single captcha solve:", e),
            {
              isSolved: !1,
              message: "Error during single captcha solve:" + e,
            }
          );
        }
      }
      static async attemptSolve() {
        const e = new v();
        try {
          return (await e.solveCaptchaLoop(), !0);
        } catch (n) {
          return (console.error("Captcha solving attempt failed:", n), !1);
        }
      }
    }

    // Broader captcha detection for stability when solver is disabled
    async function captchaMonitor() {
      const instance = new v();
      let captchaDetectedTime = null;
      while (true) {
        if (instance.captchaIsPresent()) {
          if (!captchaDetectedTime) {
            captchaDetectedTime = Date.now();
          } else if (Date.now() - captchaDetectedTime > 30000) {
            // 30 seconds
            const apiKey = localStorage.getItem("sadCaptchaKey");
            let solverEnabled = false;
            if (apiKey) {
              try {
                const response = await fetch(v.CREDITS_URL + apiKey);
                const data = await response.json();
                if (data.credits > 0) solverEnabled = true;
              } catch (e) {}
            }
            if (!solverEnabled) {
              try {
                Y("captchaFailed", {
                  attempts: 0,
                  reason: "Solver disabled or no credits",
                });
              } catch (e) {}
              break;
            }
          }
        } else {
          captchaDetectedTime = null;
        }
        await new Promise((r) => setTimeout(r, 5000)); // Check every 5s
      }
    }

    // Start the monitor
    captchaMonitor();

    function Bt(t, e) {
        const [n, s] = lt(e);
        return ct(() => {
            console.log(`Syncing with settings key: "${t}"`), R.getSetting(t).then(i => {
                i !== void 0 && s(() => i)
            });
            const o = R.subscribe(t, i => {
                s(() => i)
            });
            Gt(() => {
                console.log(`Unsubscribing from settings key: "${t}"`), o()
            })
        }), [n, async o => {
            await R.setSetting(t, o)
        }]
    }

    function tt(t) {
        if (!(typeof t != "object" || t === null)) {
            for (const e in t)
                if (Object.prototype.hasOwnProperty.call(t, e)) {
                    const n = t[e];
                    if (typeof n == "string") try {
                        const s = JSON.parse(n);
                        t[e] = s, tt(t[e])
                    } catch {} else tt(n)
                }
        }
    }
    const _s = "scraperbot",
      xs = {
        matches: [
          "*://*.shopee.co.id/*",
          "*://*.shopee.com.my/*",
          "*://*.shopee.ph/*",
          "*://*.shopee.sg/*",
          "*://*.shopee.co.th/*",
          "*://*.shopee.vn/*",
          "*://shop-id.tokopedia.com/*",
        ],
        cssInjectionMode: "ui",
        async main(t) {
          var e = document.createElement("script");
          e.src = te.runtime.getURL("/inject.js");
          e.onload = function () {
            this.remove();
          };
          (document.head || document.documentElement).appendChild(e);
          const [n, s] = Bt("username", (await R.getSetting("username")) || ""),
            [r, o] = Bt("email", (await R.getSetting("email")) || ""),
            [i, a] = In({
              message: "",
              currentTask: "",
              crawlStats: {},
              isFetching: !1,
              username: n() || (await R.getSetting("username")),
              email: r() || (await R.getSetting("email")),
            });
          let keepAliveInterval;
          (ct(async () => {
            (await Y("getBackgroundState", {}).then((p) => {
              (console.log("Background state:", p),
                p && a("isFetching", p.isFetching));
            }),
              us("div.navbar__username").then(async () => {
                const p = document.querySelector("div.navbar__username");
                p &&
                  p.textContent &&
                  p.textContent.trim() !== "" &&
                  (a("username", p.textContent),
                  s(p.textContent),
                  await Y("reportUsername", p.textContent),
                  await R.setSetting("username", p.textContent));
              }));
            const d = await R.getSetting("email");
            (console.log("Email from settings:", d), a("email", d));
          }),
            (await Ss(t, i)).mount(),
            $("updateCurrentTask", ({ data: d }) => {
              a("currentTask", d.task);
            }),
            $("updateMessage", ({ data: d }) => {
              a("message", d.message);
            }),
            $("updateEmail", async ({ data: d }) => {
              (await R.setSetting("email", d.email),
                o(d.email),
                a("email", d.email));
            }),
            $("updateRegion", ({ data: d }) => {
              (Y("reportRegion", {
                region: d.region,
              }),
                a("region", d.region));
            }),
            $("updateFetchingStatus", ({ data: d }) => {
              a("isFetching", d.isFetching);
              if (d.isFetching) {
                keepAliveInterval = setInterval(() => {
                  Y("keepAlivePing");
                }, 20000);
              } else {
                if (keepAliveInterval) {
                  clearInterval(keepAliveInterval);
                  keepAliveInterval = null;
                }
              }
            }),
            $("refreshPage", () => {
              window.location.reload();
            }),
            $("performRandomScroll", async () => {
              // Autonomous randomized scrolling to trigger lazy-loaded API elements
              const performAutonomousScroll = () => {
                let scrollCount = 0;
                const maxScrolls = 5;

                const scrollStep = () => {
                  if (scrollCount >= maxScrolls) {
                    console.log(
                      "[Autonomous Scroll] Completed 5 scroll actions",
                    );
                    return;
                  }

                  // Randomize distance between 600px and 1200px
                  const distance =
                    Math.floor(Math.random() * (1200 - 600 + 1)) + 600;

                  // Use window.scrollBy with smooth behavior
                  window.scrollBy({
                    top: distance,
                    behavior: "smooth",
                  });

                  scrollCount++;
                  console.log(
                    `[Autonomous Scroll] Scroll ${scrollCount}/${maxScrolls}: ${distance}px`,
                  );

                  // Schedule next scroll with random delay between 2000ms and 4000ms
                  const delay =
                    Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;
                  setTimeout(scrollStep, delay);
                };

                // Start the scrolling sequence immediately after minimal DOM interaction
                setTimeout(scrollStep, 100);
              };

              // Trigger the autonomous scrolling
              performAutonomousScroll();
            }),
            $("solveCaptcha", async () => {
              console.log("Received request to solve captcha. Starting now.");
              const d = new v();
              window.location.hostname.includes("tokopedia")
                ? await d.solveCaptchaLoop()
                : await d.solveCaptchaOnce();
            }),
            $("clickUrl", async ({ data: d }) => {
              (a("message", "Navigating to next task..."), await Cs(d.url));
            }),
            $("checkCaptchaSelector", () => ({
              isCaptcha: !!document.querySelector(
                'aside[aria-modal=true] div[style="width: 40px; height: 40px; transform: translateX(0px);"], #NEW_CAPTCHA, #captchaMask'
              ),
            })));
          chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === "local" && changes.isFetching) {
              a("isFetching", changes.isFetching.newValue);
            }
          });
          async function c(d, p) {
            const w = new URL(
                window.location.origin +
                  "/api/v4/item/get_rating_variation_filters",
              ),
              b = w.searchParams,
              x = window.location.href.match(/\/product\/(\d+)\/(\d+)/);
            if (x) {
              const S = x[1],
                I = x[2];
              return (
                b.set("itemid", I),
                b.set("shopid", S),
                fetch(w.toString(), {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  credentials: "include",
                })
                  .then((O) => O.json())
                  .then(async (O) => {
                    console.log("Fetched rating variation data: ", O);
                    const N = "item.rating_variation";
                    let Z = {
                      api_url: w.toString(),
                      page_url: window.location.href,
                      email: d,
                      username: p,
                      data: O ? JSON.parse(JSON.stringify(O)) : void 0,
                    };
                    try {
                      const z = await Y("webhook", {
                        payload: Z,
                      });
                      await m(z, `${N}.${d}.${p}`);
                    } catch (z) {
                      console.error(`Error sending webhook for ${N}:`, z);
                    }
                    return {
                      success: !0,
                      data: O,
                    };
                  })
                  .catch((O) => {
                    console.error("Error fetching rating variation:", O);
                    return {
                      success: !1,
                      error: O.message,
                    };
                  })
              );
            }
            return {
              success: !1,
              error: "Could not determine itemid or shopid from URL",
            };
          }
          async function m(d, p) {
            d?.ok && a("crawlStats", p, (w) => (w || 0) + 1);
          }
          window.addEventListener(
            "VyuSys_Internal_Sync_99",
            async function (d) {
              if (!d || !d.detail) return;
              const mockEvent = { data: d.detail };
              d = mockEvent;
              if (!d.data || typeof d.data !== "object") return;
              const { type: p, data: w, url: b } = d.data;
              if (p !== "fetch") return;
              const x = {
                  "/api/v4/pdp/hot_sales/get": [
                    "pdp.hot_sales",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/pdp/get_pc": [
                    "pdp.get_pc",
                    (u) => ({
                      detail: u.data,
                      error: u.error,
                    }),
                  ],
                  "/api/v2/add_on_deal/get_main_item_info": [
                    "pdp.add_on_deal_main_info",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v2/add_on_deal/get_sub_item_info": [
                    "pdp.add_on_deal_sub_info",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v2/add_on_deal/info": [
                    "pdp.add_on_deal_info",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v2/bundle_deal/items": [
                    "pdp.bundle_deal_items",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/collection/get_items": [
                    "home.collection_items",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v2/item/get_ratings": [
                    "pdp.get_ratings",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/recommend/recommend": [
                    "home.recommend",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/recommend/recommend_post": [
                    "home.recommend_post",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/recommend/product_detail_page": [
                    "pdp.recommend_pdp",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/search/search_items": [
                    "search.search_items",
                    (u) => ({
                      items: u.items,
                    }),
                  ],
                  "/api/v4/search/search_user": [
                    "search.search_user",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/search/search_filter_config": [
                    "search.search_filter_config",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/search/search_mart_items": [
                    "supermarket.search_mart_items",
                    (u) => ({
                      items: u.data,
                    }),
                  ],
                  "/api/v4/mart/home/get_horizontal_collection": [
                    "supermarket.horizontal_collection",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/shop/search_items": [
                    "shop.sold_out",
                    (u) => ({
                      items: u.items,
                    }),
                  ],
                  "/api/v4/shop/get_shop_base": [
                    "shop.shop_base",
                    (u) => ({
                      response: u,
                    }),
                  ],
                  "/api/v4/shop/get_shop_seo": [
                    "shop.shop_seo",
                    (u) => ({
                      response: u.data,
                    }),
                  ],
                  "/api/v4/shop/get_shop_tab": [
                    "shop.shop_tab",
                    (u) => ({
                      items: u.data,
                    }),
                  ],
                  "/api/v4/shop/rcmd_items": [
                    "shop.rcmd_items",
                    (u) => ({
                      items: u.data,
                    }),
                  ],
                  "/api/v4/traffic/page_component/get_mart_home_page": [
                    "supermarket.mart_home_page",
                    (u) => ({
                      items: u.data,
                    }),
                  ],
                  "/api/v4/flash_sale/spm/get_all_sessions": [
                    "flash_sale.all_sessions",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/flash_sale/spm/get_all_itemids": [
                    "flash_sale.all_itemids",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v4/flash_sale/flash_sale_batch_get_items": [
                    "flash_sale.batch_items",
                    (u) => ({
                      data: u.data,
                    }),
                  ],
                  "/api/v2/voucher_wallet/get_user_voucher_by_time": [
                    "shop.user_voucher",
                    (u) => ({
                      response: u.data,
                    }),
                  ],
                  "/api/v2/voucher_wallet/get_voucher_detail": [
                    "shop.voucher_detail",
                    (u) => ({
                      response: u.data,
                    }),
                  ],
                  "/api/v2/voucher_wallet/get_user_voucher_list": [
                    "shop.user_voucher_list",
                    (u) => ({
                      data: u.data,
                      error: u.error,
                    }),
                  ],
                },
                S = Object.keys(x).find((u) => b.includes(u));
              if (!S) return;
              const [I, O] = x[S],
                N = (await R.getSetting("email")) || "bot@extension.local";
              if (!N) {
                console.error("Email not found in storage, using fallback.");
              }
              const Z = (await R.getSetting("username")) || _s,
                z = window.location.href;
              let g = {
                api_url: b,
                page_url: z,
                email: N,
                username: Z,
                ...O(w),
              };
              I == "pdp.get_pc" && (await c(N, Z));
              try {
                const u = await Y("webhook", {
                  payload: {
                    ...g,
                    data: g.data ? JSON.parse(JSON.stringify(g.data)) : void 0,
                    items: g.items
                      ? JSON.parse(JSON.stringify(g.items))
                      : void 0,
                    detail: g.detail
                      ? JSON.parse(JSON.stringify(g.detail))
                      : void 0,
                    response: g.response
                      ? JSON.parse(JSON.stringify(g.response))
                      : void 0,
                  },
                });
                await m(u, `${I}.${N}.${Z}`);
              } catch (u) {
                console.error(`Error sending webhook for ${I}:`, u);
              }
            },
          );
          const f = {
            "#__MODERN_ROUTER_DATA__": async (d) => {
              const p = "router.data";
              console.log(
                `HTML Intercepted [${p}]: Found initial page data element.`,
              );
              try {
                if (!d.textContent) {
                  console.warn(`[${p}] Element found but has no content.`);
                  return;
                }
                const w = JSON.parse(d.textContent);
                tt(w);
                const b =
                  (await R.getSetting("email")) || "bot@extension.local";
                if (!b) {
                  console.error(
                    `Email not found for [${p}] webhook, using fallback.`,
                  );
                }
                const x = "tiktok",
                  S = window.location.pathname.split("/");
                console.log(S);
                const O = {
                    api_url: "tiktok/router/data/" + S[3],
                    page_url: window.location.href,
                    email: b,
                    username: x,
                    data: w,
                  },
                  N = await Y("webhookTiktok", {
                    payload: O,
                  });
                await m(N, `${p}.${b}.${x}`);
              } catch (w) {
                console.error(`Error processing [${p}]:`, w);
              }
            },
          };

          function h(d) {
            console.log("Performing initial scan for existing elements...");
            for (const w in d)
              document.querySelectorAll(w).forEach((b) => {
                (console.log(
                  `Found existing element matching selector: "${w}"`,
                ),
                  d[w](b));
              });
            (new MutationObserver((w) => {
              for (const b of w)
                if (!(b.type !== "childList" || b.addedNodes.length === 0)) {
                  for (const x of b.addedNodes)
                    if (x instanceof HTMLElement)
                      for (const S in d)
                        (x.matches(S) &&
                          (console.log(
                            `Observed a newly added element matching: "${S}"`,
                          ),
                          d[S](x)),
                          x.querySelectorAll(S).forEach((I) => {
                            (console.log(
                              `Observed a newly added child element matching: "${S}"`,
                            ),
                              d[S](I));
                          }));
                }
            }).observe(document.body, {
              childList: !0,
              subtree: !0,
            }),
              console.log(
                "MutationObserver is now watching for future DOM changes.",
              ));
          }
          document.readyState === "loading"
            ? document.addEventListener("DOMContentLoaded", () => {
                h(f);
              })
            : h(f);
        },
      };

    function Ss(t, e) {
      return An(t, {
        name: "shopee-overlay",
        position: "overlay",
        css: `
      .hw-top {
        position: fixed;
        top: 0;
        left: 0;
        max-width: 200px;
        z-index: 999999;
        background-color: #EE4D2D;
        color: white;
        padding: 4px;
      }
    `,
        onMount(n) {
          return vn(
            () =>
              cs({
                state: e,
              }),
            n,
          );
        },
        onRemove(n) {
          n?.();
        },
      });
    }

    function Cs(t) {
      const e = document.createElement("a");
      ((e.href = t),
        (e.style.display = "none"),
        document.body.appendChild(e),
        e.click(),
        setTimeout(() => e.remove(), 100));
    }
    class nt extends Event {
      constructor(e, n) {
        (super(nt.EVENT_NAME, {}), (this.newUrl = e), (this.oldUrl = n));
      }
      static EVENT_NAME = st("wxt:locationchange");
    }

    function st(t) {
      return `${te?.runtime?.id}:content:${t}`;
    }

    function Ps(t) {
      let e, n;
      return {
        run() {
          e == null &&
            ((n = new URL(location.href)),
            (e = t.setInterval(() => {
              let s = new URL(location.href);
              s.href !== n.href &&
                (window.dispatchEvent(new nt(s, n)), (n = s));
            }, 1e3)));
        },
      };
    }
    class Ce {
      constructor(e, n) {
        ((this.contentScriptName = e),
          (this.options = n),
          (this.abortController = new AbortController()),
          this.isTopFrame
            ? (this.listenForNewerScripts({
                ignoreFirstEvent: !0,
              }),
              this.stopOldScripts())
            : this.listenForNewerScripts());
      }
      static SCRIPT_STARTED_MESSAGE_TYPE = st("wxt:content-script-started");
      isTopFrame = window.self === window.top;
      abortController;
      locationWatcher = Ps(this);
      receivedMessageIds = new Set();
      get signal() {
        return this.abortController.signal;
      }
      abort(e) {
        return this.abortController.abort(e);
      }
      get isInvalid() {
        return (
          te.runtime.id == null && this.notifyInvalidated(),
          this.signal.aborted
        );
      }
      get isValid() {
        return !this.isInvalid;
      }
      onInvalidated(e) {
        return (
          this.signal.addEventListener("abort", e),
          () => this.signal.removeEventListener("abort", e)
        );
      }
      block() {
        return new Promise(() => {});
      }
      setInterval(e, n) {
        const s = setInterval(() => {
          this.isValid && e();
        }, n);
        return (this.onInvalidated(() => clearInterval(s)), s);
      }
      setTimeout(e, n) {
        const s = setTimeout(() => {
          this.isValid && e();
        }, n);
        return (this.onInvalidated(() => clearTimeout(s)), s);
      }
      requestAnimationFrame(e) {
        const n = requestAnimationFrame((...s) => {
          this.isValid && e(...s);
        });
        return (this.onInvalidated(() => cancelAnimationFrame(n)), n);
      }
      requestIdleCallback(e, n) {
        const s = requestIdleCallback((...r) => {
          this.signal.aborted || e(...r);
        }, n);
        return (this.onInvalidated(() => cancelIdleCallback(s)), s);
      }
      addEventListener(e, n, s, r) {
        (n === "wxt:locationchange" &&
          this.isValid &&
          this.locationWatcher.run(),
          e.addEventListener?.(n.startsWith("wxt:") ? st(n) : n, s, {
            ...r,
            signal: this.signal,
          }));
      }
      notifyInvalidated() {
        (this.abort("Content script context invalidated"),
          je.debug(
            `Content script "${this.contentScriptName}" context invalidated`,
          ));
      }
      stopOldScripts() {
        window.postMessage(
          {
            type: Ce.SCRIPT_STARTED_MESSAGE_TYPE,
            contentScriptName: this.contentScriptName,
            messageId: Math.random().toString(36).slice(2),
          },
          "*",
        );
      }
      verifyScriptStartedEvent(e) {
        const n = e.data?.type === Ce.SCRIPT_STARTED_MESSAGE_TYPE,
          s = e.data?.contentScriptName === this.contentScriptName,
          r = !this.receivedMessageIds.has(e.data?.messageId);
        return n && s && r;
      }
      listenForNewerScripts(e) {
        let n = !0;
        const s = (r) => {
          if (this.verifyScriptStartedEvent(r)) {
            this.receivedMessageIds.add(r.data.messageId);
            const o = n;
            if (((n = !1), o && e?.ignoreFirstEvent)) return;
            this.notifyInvalidated();
          }
        };
        (addEventListener("message", s),
          this.onInvalidated(() => removeEventListener("message", s)));
      }
    }

    function Os() {}

    const Is = {
      debug: () => {},
      log: () => {},
      warn: () => {},
      error: () => {},
    };
    return (async () => {
        try {
            const {
                main: t,
                ...e
            } = xs, n = new Ce("content", e);
            return await t(n)
        } catch (t) {
            throw Is.error('The content script "content" crashed on startup!', t), t
        }
    })()
}();
content;
