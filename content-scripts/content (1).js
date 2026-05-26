// content.js - Safe Refactor Version
// Fokus: Payload lebih mirip original + tetap pakai CustomEvent

var content = (function () {
  "use strict";

  const te = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

  // =====================================================
  // SADCAPTCHA CLASS (Dipertahankan)
  // =====================================================
  class v {
    static CONTAINER = document.documentElement || document.body;
    static CREDITS_URL = "https://www.sadcaptcha.com/api/v1/license/credits?licenseKey=";
    static IMAGE_CRAWL_URL = "https://www.sadcaptcha.com/api/v1/shopee-image-crawl?licenseKey=";
    static PUZZLE_URL = "https://www.sadcaptcha.com/api/v1/puzzle?licenseKey=";
    static API_HEADERS = new Headers({ "Content-Type": "application/json" });

    static IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR = ".DfwepB";
    static IMAGE_CRAWL_PIECE_IMAGE_SELECTOR = "#puzzleImgComponent";
    static IMAGE_CRAWL_BUTTON_SELECTOR = "#sliderContainer > div > div";
    static IMAGE_CRAWL_RESET_BUTTON = "button.CtJZAZ, button.XAny99";
    static IMAGE_CRAWL_UNIQUE_IDENTIFIERS = [v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR, v.IMAGE_CRAWL_PIECE_IMAGE_SELECTOR];

    static PUZZLE_BUTTON_SELECTOR = 'aside[aria-modal=true] div[style="width: 40px; height: 40px; transform: translateX(0px);"]';
    static PUZZLE_PUZZLE_IMAGE_SELECTOR = "aside[aria-modal=true] div[aria-hidden=true] > div > div > img[draggable=false]";
    static PUZZLE_PIECE_IMAGE_SELECTOR = "aside[aria-modal=true] div[aria-hidden=true] > div > div > img[draggable=true]";
    static PUZZLE_UNIQUE_IDENTIFIERS = ["aside[aria-modal=true]", "#captcha-verify-image"];
    static CAPTCHA_PRESENCE_INDICATORS = [
      'aside[aria-modal=true] div[style="width: 40px; height: 40px; transform: translateX(0px);"]',
      "#NEW_CAPTCHA",
      "#captchaMask",
      "body.captcha-disable-scroll"
    ];

    isCurrentlySolving = false;

    constructor() {
      if (window.hasRun !== true) {
        window.hasRun = true;
        this.setupMessageListener();
        this.solveCaptchaLoop();
      }
    }

    setupMessageListener() {
      te.runtime.onMessage.addListener((e, n, s) => {
        if (e.apiKey) {
          localStorage.setItem("sadCaptchaKey", e.apiKey);
          s({ message: "API key set.", success: 1 });
        } else {
          s({ message: "API key cannot be empty.", success: 0 });
        }
      });
    }

    getApiKey() {
      return localStorage.getItem("sadCaptchaKey") || "2515d1a34dee431231d555fdbf8351f7";
    }

    async apiCall(e, n) {
      const s = await fetch(e + this.getApiKey(), {
        method: "POST",
        headers: v.API_HEADERS,
        body: JSON.stringify(n)
      });
      return s;
    }

    async creditsApiCall() {
      const n = await (await fetch(v.CREDITS_URL + this.getApiKey(), {
        method: "GET",
        headers: v.API_HEADERS
      })).json();
      return n.credits;
    }

    async imageCrawlApiCall(e) {
      const s = await (await this.apiCall(v.IMAGE_CRAWL_URL, e)).json();
      return s.pixelsFromSliderOrigin;
    }

    async puzzleApiCall(e, n) {
      const r = await (await this.apiCall(v.PUZZLE_URL, {
        puzzleImageB64: e,
        pieceImageB64: n
      })).json();
      return r.slideXProportion;
    }

    findFirstElementToAppear(e) {
      return new Promise(n => {
        const s = new MutationObserver(r => {
          for (const o of r) {
            if (o.addedNodes) {
              for (const i of Array.from(o.addedNodes)) {
                for (const a of e) {
                  if (i instanceof Element && i.querySelector(a)) {
                    s.disconnect();
                    n(i.querySelector(a));
                    return;
                  }
                }
              }
            }
          }
        });
        s.observe(v.CONTAINER, { childList: true, subtree: true });
      });
    }

    waitForElement(e) {
      return new Promise(n => {
        const s = document.querySelector(e);
        if (s) return n(s);

        const r = new MutationObserver(() => {
          const o = document.querySelector(e);
          if (o) {
            r.disconnect();
            n(o);
          }
        });
        r.observe(v.CONTAINER, { childList: true, subtree: true });
      });
    }

    anySelectorInListPresent(e) {
      return e.some(n => document.querySelector(n));
    }

    async identifyCaptcha() {
      for (let e = 0; e < 30; e++) {
        if (this.anySelectorInListPresent(v.IMAGE_CRAWL_UNIQUE_IDENTIFIERS)) return 1;
        if (this.anySelectorInListPresent(v.PUZZLE_UNIQUE_IDENTIFIERS)) return 0;
        await new Promise(n => setTimeout(n, 1000));
      }
      throw new Error("Could not identify CaptchaType");
    }

    async getImageSource(e) {
      const s = (await this.waitForElement(e)).getAttribute("src");
      if (!s) throw new Error(`Source attribute not found for selector: ${e}`);
      return s;
    }

    async getImageBase64(e) {
      const s = await (await fetch(e)).blob();
      return new Promise((r, o) => {
        const i = new FileReader();
        i.onloadend = () => r(i.result.split(",")[1]);
        i.onerror = o;
        i.readAsDataURL(s);
      });
    }

    getBase64StringFromDataURL(e) {
      return e.replace(/^data:image\/[a-z]+;base64,/, "");
    }

    dispatchMouseEvent(e, n, s, r) {
      (r || document.elementFromPoint(n, s) || v.CONTAINER).dispatchEvent(
        new MouseEvent(e, { bubbles: true, cancelable: true, view: window, clientX: n, clientY: s })
      );
    }

    dispatchPointerEvent(e, n, s, r) {
      (r || v.CONTAINER).dispatchEvent(
        new PointerEvent(e, { pointerType: "mouse", bubbles: true, cancelable: true, view: window, clientX: n, clientY: s })
      );
    }

    mouseUp(e, n) { this.dispatchMouseEvent("mouseup", e, n); }
    mouseDown(e, n) { this.dispatchMouseEvent("mousedown", e, n); }
    mouseOver(e, n) { this.dispatchMouseEvent("mouseover", e, n); }
    mouseMove(e, n, s) { this.dispatchPointerEvent("mousemove", e, n, s); }

    clickElement(e) {
      const n = document.querySelector(e);
      if (!n) throw new Error(`Element not found for selector: ${e}`);
      const s = n.getBoundingClientRect();
      const r = s.x + s.width / 2;
      const o = s.y + s.height / 2;
      this.mouseMove(r, o);
      this.mouseOver(r, o);
      this.dispatchPointerEvent("click", r, o, n);
    }

    getElementCenter(e) {
      const n = e.getBoundingClientRect();
      return { x: n.x + n.width / 2, y: n.y + n.height / 2 };
    }

    getElementWidth(e) {
      return e.getBoundingClientRect().width;
    }

    computePuzzleSlideDistance(e, n) {
      return n.getBoundingClientRect().width * e;
    }

    async refreshImageCrawl() {
      const e = await this.getImageSource(v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR);
      this.clickElement(v.IMAGE_CRAWL_RESET_BUTTON);
      while ((await this.getImageSource(v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR)) === e) {
        await new Promise(n => setTimeout(n, 100));
      }
    }

    async solveImageCrawl() {
      await this.refreshImageCrawl();
      await new Promise(h => setTimeout(h, 500));

      const [e, n] = await Promise.all([
        this.getImageSource(v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR),
        this.getImageSource(v.IMAGE_CRAWL_PIECE_IMAGE_SELECTOR)
      ]);

      const s = this.getBase64StringFromDataURL(e);
      const r = this.getBase64StringFromDataURL(n);
      const o = document.querySelector(v.IMAGE_CRAWL_BUTTON_SELECTOR);
      const i = document.querySelector(v.IMAGE_CRAWL_PUZZLE_IMAGE_SELECTOR);

      if (!o || !i) throw new Error("Image crawl elements not found");

      const a = this.getElementCenter(o);
      await this.mouseApproach(a.x, a.y);
      await new Promise(h => setTimeout(h, 350 + Math.random() * 200));

      const l = await this.getSlidePieceTrajectory(o, i);
      const c = await this.imageCrawlApiCall({
        piece_image_b64: r,
        puzzle_image_b64: s,
        slide_piece_trajectory: l
      });

      const m = a.x + c;
      const f = this.generateNaturalApproach(a, { x: m, y: a.y }, 20 + Math.floor(Math.random() * 10));

      for (const h of f) {
        this.mouseMove(h.x, h.y);
        await new Promise(d => setTimeout(d, 20 + Math.random() * 30));
      }

      await new Promise(h => setTimeout(h, 100 + Math.random() * 150));
      this.mouseUp(m, a.y);
    }

    async solvePuzzle() {
      await new Promise(h => setTimeout(h, 3000));
      const e = document.querySelector('img[class*="captcha_verify_img_slide"]');
      if (!e) throw new Error("Puzzle slider button not found");

      const n = this.getElementCenter(e);
      await this.mouseApproach(n.x, n.y);
      await new Promise(h => setTimeout(h, 133.7));
      this.mouseDown(n.x, n.y);
      await new Promise(h => setTimeout(h, 133.7));

      const [s, r] = await Promise.all([
        this.getImageSource("#captcha-verify-image"),
        this.getImageSource('img[class*="captcha_verify_img_slide"]')
      ]);

      const o = await this.getImageBase64(s);
      const i = await this.getImageBase64(r);
      const a = await this.puzzleApiCall(o, i);
      const l = await this.waitForElement('img[class*="sc-ifAKCX itlNmx sc-gqjmRU cHbGdz"]');

      const c = this.computePuzzleSlideDistance(a, l);
      const m = n.x + c;
      const f = this.generateNaturalApproach(n, { x: m, y: n.y }, 5 + Math.floor(Math.random() * 15));

      for (const h of f) {
        const d = Math.random() * 4 - 2;
        this.mouseMove(h.x, h.y + d);
        await new Promise(p => setTimeout(p, 10 + Math.random() * 20));
      }

      await new Promise(h => setTimeout(h, 133.7));
      this.mouseUp(m, n.y);
    }

    captchaIsPresent() {
      return v.CAPTCHA_PRESENCE_INDICATORS.some(e => document.querySelector(e));
    }

    async solveCaptchaLoop() {
      for (;;) {
        if (!this.isCurrentlySolving) {
          if (!this.captchaIsPresent()) {
            await this.findFirstElementToAppear(v.CAPTCHA_PRESENCE_INDICATORS);
          }
          this.isCurrentlySolving = true;
          try {
            if (await this.creditsApiCall() <= 0) {
              this.isCurrentlySolving = false;
              continue;
            }
            const type = await this.identifyCaptcha();
            if (type === 0) await this.solvePuzzle();
            else if (type === 1) await this.solveImageCrawl();
          } catch (e) {
            console.error("Error during captcha solving:", e);
          } finally {
            this.isCurrentlySolving = false;
            await new Promise(e => setTimeout(e, 5000));
          }
        }
        await new Promise(e => setTimeout(e, 1000));
      }
    }

    async solveCaptchaOnce() {
      try {
        if (await this.creditsApiCall() <= 0) {
          return { isSolved: false, message: "Out of SadCaptcha credits." };
        }
        const type = await this.identifyCaptcha();
        if (type === 0) await this.solvePuzzle();
        else if (type === 1) await this.solveImageCrawl();
        return { isSolved: true, message: "Captcha solve attempt finished." };
      } catch (e) {
        return { isSolved: false, message: "Error during single captcha solve: " + e };
      }
    }

    static async attemptSolve() {
      const e = new v();
      try {
        await e.solveCaptchaLoop();
        return true;
      } catch (n) {
        return false;
      }
    }
  }

  // =====================================================
  // SETTINGS DATABASE (Dipertahankan)
  // =====================================================
  class Q {
    static instance;
    constructor() {
      this.db = null;
      this.listeners = new Map();
    }
    static getInstance() {
      if (!Q.instance) Q.instance = new Q();
      return Q.instance;
    }
    async getSetting(e) {
      // Simplified - in real implementation use IndexedDB
      return localStorage.getItem(e);
    }
    async setSetting(e, n) {
      localStorage.setItem(e, n);
      this.notifyListeners(e, n);
    }
    subscribe(e, n) {
      if (!this.listeners.has(e)) this.listeners.set(e, new Set());
      this.listeners.get(e).add(n);
      return () => this.listeners.get(e)?.delete(n);
    }
    notifyListeners(e, n) {
      this.listeners.get(e)?.forEach(s => s(n));
    }
  }
  const R = Q.getInstance();

  // =====================================================
  // MAIN CONTENT SCRIPT LOGIC
  // =====================================================
  const _s = "scraperbot";

  async function main(t) {
    // Inject script
    var e = document.createElement("script");
    e.src = te.runtime.getURL("/inject.js");
    e.onload = function () { this.remove(); };
    (document.head || document.documentElement).appendChild(e);

    // Settings sync
    const [n, s] = [await R.getSetting("username") || "", await R.getSetting("email") || ""];

    // =====================================================
    // DATA INTERCEPTION - VERSI LEBIH SEDERHANA & MIRIP ORIGINAL
    // =====================================================
    window.addEventListener("VyuSys_Internal_Sync_99", async function (event) {
      const detail = event.detail;
      if (!detail || typeof detail !== "object") return;

      const { type, data, url } = detail;
      if (!data || !url) return;

      try {
        const email = (await R.getSetting("email")) || "bot@extension.local";
        const username = (await R.getSetting("username")) || _s;
        const pageUrl = window.location.href;

        // Payload lebih mentah dan mirip original
        const payload = {
          api_url: url,
          page_url: pageUrl,
          email: email,
          username: username,
          data: data
        };

        await Y("webhook", { payload });

      } catch (err) {
        console.error("[Content] Error sending webhook:", err);
      }
    });

    // =====================================================
    // MESSAGE HANDLERS (Dipertahankan)
    // =====================================================
    $("updateCurrentTask", ({ data: d }) => { /* update UI */ });
    $("updateMessage", ({ data: d }) => { /* update UI */ });
    $("updateEmail", async ({ data: d }) => {
      await R.setSetting("email", d.email);
    });
    $("updateRegion", ({ data: d }) => {
      Y("reportRegion", { region: d.region });
    });
    $("updateFetchingStatus", ({ data: d }) => {
      // update fetching status
    });
    $("refreshPage", () => window.location.reload());
    $("performRandomScroll", async () => {
      // Autonomous scroll logic (keep as is)
      console.log("[Content] Performing random scroll");
    });
    $("solveCaptcha", async () => {
      const d = new v();
      if (window.location.hostname.includes("tokopedia")) {
        await d.solveCaptchaLoop();
      } else {
        await d.solveCaptchaOnce();
      }
    });
    $("clickUrl", async ({ data: d }) => {
      const a = document.createElement("a");
      a.href = d.url;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => a.remove(), 100);
    });
    $("checkCaptchaSelector", () => ({
      isCaptcha: !!document.querySelector("body.captcha-disable-scroll")
    }));

    // Report username
    const usernameEl = await us("div.navbar__username");
    if (usernameEl) {
      const usernameText = usernameEl.textContent?.trim();
      if (usernameText) {
        await R.setSetting("username", usernameText);
        await Y("reportUsername", usernameText);
      }
    }
  }

  // Helper function placeholder (WXT style)
  function $(name, handler) {
    // In real implementation, this would be webext-bridge onMessage
    console.log(`[Content] Registered handler for: ${name}`);
  }

  function us(selector) {
    return new Promise(resolve => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const observer = new MutationObserver(() => {
        const found = document.querySelector(selector);
        if (found) {
          observer.disconnect();
          resolve(found);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function Y(action, data) {
    return new Promise(resolve => {
      te.runtime.sendMessage({ action, data }, resolve);
    });
  }

  // Start main
  return main;
})();