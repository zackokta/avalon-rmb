var background = function() {
    "use strict";

    function Ue(e) {
        return e == null || typeof e == "function" ? {
            main: e
        } : e
    }
    const $ = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;

    function ye(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
    }
    var ee = {
            exports: {}
        },
        ke;

    function We() {
        if (ke) return ee.exports;
        ke = 1;
        const e = r => typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? () => {
                const c = crypto.getRandomValues(new Uint8Array(1))[0];
                return (c >= r ? c % r : c).toString(r)
            } : () => Math.floor(Math.random() * r).toString(r),
            t = (r = 7, c = !1) => Array.from({
                length: r
            }, e(c ? 16 : 36)).join("");
        return ee.exports = t, ee.exports.default = t, ee.exports
    }
    var Ve = We();
    const te = ye(Ve);
    var ze = () => `uid::${te(7)}`,
        Xe = (e, t = ["endpointName", "fingerprint"]) => typeof e == "object" && e !== null && t.every(r => r in e),
        qe = e => {
            try {
                const t = JSON.parse(e);
                return Xe(t) ? t : null
            } catch {
                return null
            }
        },
        Ke = () => {
            let e = [];
            return {
                add: (...t) => {
                    e = [...e, ...t]
                },
                remove: t => {
                    e = typeof t == "string" ? e.filter(r => r.message.transactionId !== t) : e.filter(r => !t.includes(r))
                },
                entries: () => e
            }
        },
        Y = class {
            static toBackground(e, t) {
                return e.postMessage(t)
            }
            static toExtensionContext(e, t) {
                return e.postMessage(t)
            }
        },
        Ge = Object.defineProperty,
        Ye = Object.defineProperties,
        He = Object.getOwnPropertyDescriptors,
        ve = Object.getOwnPropertySymbols,
        Je = Object.prototype.hasOwnProperty,
        Ze = Object.prototype.propertyIsEnumerable,
        Te = (e, t, r) => t in e ? Ge(e, t, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: r
        }) : e[t] = r,
        R = (e, t) => {
            for (var r in t || (t = {})) Je.call(t, r) && Te(e, r, t[r]);
            if (ve)
                for (var r of ve(t)) Ze.call(t, r) && Te(e, r, t[r]);
            return e
        },
        le = (e, t) => Ye(e, He(t)),
        Qe = /^((?:background$)|devtools|popup|options|content-script|window)(?:@(\d+)(?:\.(\d+))?)?$/,
        ge = e => {
            const [, t, r, c] = e.match(Qe) || [];
            return {
                context: t,
                tabId: +r,
                frameId: c ? +c : void 0
            }
        },
        re = ({
            context: e,
            tabId: t,
            frameId: r
        }) => ["background", "popup", "options"].includes(e) ? e : `${e}@${t}${r?`.${r}`:""}`;
    const et = [{
            property: "name",
            enumerable: !1
        }, {
            property: "message",
            enumerable: !1
        }, {
            property: "stack",
            enumerable: !1
        }, {
            property: "code",
            enumerable: !0
        }],
        de = Symbol(".toJSON was called"),
        tt = e => {
            e[de] = !0;
            const t = e.toJSON();
            return delete e[de], t
        },
        Ee = ({
            from: e,
            seen: t,
            to_: r,
            forceEnumerable: c,
            maxDepth: l,
            depth: n
        }) => {
            const s = r || (Array.isArray(e) ? [] : {});
            if (t.push(e), n >= l) return s;
            if (typeof e.toJSON == "function" && e[de] !== !0) return tt(e);
            for (const [a, g] of Object.entries(e)) {
                if (typeof Buffer == "function" && Buffer.isBuffer(g)) {
                    s[a] = "[object Buffer]";
                    continue
                }
                if (g !== null && typeof g == "object" && typeof g.pipe == "function") {
                    s[a] = "[object Stream]";
                    continue
                }
                if (typeof g != "function") {
                    if (!g || typeof g != "object") {
                        s[a] = g;
                        continue
                    }
                    if (!t.includes(e[a])) {
                        n++, s[a] = Ee({
                            from: e[a],
                            seen: [...t],
                            forceEnumerable: c,
                            maxDepth: l,
                            depth: n
                        });
                        continue
                    }
                    s[a] = "[Circular]"
                }
            }
            for (const {
                    property: a,
                    enumerable: g
                }
                of et) typeof e[a] == "string" && Object.defineProperty(s, a, {
                value: e[a],
                enumerable: !0,
                configurable: !0,
                writable: !0
            });
            return s
        };

    function rt(e, t = {}) {
        const {
            maxDepth: r = Number.POSITIVE_INFINITY
        } = t;
        return typeof e == "object" && e !== null ? Ee({
            from: e,
            seen: [],
            forceEnumerable: !0,
            maxDepth: r,
            depth: 0
        }) : typeof e == "function" ? `[Function: ${e.name||"anonymous"}]` : e
    }
    let Se = () => ({
        events: {},
        emit(e, ...t) {
            (this.events[e] || []).forEach(r => r(...t))
        },
        on(e, t) {
            return (this.events[e] = this.events[e] || []).push(t), () => this.events[e] = (this.events[e] || []).filter(r => r !== t)
        }
    });
    var nt = (e, t, r) => {
            const c = te(),
                l = new Map,
                n = new Map,
                s = a => {
                    if (a.destination.context === e && !a.destination.frameId && !a.destination.tabId) {
                        r?.(a);
                        const {
                            transactionId: g,
                            messageID: f,
                            messageType: x
                        } = a, v = () => {
                            const k = l.get(g);
                            if (k) {
                                const {
                                    err: y,
                                    data: _
                                } = a;
                                if (y) {
                                    const S = y,
                                        W = self[S.name],
                                        O = new(typeof W == "function" ? W : Error)(S.message);
                                    for (const C in S) O[C] = S[C];
                                    k.reject(O)
                                } else k.resolve(_);
                                l.delete(g)
                            }
                        }, I = async () => {
                            let k, y, _ = !1;
                            try {
                                const S = n.get(f);
                                if (typeof S == "function") k = await S({
                                    sender: a.origin,
                                    id: f,
                                    data: a.data,
                                    timestamp: a.timestamp
                                });
                                else throw _ = !0, new Error(`[webext-bridge] No handler registered in '${e}' to accept messages with id '${f}'`)
                            } catch (S) {
                                y = S
                            } finally {
                                if (y && (a.err = rt(y)), s(le(R({}, a), {
                                        messageType: "reply",
                                        data: k,
                                        origin: {
                                            context: e,
                                            tabId: null
                                        },
                                        destination: a.origin,
                                        hops: []
                                    })), y && !_) throw k
                            }
                        };
                        switch (x) {
                            case "reply":
                                return v();
                            case "message":
                                return I()
                        }
                    }
                    return a.hops.push(`${e}::${c}`), t(a)
                };
            return {
                handleMessage: s,
                endTransaction: a => {
                    const g = l.get(a);
                    g?.reject("Transaction was ended before it could complete"), l.delete(a)
                },
                sendMessage: (a, g, f = "background") => {
                    const x = typeof f == "string" ? ge(f) : f,
                        v = "Bridge#sendMessage ->";
                    if (!x.context) throw new TypeError(`${v} Destination must be any one of known destinations`);
                    return new Promise((I, k) => {
                        const y = {
                            messageID: a,
                            data: g,
                            destination: x,
                            messageType: "message",
                            transactionId: te(),
                            origin: {
                                context: e,
                                tabId: null
                            },
                            hops: [],
                            timestamp: Date.now()
                        };
                        l.set(y.transactionId, {
                            resolve: I,
                            reject: k
                        });
                        try {
                            s(y)
                        } catch (_) {
                            l.delete(y.transactionId), k(_)
                        }
                    })
                },
                onMessage: (a, g) => (n.set(a, g), () => n.delete(a))
            }
        },
        V = class {
            constructor(e, t) {
                this.endpointRuntime = e, this.streamInfo = t, this.emitter = Se(), this.isClosed = !1, this.handleStreamClose = () => {
                    this.isClosed || (this.isClosed = !0, this.emitter.emit("closed", !0), this.emitter.events = {})
                }, V.initDone || (e.onMessage("__crx_bridge_stream_transfer__", r => {
                    const {
                        streamId: c,
                        streamTransfer: l,
                        action: n
                    } = r.data, s = V.openStreams.get(c);
                    s && !s.isClosed && (n === "transfer" && s.emitter.emit("message", l), n === "close" && (V.openStreams.delete(c), s.handleStreamClose()))
                }), V.initDone = !0), V.openStreams.set(this.streamInfo.streamId, this)
            }
            get info() {
                return this.streamInfo
            }
            send(e) {
                if (this.isClosed) throw new Error("Attempting to send a message over closed stream. Use stream.onClose(<callback>) to keep an eye on stream status");
                this.endpointRuntime.sendMessage("__crx_bridge_stream_transfer__", {
                    streamId: this.streamInfo.streamId,
                    streamTransfer: e,
                    action: "transfer"
                }, this.streamInfo.endpoint)
            }
            close(e) {
                e && this.send(e), this.handleStreamClose(), this.endpointRuntime.sendMessage("__crx_bridge_stream_transfer__", {
                    streamId: this.streamInfo.streamId,
                    streamTransfer: null,
                    action: "close"
                }, this.streamInfo.endpoint)
            }
            onMessage(e) {
                return this.getDisposable("message", e)
            }
            onClose(e) {
                return this.getDisposable("closed", e)
            }
            getDisposable(e, t) {
                const r = this.emitter.on(e, t);
                return Object.assign(r, {
                    dispose: r,
                    close: r
                })
            }
        },
        ne = V;
    ne.initDone = !1, ne.openStreams = new Map;
    var st = e => {
            const t = new Map,
                r = new Map,
                c = Se();
            e.onMessage("__crx_bridge_stream_open__", s => new Promise(a => {
                const {
                    sender: g,
                    data: f
                } = s, {
                    channel: x
                } = f;
                let v = !1,
                    I = () => {};
                const k = () => {
                    const y = r.get(x);
                    typeof y == "function" ? (y(new ne(e, le(R({}, f), {
                        endpoint: g
                    }))), v && I(), a(!0)) : v || (v = !0, I = c.on("did-change-stream-callbacks", k))
                };
                k()
            }));
            async function l(s, a) {
                if (t.has(s)) throw new Error("webext-bridge: A Stream is already open at this channel");
                const g = typeof a == "string" ? ge(a) : a,
                    f = {
                        streamId: te(),
                        channel: s,
                        endpoint: g
                    },
                    x = new ne(e, f);
                return x.onClose(() => t.delete(s)), await e.sendMessage("__crx_bridge_stream_open__", f, g), t.set(s, x), x
            }

            function n(s, a) {
                if (r.has(s)) throw new Error("webext-bridge: This channel has already been claimed. Stream allows only one-on-one communication");
                r.set(s, a), c.emit("did-change-stream-callbacks")
            }
            return {
                openStream: l,
                onOpenStreamChannel: n
            }
        },
        se = {
            exports: {}
        },
        ot = se.exports,
        Ie;

    function at() {
        return Ie || (Ie = 1, function(e, t) {
            (function(r, c) {
                c(e)
            })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : ot, function(r) {
                if (typeof globalThis != "object" || typeof chrome != "object" || !chrome || !chrome.runtime || !chrome.runtime.id) throw new Error("This script should only be loaded in a browser extension.");
                if (typeof globalThis.browser > "u" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
                    const c = "The message port closed before a response was received.",
                        l = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)",
                        n = s => {
                            const a = {
                                alarms: {
                                    clear: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    clearAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    get: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                bookmarks: {
                                    create: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getChildren: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getRecent: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getSubTree: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getTree: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    move: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    },
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeTree: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    search: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    update: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    }
                                },
                                browserAction: {
                                    disable: {
                                        minArgs: 0,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    enable: {
                                        minArgs: 0,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    getBadgeBackgroundColor: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getBadgeText: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getPopup: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getTitle: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    openPopup: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    setBadgeBackgroundColor: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    setBadgeText: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    setIcon: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    setPopup: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    setTitle: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    }
                                },
                                browsingData: {
                                    remove: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    },
                                    removeCache: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeCookies: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeDownloads: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeFormData: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeHistory: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeLocalStorage: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removePasswords: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removePluginData: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    settings: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                commands: {
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                contextMenus: {
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    update: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    }
                                },
                                cookies: {
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getAll: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getAllCookieStores: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    set: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                devtools: {
                                    inspectedWindow: {
                                        eval: {
                                            minArgs: 1,
                                            maxArgs: 2,
                                            singleCallbackArg: !1
                                        }
                                    },
                                    panels: {
                                        create: {
                                            minArgs: 3,
                                            maxArgs: 3,
                                            singleCallbackArg: !0
                                        },
                                        elements: {
                                            createSidebarPane: {
                                                minArgs: 1,
                                                maxArgs: 1
                                            }
                                        }
                                    }
                                },
                                downloads: {
                                    cancel: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    download: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    erase: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getFileIcon: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    open: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    pause: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeFile: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    resume: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    search: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    show: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    }
                                },
                                extension: {
                                    isAllowedFileSchemeAccess: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    isAllowedIncognitoAccess: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                history: {
                                    addUrl: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    deleteAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    deleteRange: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    deleteUrl: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getVisits: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    search: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                i18n: {
                                    detectLanguage: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getAcceptLanguages: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                identity: {
                                    launchWebAuthFlow: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                idle: {
                                    queryState: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                management: {
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    getSelf: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    setEnabled: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    },
                                    uninstallSelf: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    }
                                },
                                notifications: {
                                    clear: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    create: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    getPermissionLevel: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    update: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    }
                                },
                                pageAction: {
                                    getPopup: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getTitle: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    hide: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    setIcon: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    setPopup: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    setTitle: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    show: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    }
                                },
                                permissions: {
                                    contains: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    request: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                runtime: {
                                    getBackgroundPage: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    getPlatformInfo: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    openOptionsPage: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    requestUpdateCheck: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    sendMessage: {
                                        minArgs: 1,
                                        maxArgs: 3
                                    },
                                    sendNativeMessage: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    },
                                    setUninstallURL: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                sessions: {
                                    getDevices: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    getRecentlyClosed: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    restore: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    }
                                },
                                storage: {
                                    local: {
                                        clear: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        get: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getBytesInUse: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        remove: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        set: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    },
                                    managed: {
                                        get: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getBytesInUse: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        }
                                    },
                                    sync: {
                                        clear: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        get: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getBytesInUse: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        remove: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        set: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    }
                                },
                                tabs: {
                                    captureVisibleTab: {
                                        minArgs: 0,
                                        maxArgs: 2
                                    },
                                    create: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    detectLanguage: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    discard: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    duplicate: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    executeScript: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getCurrent: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    getZoom: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    getZoomSettings: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    goBack: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    goForward: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    highlight: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    insertCSS: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    move: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    },
                                    query: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    reload: {
                                        minArgs: 0,
                                        maxArgs: 2
                                    },
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeCSS: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    sendMessage: {
                                        minArgs: 2,
                                        maxArgs: 3
                                    },
                                    setZoom: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    setZoomSettings: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    update: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    }
                                },
                                topSites: {
                                    get: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                webNavigation: {
                                    getAllFrames: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getFrame: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                webRequest: {
                                    handlerBehaviorChanged: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                windows: {
                                    create: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    getCurrent: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    getLastFocused: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    update: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    }
                                }
                            };
                            if (Object.keys(a).length === 0) throw new Error("api-metadata.json has not been included in browser-polyfill");
                            class g extends WeakMap {
                                constructor(i, A = void 0) {
                                    super(A), this.createItem = i
                                }
                                get(i) {
                                    return this.has(i) || this.set(i, this.createItem(i)), super.get(i)
                                }
                            }
                            const f = o => o && typeof o == "object" && typeof o.then == "function",
                                x = (o, i) => (...A) => {
                                    s.runtime.lastError ? o.reject(new Error(s.runtime.lastError.message)) : i.singleCallbackArg || A.length <= 1 && i.singleCallbackArg !== !1 ? o.resolve(A[0]) : o.resolve(A)
                                },
                                v = o => o == 1 ? "argument" : "arguments",
                                I = (o, i) => function(p, ...E) {
                                    if (E.length < i.minArgs) throw new Error(`Expected at least ${i.minArgs} ${v(i.minArgs)} for ${o}(), got ${E.length}`);
                                    if (E.length > i.maxArgs) throw new Error(`Expected at most ${i.maxArgs} ${v(i.maxArgs)} for ${o}(), got ${E.length}`);
                                    return new Promise((M, F) => {
                                        if (i.fallbackToNoCallback) try {
                                            p[o](...E, x({
                                                resolve: M,
                                                reject: F
                                            }, i))
                                        } catch (b) {
                                            console.warn(`${o} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, b), p[o](...E), i.fallbackToNoCallback = !1, i.noCallback = !0, M()
                                        } else i.noCallback ? (p[o](...E), M()) : p[o](...E, x({
                                            resolve: M,
                                            reject: F
                                        }, i))
                                    })
                                },
                                k = (o, i, A) => new Proxy(i, {
                                    apply(p, E, M) {
                                        return A.call(E, o, ...M)
                                    }
                                });
                            let y = Function.call.bind(Object.prototype.hasOwnProperty);
                            const _ = (o, i = {}, A = {}) => {
                                    let p = Object.create(null),
                                        E = {
                                            has(F, b) {
                                                return b in o || b in p
                                            },
                                            get(F, b, D) {
                                                if (b in p) return p[b];
                                                if (!(b in o)) return;
                                                let T = o[b];
                                                if (typeof T == "function")
                                                    if (typeof i[b] == "function") T = k(o, o[b], i[b]);
                                                    else if (y(A, b)) {
                                                    let G = I(b, A[b]);
                                                    T = k(o, o[b], G)
                                                } else T = T.bind(o);
                                                else if (typeof T == "object" && T !== null && (y(i, b) || y(A, b))) T = _(T, i[b], A[b]);
                                                else if (y(A, "*")) T = _(T, i[b], A["*"]);
                                                else return Object.defineProperty(p, b, {
                                                    configurable: !0,
                                                    enumerable: !0,
                                                    get() {
                                                        return o[b]
                                                    },
                                                    set(G) {
                                                        o[b] = G
                                                    }
                                                }), T;
                                                return p[b] = T, T
                                            },
                                            set(F, b, D, T) {
                                                return b in p ? p[b] = D : o[b] = D, !0
                                            },
                                            defineProperty(F, b, D) {
                                                return Reflect.defineProperty(p, b, D)
                                            },
                                            deleteProperty(F, b) {
                                                return Reflect.deleteProperty(p, b)
                                            }
                                        },
                                        M = Object.create(o);
                                    return new Proxy(M, E)
                                },
                                S = o => ({
                                    addListener(i, A, ...p) {
                                        i.addListener(o.get(A), ...p)
                                    },
                                    hasListener(i, A) {
                                        return i.hasListener(o.get(A))
                                    },
                                    removeListener(i, A) {
                                        i.removeListener(o.get(A))
                                    }
                                }),
                                W = new g(o => typeof o != "function" ? o : function(A) {
                                    const p = _(A, {}, {
                                        getContent: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        }
                                    });
                                    o(p)
                                });
                            let O = !1;
                            const C = new g(o => typeof o != "function" ? o : function(A, p, E) {
                                    let M = !1,
                                        F, b = new Promise(Q => {
                                            F = function(L) {
                                                O || (console.warn(l, new Error().stack), O = !0), M = !0, Q(L)
                                            }
                                        }),
                                        D;
                                    try {
                                        D = o(A, p, F)
                                    } catch (Q) {
                                        D = Promise.reject(Q)
                                    }
                                    const T = D !== !0 && f(D);
                                    if (D !== !0 && !T && !M) return !1;
                                    const G = Q => {
                                        Q.then(L => {
                                            E(L)
                                        }, L => {
                                            let xe;
                                            L && (L instanceof Error || typeof L.message == "string") ? xe = L.message : xe = "An unexpected error occurred", E({
                                                __mozWebExtensionPolyfillReject__: !0,
                                                message: xe
                                            })
                                        }).catch(L => {
                                            console.error("Failed to send onMessage rejected reply", L)
                                        })
                                    };
                                    return G(T ? D : b), !0
                                }),
                                d = ({
                                    reject: o,
                                    resolve: i
                                }, A) => {
                                    s.runtime.lastError ? s.runtime.lastError.message === c ? i() : o(new Error(s.runtime.lastError.message)) : A && A.__mozWebExtensionPolyfillReject__ ? o(new Error(A.message)) : i(A)
                                },
                                u = (o, i, A, ...p) => {
                                    if (p.length < i.minArgs) throw new Error(`Expected at least ${i.minArgs} ${v(i.minArgs)} for ${o}(), got ${p.length}`);
                                    if (p.length > i.maxArgs) throw new Error(`Expected at most ${i.maxArgs} ${v(i.maxArgs)} for ${o}(), got ${p.length}`);
                                    return new Promise((E, M) => {
                                        const F = d.bind(null, {
                                            resolve: E,
                                            reject: M
                                        });
                                        p.push(F), A.sendMessage(...p)
                                    })
                                },
                                m = {
                                    devtools: {
                                        network: {
                                            onRequestFinished: S(W)
                                        }
                                    },
                                    runtime: {
                                        onMessage: S(C),
                                        onMessageExternal: S(C),
                                        sendMessage: u.bind(null, "sendMessage", {
                                            minArgs: 1,
                                            maxArgs: 3
                                        })
                                    },
                                    tabs: {
                                        sendMessage: u.bind(null, "sendMessage", {
                                            minArgs: 2,
                                            maxArgs: 3
                                        })
                                    }
                                },
                                w = {
                                    clear: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    set: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                };
                            return a.privacy = {
                                network: {
                                    "*": w
                                },
                                services: {
                                    "*": w
                                },
                                websites: {
                                    "*": w
                                }
                            }, _(s, m, a)
                        };
                    r.exports = n(chrome)
                } else r.exports = globalThis.browser
            })
        }(se)), se.exports
    }
    var it = at();
    const ct = ye(it);
    var H = Ke(),
        P = new Map,
        z = new Map,
        oe = new Map,
        _e = (e, t) => (z.set(e, (z.get(e) || new Set).add(t)), () => {
            const r = z.get(e);
            r?.delete(t) && r?.size === 0 && z.delete(e)
        }),
        Pe = (e, t) => {
            oe.set(e, (oe.get(e) || new Set).add(t))
        },
        j = e => ({
            withFingerprint: t => {
                const r = l => ({
                        and: () => l
                    }),
                    c = {
                        aboutIncomingMessage: l => {
                            const n = P.get(e);
                            return Y.toExtensionContext(n.port, {
                                status: "incoming",
                                message: l
                            }), r(c)
                        },
                        aboutSuccessfulDelivery: l => {
                            const n = P.get(e);
                            return Y.toExtensionContext(n.port, {
                                status: "delivered",
                                receipt: l
                            }), r(c)
                        },
                        aboutMessageUndeliverability: (l, n) => {
                            const s = P.get(e);
                            return s?.fingerprint === t && Y.toExtensionContext(s.port, {
                                status: "undeliverable",
                                resolvedDestination: l,
                                message: n
                            }), r(c)
                        },
                        whenDeliverableTo: l => {
                            const n = () => {
                                const s = P.get(e);
                                if (s?.fingerprint === t && P.has(l)) return Y.toExtensionContext(s.port, {
                                    status: "deliverable",
                                    deliverableTo: l
                                }), !0
                            };
                            if (!n()) {
                                const s = _e(l, n);
                                Pe(t, s)
                            }
                            return r(c)
                        },
                        aboutSessionEnded: l => {
                            const n = P.get(e);
                            return n?.fingerprint === t && Y.toExtensionContext(n.port, {
                                status: "terminated",
                                fingerprint: l
                            }), r(c)
                        }
                    };
                return c
            }
        }),
        lt = ze(),
        ae = nt("background", e => {
            var t;
            if (e.origin.context === "background" && ["content-script", "devtools "].includes(e.destination.context) && !e.destination.tabId) throw new TypeError("When sending messages from background page, use @tabId syntax to target specific tab");
            const r = re(R(R({}, e.origin), e.origin.context === "window" && {
                    context: "content-script"
                })),
                c = re(le(R(R({}, e.destination), e.destination.context === "window" && {
                    context: "content-script"
                }), {
                    tabId: e.destination.tabId || e.origin.tabId
                }));
            e.destination.tabId = null, e.destination.frameId = null;
            const l = () => P.get(c),
                n = () => P.get(r),
                s = () => {
                    var a;
                    j(c).withFingerprint(l().fingerprint).aboutIncomingMessage(e);
                    const g = {
                        message: e,
                        to: l().fingerprint,
                        from: {
                            endpointId: r,
                            fingerprint: (a = n()) == null ? void 0 : a.fingerprint
                        }
                    };
                    e.messageType === "message" && H.add(g), e.messageType === "reply" && H.remove(e.messageID), n() && j(r).withFingerprint(n().fingerprint).aboutSuccessfulDelivery(g)
                };
            (t = l()) != null && t.port ? s() : e.messageType === "message" && (e.origin.context === "background" ? _e(c, s) : n() && j(r).withFingerprint(n().fingerprint).aboutMessageUndeliverability(c, e).and().whenDeliverableTo(c))
        }, e => {
            const t = re(R(R({}, e.origin), e.origin.context === "window" && {
                    context: "content-script"
                })),
                r = P.get(t),
                c = {
                    message: e,
                    to: lt,
                    from: {
                        endpointId: t,
                        fingerprint: r.fingerprint
                    }
                };
            j(t).withFingerprint(r.fingerprint).aboutSuccessfulDelivery(c)
        });
    // Store original sendMessage before override
    const originalSendMessage = ae.sendMessage;
    
    // Convert old message format to new webext-bridge format
    const normalizeDestination = (destination) => {
        if (typeof destination === "object" && destination.context === "content-script" && destination.tabId) {
            return `content-script@${destination.tabId}`;
        }
        return destination;
    };
    
    // Retry wrapper for message sending to handle content-script not ready yet
    const retryMessage = async (messageId, data, destination, maxRetries = 3, delay = 500) => {
        const normalizedDest = normalizeDestination(destination);
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await originalSendMessage.call(ae, messageId, data, normalizedDest);
            } catch (error) {
                if (attempt === maxRetries) {
                    console.warn(`Failed to send message "${messageId}" after ${maxRetries} attempts:`, error.message);
                    throw error;
                }
                const waitTime = delay * attempt;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    };
    
    // Override sendMessage to use retry logic and format conversion
    ae.sendMessage = (messageId, data, destination = "background") => {
        const normalizedDest = normalizeDestination(destination);
        if (normalizedDest !== "background") {
            return retryMessage(messageId, data, destination);
        }
        return originalSendMessage.call(ae, messageId, data, normalizedDest);
    };

    ct.runtime.onConnect.addListener(e => {
        var t;
        const r = qe(e.name);
        if (!r) return;
        r.endpointName || (r.endpointName = re({
            context: "content-script",
            tabId: e.sender.tab.id,
            frameId: e.sender.frameId
        }));
        const {
            tabId: c,
            frameId: l
        } = ge(r.endpointName);
        P.set(r.endpointName, {
            fingerprint: r.fingerprint,
            port: e
        }), (t = z.get(r.endpointName)) == null || t.forEach(n => n()), z.delete(r.endpointName), Pe(r.fingerprint, () => {
            const n = H.entries().filter(s => s.to === r.fingerprint);
            H.remove(n), n.forEach(s => {
                s.from.endpointId === "background" ? ae.endTransaction(s.message.transactionId) : j(s.from.endpointId).withFingerprint(s.from.fingerprint).aboutSessionEnded(r.fingerprint)
            })
        }), e.onDisconnect.addListener(() => {
            var n, s;
            ((n = P.get(r.endpointName)) == null ? void 0 : n.fingerprint) === r.fingerprint && P.delete(r.endpointName), (s = oe.get(r.fingerprint)) == null || s.forEach(a => a()), oe.delete(r.fingerprint)
        }), e.onMessage.addListener(n => {
            var s, a;
            if (n.type === "sync") {
                const g = [...P.values()].map(x => x.fingerprint),
                    f = n.pendingResponses.filter(x => g.includes(x.to));
                H.add(...f), n.pendingResponses.filter(x => !g.includes(x.to)).forEach(x => j(r.endpointName).withFingerprint(r.fingerprint).aboutSessionEnded(x.to)), n.pendingDeliveries.forEach(x => j(r.endpointName).withFingerprint(r.fingerprint).whenDeliverableTo(x));
                return
            }
            n.type === "deliver" && ((a = (s = n.message) == null ? void 0 : s.origin) != null && a.context) && (n.message.origin.tabId = c, n.message.origin.frameId = l, ae.handleMessage(n.message))
        })
    });
    var {
        sendMessage: h,
        onMessage: B
    } = ae;
    st(ae);
    const ue = (e, t) => t.some(r => e instanceof r);
    let Me, Ce;

    function gt() {
        return Me || (Me = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
    }

    function dt() {
        return Ce || (Ce = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey])
    }
    const me = new WeakMap,
        fe = new WeakMap,
        ie = new WeakMap;

    function ut(e) {
        const t = new Promise((r, c) => {
            const l = () => {
                    e.removeEventListener("success", n), e.removeEventListener("error", s)
                },
                n = () => {
                    r(U(e.result)), l()
                },
                s = () => {
                    c(e.error), l()
                };
            e.addEventListener("success", n), e.addEventListener("error", s)
        });
        return ie.set(t, e), t
    }

    function mt(e) {
        if (me.has(e)) return;
        const t = new Promise((r, c) => {
            const l = () => {
                    e.removeEventListener("complete", n), e.removeEventListener("error", s), e.removeEventListener("abort", s)
                },
                n = () => {
                    r(), l()
                },
                s = () => {
                    c(e.error || new DOMException("AbortError", "AbortError")), l()
                };
            e.addEventListener("complete", n), e.addEventListener("error", s), e.addEventListener("abort", s)
        });
        me.set(e, t)
    }
    let pe = {
        get(e, t, r) {
            if (e instanceof IDBTransaction) {
                if (t === "done") return me.get(e);
                if (t === "store") return r.objectStoreNames[1] ? void 0 : r.objectStore(r.objectStoreNames[0])
            }
            return U(e[t])
        },
        set(e, t, r) {
            return e[t] = r, !0
        },
        has(e, t) {
            return e instanceof IDBTransaction && (t === "done" || t === "store") ? !0 : t in e
        }
    };

    function Fe(e) {
        pe = e(pe)
    }

    function ft(e) {
        return dt().includes(e) ? function(...t) {
            return e.apply(he(this), t), U(this.request)
        } : function(...t) {
            return U(e.apply(he(this), t))
        }
    }

    function pt(e) {
        return typeof e == "function" ? ft(e) : (e instanceof IDBTransaction && mt(e), ue(e, gt()) ? new Proxy(e, pe) : e)
    }

    function U(e) {
        if (e instanceof IDBRequest) return ut(e);
        if (fe.has(e)) return fe.get(e);
        const t = pt(e);
        return t !== e && (fe.set(e, t), ie.set(t, e)), t
    }
    const he = e => ie.get(e);

    function ht(e, t, {
        blocked: r,
        upgrade: c,
        blocking: l,
        terminated: n
    } = {}) {
        const s = indexedDB.open(e, t),
            a = U(s);
        return c && s.addEventListener("upgradeneeded", g => {
            c(U(s.result), g.oldVersion, g.newVersion, U(s.transaction), g)
        }), r && s.addEventListener("blocked", g => r(g.oldVersion, g.newVersion, g)), a.then(g => {
            n && g.addEventListener("close", () => n()), l && g.addEventListener("versionchange", f => l(f.oldVersion, f.newVersion, f))
        }).catch(() => {}), a
    }
    const At = ["get", "getKey", "getAll", "getAllKeys", "count"],
        wt = ["put", "add", "delete", "clear"],
        Ae = new Map;

    function De(e, t) {
        if (!(e instanceof IDBDatabase && !(t in e) && typeof t == "string")) return;
        if (Ae.get(t)) return Ae.get(t);
        const r = t.replace(/FromIndex$/, ""),
            c = t !== r,
            l = wt.includes(r);
        if (!(r in (c ? IDBIndex : IDBObjectStore).prototype) || !(l || At.includes(r))) return;
        const n = async function(s, ...a) {
            const g = this.transaction(s, l ? "readwrite" : "readonly");
            let f = g.store;
            return c && (f = f.index(a.shift())), (await Promise.all([f[r](...a), l && g.done]))[0]
        };
        return Ae.set(t, n), n
    }
    Fe(e => ({
        ...e,
        get: (t, r, c) => De(t, r) || e.get(t, r, c),
        has: (t, r) => !!De(t, r) || e.has(t, r)
    }));
    const bt = ["continue", "continuePrimaryKey", "advance"],
        Oe = {},
        we = new WeakMap,
        Le = new WeakMap,
        xt = {
            get(e, t) {
                if (!bt.includes(t)) return e[t];
                let r = Oe[t];
                return r || (r = Oe[t] = function(...c) {
                    we.set(this, Le.get(this)[t](...c))
                }), r
            }
        };
    async function* yt(...e) {
        let t = this;
        if (t instanceof IDBCursor || (t = await t.openCursor(...e)), !t) return;
        t = t;
        const r = new Proxy(t, xt);
        for (Le.set(r, t), ie.set(r, he(t)); t;) yield r, t = await (we.get(r) || t.continue()), we.delete(r)
    }

    function $e(e, t) {
        return t === Symbol.asyncIterator && ue(e, [IDBIndex, IDBObjectStore, IDBCursor]) || t === "iterate" && ue(e, [IDBIndex, IDBObjectStore])
    }
    Fe(e => ({
        ...e,
        get(t, r, c) {
            return $e(t, r) ? yt : e.get(t, r, c)
        },
        has(t, r) {
            return $e(t, r) || e.has(t, r)
        }
    }));
    class X {
        db;
        static instance;
        listeners;
        constructor() {
            this.db = ht("settings-db", 2, {
                upgrade(t) {
                    t.objectStoreNames.contains("settings") || t.createObjectStore("settings", {
                        keyPath: "key"
                    })
                }
            }), this.listeners = new Map
        }
        static getInstance() {
            return X.instance || (X.instance = new X), X.instance
        }
        async getSetting(t) {
            try {
                return (await (await this.db).get("settings", t))?.value
            } catch (r) {
                console.error(`Error retrieving setting "${t}":`, r);
                return
            }
        }
        async setSetting(t, r) {
            try {
                await (await this.db).put("settings", {
                    key: t,
                    value: r
                }), this.notifyListeners(t, r)
            } catch (c) {
                throw console.error(`Error storing setting "${t}":`, c), c
            }
        }
        subscribe(t, r) {
            return this.listeners.has(t) || this.listeners.set(t, new Set), this.listeners.get(t)?.add(r), () => {
                this.listeners.get(t)?.delete(r)
            }
        }
        notifyListeners(t, r) {
            this.listeners.get(t)?.forEach(c => c(r))
        }
    }
    const J = X.getInstance(),
        kt = "http://34.143.152.195:3100/loki/api/v1/push";

    function vt() {
        return `${Date.now()}000000`
    }
    async function Tt({
        BotName: e,
        account: t,
        linkPage: r,
        event: c,
        error_event: l = "",
        status: n,
        error_status: s = "",
        region: a
    }) {
        const g = {
            streams: [{
                stream: {
                    application: "Autorun",
                    BotName: e,
                    linkPage: r,
                    account: t,
                    region: a,
                    event: c,
                    status: n,
                    error_event: l,
                    error_status: s
                },
                values: [
                    [vt(), `Bot[${e}] account[${t}] event[${c}] page[${r}] status[${n}]` + (s ? ` error_status[${s}]` : "") + (l ? ` error_event[${l}]` : "")]
                ]
            }]
        };
        try {
            const f = await fetch(kt, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(g)
            });
            if (f.ok) console.log(`Log sent successfully for ${e} - Status: ${n}`);
            else {
                const x = await f.text();
                console.error(`Failed to send log to Loki. Status: ${f.status} ${f.statusText}`, x)
            }
        } catch (f) {
            console.error("Network or other error sending log to Loki:", f.message)
        }
    }
    async function Z(e, t, r = {}) {
        try {
            const c = await J.getSetting("email") || "unknown",
                l = await J.getSetting("username") || r.username || "";
            await Tt({
                BotName: c,
                account: l,
                linkPage: r.linkPage || "background_context",
                event: t,
                status: "failure",
                region: r.region ?? "",
                error_event: e.name || "Error",
                error_status: e.message || String(e)
            })
        } catch (c) {
            console.error("CRITICAL: Failed to send log to Loki.", c)
        }
    }
    const Et = "https://hoarder-backend-api-889965658265.asia-southeast1.run.app",
        St = "nC7ZtAMzaXiLfWsIkhav1oGwtKXXN+Sy0434Tmv/XsE=",
        It = "1.4.1",
        _t = 1,
        Pt = "id",
        Mt = "Product Page";
    class q {
        static instance;
        constructor() {}
        static getInstance() {
            return q.instance || (q.instance = new q), q.instance
        }
        async fetchTasks(t, r = {}) {
            for (let l = 1; l <= 3; l++) try {
                const n = await J.getSetting("email");
                if (!n) throw new Error("Email not configured. Please check your authentication.");
                const s = r.limit || _t,
                    a = r.region || Pt,
                    g = r.task_type || Mt,
                    f = new URL(Et + "/scraping-tasks");
                f.searchParams.append("api_key", St || "nC7ZtAMzaXiLfWsIkhav1oGwtKXXN+Sy0434Tmv/XsE="), f.searchParams.append("email", n), f.searchParams.append("limit", s.toString()), f.searchParams.append("region", a), f.searchParams.append("task_type", g), f.searchParams.append("version", It || "unknown"), console.log("Fetching tasks from:", f.toString());
                const x = await fetch(f, {
                    method: "GET",
                    headers: {
                        Accept: "application/json"
                    }
                });
                if (!x.ok) throw new Error(x.status.toString());
                const v = await x.json(),
                    I = v.scraping_tasks || [];
                return I.length > 0 && (l = 3), {
                    tasks: I,
                    config: v.config
                }
            } catch (n) {
                if (console.error(`Attempt ${l} failed:`, n), l === 3) {
                    console.error("All fetch attempts failed."), await Z(n, "Fetching Task", {
                        linkPage: void 0,
                        region: r.region,
                        username: t
                    });
                    const s = n instanceof Error ? n.message : String(n);
                    return {
                        tasks: [],
                        config: {
                            delay_min: 0,
                            delay_max: 0
                        },
                        error: `Failed to fetch tasks: ${s==="404"?" No task available":" Server error or network issue"}`
                    }
                }
                await new Promise(s => setTimeout(s, 3e3 * l))
            }
            return {
                tasks: [],
                config: {
                    delay_min: 0,
                    delay_max: 0
                },
                error: "Failed to fetch tasks after multiple attempts"
            }
        }
    }
    const Ne = q.getInstance(),
        N = {
            id: "https://shopee.co.id",
            my: "https://shopee.com.my",
            ph: "https://shopee.ph",
            sg: "https://shopee.sg",
            th: "https://shopee.co.th",
            vn: "https://shopee.vn"
        };

    function Ct(e) {
        try {
            const r = new URL(e).hostname.split(".");
            if (r[0] !== "shopee") return r[0] === "shop-id" && r[1] === "tokopedia" ? "id" : null;
            if (r.length >= 2) return r[r.length - 1]
        } catch (t) {
            return console.error("Invalid URL:", t), null
        }
        return null
    }
    const K = async () => {
        try {
            const t = (await $.tabs.query({
                active: !0,
                currentWindow: !0
            })).find(c => c.url?.includes("shopee") || c.url?.includes("tokopedia"));
            if (console.log("Active eligible tab found:", t), t) return t;
            const r = await $.tabs.query({
                url: ["*://*.shopee.co.id/*", "*://*.shopee.com.my/*", "*://*.shopee.ph/*", "*://*.shopee.sg/*", "*://*.shopee.co.th/*", "*://*.shopee.vn/*", "*://shop-id.tokopedia.com/*"]
            });
            return console.log("Found eligible tabs:", r), r[0] || null
        } catch (e) {
            return console.error("Error finding eligible tab:", e), null
        }
    }, Re = "https://hoarder-backend-api-889965658265.asia-southeast1.run.app", Be = "1.4.1", je = "nC7ZtAMzaXiLfWsIkhav1oGwtKXXN+Sy0434Tmv/XsE=";
    async function Ft(e) {
      // --- DIRECT TRANSMISSION TO PRIMARY BACKEND ---
      try {
        const t =
            Re + `/intercepted-response?api_key=${encodeURIComponent(je)}`,
          r = await fetch(t, {
            method: "POST",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...e.payload,
              key: Be,
            }),
          });
        return {
          ok: r.ok,
          status: r.status,
        };
      } catch (t) {
        return (
          console.error("Webhook error:", t),
          {
            ok: !1,
            status: 500,
            error: t instanceof Error ? t.message : String(t),
          }
        );
      }
    }
    async function Dt(e) {
      try {
        const t = Re + `/content-scrape?api_key=${encodeURIComponent(je)}`,
          r = await fetch(t, {
            method: "POST",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...e.payload,
              key: Be,
            }),
          });
        return {
          ok: r.ok,
          status: r.status,
        };
      } catch (t) {
        return (
          console.error("Webhook error:", t),
          {
            ok: !1,
            status: 500,
            error: t instanceof Error ? t.message : String(t),
          }
        );
      }
    }
    const Ot = Ue(() => {
        let n = !1, // isFetching: whether we're fetching tasks from backend
          s, // setTimeout ID
          a = !1, // uiVisible: whether popup is visible
          g = new Set(), // activeTabsFetching: tabs currently being processed
          f = !1, // isExecuting: whether a task is currently executing (NEW FLAG)
          taskExecutionActive = !1, // Track if task execution is in progress
          taskCounter = 0; // Counter for micro-bursting rhythm

        // Enhanced randomization function with wider variance
        const x = (d, u) => Math.floor(Math.random() * (u - d + 1)) + d;

        // Anti-detection utilities
        const AntiDetection = {
          _cachedHeaders: null,

          // Clamp backend delays to local 3-8s range for optimized execution
          clampDelayConfig: (config) => {
            const MIN_DELAY = 3000; // 3 seconds (optimized)
            const MAX_DELAY = 8000; // 8 seconds (optimized)

            let delay_min = config.delay_min || MIN_DELAY;
            let delay_max = config.delay_max || MAX_DELAY;

            // Ensure minimum is at least MIN_DELAY
            if (delay_min < MIN_DELAY) delay_min = MIN_DELAY;
            // Ensure maximum is at most MAX_DELAY
            if (delay_max > MAX_DELAY) delay_max = MAX_DELAY;
            // Ensure min doesn't exceed max after clamping
            if (delay_min > delay_max) delay_min = delay_max = MAX_DELAY;

            console.log(
              `[Delay Clamping] Backend: ${config.delay_min}ms-${config.delay_max}ms → Local: ${delay_min}ms-${delay_max}ms`,
            );

            return {
              ...config,
              delay_min: delay_min,
              delay_max: delay_max,
            };
          },

          // Generate random delays with adaptive variance (optimized: 3-8s baseline)
          randomDelay: (min, max) => {
            const variance = Math.random();
            if (variance < 0.1) {
              // 10% chance of extended pause (think time)
              return x(max * 1.2, max * 1.8);
            } else if (variance < 0.2) {
              // 10% chance of quick action
              return x(min * 0.5, min * 0.8);
            }
            // 80% normal adaptive range - optimized for speed
            return x(Math.max(3000, min * 0.6), Math.min(8000, max * 0.6));
          },

          // Generate randomized request headers to avoid fingerprinting (sticky per session)
          getRandomHeaders: () => {
            if (AntiDetection._cachedHeaders) return AntiDetection._cachedHeaders;

            const userAgents = [
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            ];

            AntiDetection._cachedHeaders = {
              "User-Agent":
                userAgents[Math.floor(Math.random() * userAgents.length)],
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": [
                "en-US,en;q=0.9",
                "en-GB,en;q=0.8",
                "id-ID,id;q=0.9",
              ][Math.floor(Math.random() * 3)],
              "Accept-Encoding": "gzip, deflate, br",
              DNT: Math.random() > 0.5 ? "1" : "0",
              "Cache-Control": ["max-age=0", "no-cache", "no-store"][
                Math.floor(Math.random() * 3)
              ],
              Pragma: Math.random() > 0.5 ? "no-cache" : "cache",
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": Math.random() > 0.7 ? "cross-site" : "none",
            };

            return AntiDetection._cachedHeaders;
          },

          // Apply sticky headers rule using declarativeNetRequest
          applyStickyHeadersRule: async function() {
            const headers = AntiDetection.getRandomHeaders();
            const requestHeaders = Object.entries(headers).map(([key, val]) => ({
              header: key,
              operation: 'set',
              value: val
            }));

            await chrome.declarativeNetRequest.updateDynamicRules({
              removeRuleIds: [999],
              addRules: [{
                id: 999,
                priority: 1,
                action: {
                  type: 'modifyHeaders',
                  requestHeaders: requestHeaders
                },
                condition: {
                  urlFilter: '*://*.shopee.*/*',
                  resourceTypes: ['main_frame', 'xmlhttprequest']
                }
              }]
            });
          },

          // Variable scroll behavior to avoid bot detection
          getScrollParams: () => {
            const scrollConfig = {
              minScrolls: x(3, 8),
              maxScrolls: x(8, 15),
              minPause: x(500, 2000),
              maxPause: x(3000, 8000),
              useSmooth: Math.random() > 0.3,
            };
            return scrollConfig;
          },

          // Add random think time between actions
          thinkTime: async (baseMin = 500, baseMax = 2000) => {
            const randomFactor = Math.random();
            let delay;

            if (randomFactor < 0.05) {
              // 5% chance of extended thinking time (still reasonable)
              delay = x(baseMax * 1.5, baseMax * 2.5);
            } else if (randomFactor < 0.15) {
              // 10% chance of very quick action
              delay = x(baseMin * 0.4, baseMin * 0.8);
            } else {
              delay = x(baseMin, baseMax);
            }

            console.log(`[Anti-Detection] Think time (optimized): ${delay}ms`);
            return new Promise((resolve) => setTimeout(resolve, delay));
          },

          // Region-specific safety settings
          getRegionSafetyMultiplier: (region) => {
            const safetyMap = {
              id: 1.0, // Indonesia - baseline
              my: 1.1, // Malaysia - slightly slower
              ph: 1.0, // Philippines - baseline
              sg: 1.2, // Singapore - more aggressive detection
              th: 1.1, // Thailand - slightly slower
              vn: 1.0, // Vietnam - baseline
            };
            return safetyMap[region] || 1.0;
          },
        };

        // Apply sticky headers on startup
        AntiDetection.applyStickyHeadersRule();

        // Browsing Patterns - simulate realistic user behavior before tasks (optimized)
        const BrowsingPatterns = {
          browsedCount: 0,
          getRandomBrowsingAction: (region) => {
            // Skip pre-browsing after first task to save time
            if (BrowsingPatterns.browsedCount > 0 && Math.random() > 0.3) {
              return null;
            }

            const rand = Math.random();
            let action,
              delay,
              url = N[region];

            if (rand < 0.2) {
              // 20% - Visit homepage and scroll
              action = "homepage_scroll";
              delay = x(2500, 5000); // Reduced from 5-10s
            } else if (rand < 0.5) {
              // 30% - Browse category pages
              action = "category_browse";
              delay = x(3000, 6000); // Reduced from 6-12s
            } else if (rand < 0.7) {
              // 20% - Search for random product
              action = "search";
              delay = x(2000, 4000); // Reduced from 4-8s
            } else {
              // 30% - Direct to task (no pre-browsing)
              return null;
            }

            BrowsingPatterns.browsedCount++;
            return { action, delay, url };
          },

          executeBrowsingPattern: async (action, url, tabId) => {
            if (!action) return; // No browsing pattern

            try {
              console.log(`[BrowsingPattern] Executing: ${action}`);

              switch (action) {
                case "homepage_scroll":
                  await h(
                    "clickUrl",
                    { url: url },
                    `content-script@${tabId}`,
                  ).catch(() => {});
                  await new Promise((resolve) =>
                    setTimeout(resolve, x(1000, 2000)),
                  );
                  await h(
                    "performRandomScroll",
                    {},
                    `content-script@${tabId}`,
                  ).catch(() => {});
                  break;

                case "category_browse":
                  const categories = [
                    "/search?keyword=shop",
                    "/search?keyword=product",
                  ];
                  const categoryUrl =
                    url +
                    categories[Math.floor(Math.random() * categories.length)];
                  await h(
                    "clickUrl",
                    { url: categoryUrl },
                    `content-script@${tabId}`,
                  ).catch(() => {});
                  await new Promise((resolve) =>
                    setTimeout(resolve, x(1500, 2500)),
                  );
                  break;

                case "search":
                  const searchUrl = url + "/search?keyword=product";
                  await h(
                    "clickUrl",
                    { url: searchUrl },
                    `content-script@${tabId}`,
                  ).catch(() => {});
                  await new Promise((resolve) =>
                    setTimeout(resolve, x(1000, 2000)),
                  );
                  break;
              }
            } catch (e) {
              console.error(`[BrowsingPattern] Error: ${e.message}`);
            }
          },
        };

        // Account Rotation Manager
        const AccountManager = {
          accountCount: 5, // Number of accounts to rotate through
          taskCountPerAccount: {},
          currentAccountIndex: 0,
          maxTasksPerAccount: 8, // Switch account after 8 tasks
          switchThresholdTime: 120 * 60 * 1000, // 2 hours
          accountStartTime: {},

          initializeAccounts: () => {
            for (let i = 1; i <= AccountManager.accountCount; i++) {
              AccountManager.taskCountPerAccount[i] = 0;
              AccountManager.accountStartTime[i] = Date.now();
            }
            console.log(
              `[AccountManager] Initialized ${AccountManager.accountCount} accounts`,
            );
          },

          getNextAccount: async () => {
            const currentAccount = AccountManager.currentAccountIndex + 1;
            const taskCount =
              AccountManager.taskCountPerAccount[currentAccount] || 0;
            const timeElapsed =
              Date.now() -
              (AccountManager.accountStartTime[currentAccount] || Date.now());

            // Check if need to rotate
            if (
              taskCount >= AccountManager.maxTasksPerAccount ||
              timeElapsed > AccountManager.switchThresholdTime
            ) {
              console.log(
                `[AccountManager] Account ${currentAccount} reached limit (${taskCount} tasks, ${Math.round(timeElapsed / 1000)}s). Rotating...`,
              );
              AccountManager.currentAccountIndex =
                (AccountManager.currentAccountIndex + 1) %
                AccountManager.accountCount;
              AccountManager.taskCountPerAccount[
                AccountManager.currentAccountIndex + 1
              ] = 0;
              AccountManager.accountStartTime[
                AccountManager.currentAccountIndex + 1
              ] = Date.now();
            }

            const nextAccount = AccountManager.currentAccountIndex + 1;
            console.log(
              `[AccountManager] Using account ${nextAccount} (${AccountManager.taskCountPerAccount[nextAccount]} tasks)`,
            );
            return nextAccount;
          },

          recordTaskCompletion: async (accountNum) => {
            AccountManager.taskCountPerAccount[accountNum] =
              (AccountManager.taskCountPerAccount[accountNum] || 0) + 1;
            console.log(
              `[AccountManager] Account ${accountNum}: ${AccountManager.taskCountPerAccount[accountNum]} tasks completed`,
            );
          },
        };

        // Account rotation disabled - using separate Chrome profiles instead
        // AccountManager.initializeAccounts();

        async function v(d) {
          const { isCaptcha: u } = await h(
            "checkCaptchaSelector",
            {},
            {
              context: "content-script",
              tabId: d,
            },
          );
          return u;
        }
        const I = (d, u) =>
          [`${u}/verify/`, `${u}/buyer/login`, `${u}/whodunit`].some((w) =>
            d?.includes(w),
          );
        async function k(d) {
          const m = (
            await $.tabs.create({
              url: N[d],
            })
          ).id;
          setTimeout(async () => {
            (
              await $.tabs.query({
                currentWindow: !0,
              })
            ).filter((i) => i.url?.includes(N[d])).length > 1 &&
              typeof m < "u" &&
              (await $.tabs.remove(m));
          }, 2e3);
        }
        const y = (d) => {
          const u = Math.random();
          let m = N[d],
            w = "home_page";
          return (
            u < 0.12
              ? ((m = `${N[d].replace(/\/$/, "")}/user/voucher-wallet`),
                (w = "voucher_page"))
              : Math.random() > 0.5 &&
                ((m = `${N[d].replace(/\/$/, "")}/cart`), (w = "cart_page")),
            {
              tasks: [
                {
                  id: 1,
                  expected_url: m,
                  task_type: w,
                  status: "queued",
                  expiry: "",
                  key: "",
                  priority: 1,
                },
              ],
              config: {
                delay_min: Math.round(5e3), // 5 seconds minimum (adaptive)
                delay_max: Math.round(15e3), // 15 seconds maximum (adaptive)
              },
            }
          );
        };
        async function _(d, u, m, w) {
          try {
            // Increment task counter for micro-bursting
            taskCounter++;

            // Calculate delay based on micro-bursting rhythm
            let delayMin, delayMax;
            if (taskCounter <= 4) {
              // Burst phase: 1-4 tasks with 800-1500ms delays
              delayMin = 800;
              delayMax = 1500;
            } else {
              // Breath phase: 5th task with 15000-20000ms delay, then reset counter
              delayMin = 15000;
              delayMax = 20000;
              taskCounter = 0; // Reset counter after breath
            }

            const o = x(delayMin, delayMax),
              i = `Processing task with ${o}ms delay (burst ${taskCounter + 1}/5)...`;
            if (a) {
              await h(
                "updateMessage",
                {
                  message: i,
                },
                {
                  context: "content-script",
                  tabId: u,
                },
              ).catch((A) => {});
              console.log(i);
            }
            taskExecutionActive = !0;
            await new Promise((A, p) => {
              s = setTimeout(() => {
                A(void 0);
              }, o);
            });
            console.log(`Task processed: ${d.expected_url}`);
            await h(
              "clickUrl",
              {
                url: d.expected_url,
              },
              {
                context: "content-script",
                tabId: u,
              },
            ).catch(async (A) => {
              console.log(
                "Content script port closed or unreachable. Forcing navigation via chrome.tabs.update",
              );
              if (u) {
                try {
                  await chrome.tabs.update(u, { url: d.expected_url });
                } catch (err) {
                  console.error("Forced navigation also failed:", err);
                }
              }
            });
          } catch (o) {
            console.error("Process task failed:", o);
            const i = o instanceof Error ? o.message : String(o);
            throw (
              await h(
                "updateMessage",
                {
                  message: `${i}`,
                },
                {
                  context: "content-script",
                  tabId: u,
                },
              ).catch((A) => {}),
              await Z(o, "Process Task", {
                linkPage: d.expected_url,
                region: O,
                username: C,
              }),
              o
            );
          } finally {
            s = void 0;
            taskExecutionActive = !1;
          }
        }
        async function S(d) {
          if ((await new Promise((u) => setTimeout(u, 2e3)), a && n)) {
            const u = await K();
            if (!u?.id) return;
            const m = u.id;
            if (
              (await h(
                "updateMessage",
                {
                  message: "Starting task initialization...",
                },
                {
                  context: "content-script",
                  tabId: m,
                },
              ).catch((o) => {}),
              console.log("Initializing tasks for region:", d),
              await v(m))
            ) {
              if ((await J.getSetting("captchaSolverEnabled")) !== !0) {
                (console.log("Captcha detected but solver is disabled."),
                  (n = !1),
                  await chrome.storage.local.set({ isFetching: false }),
                  (a = !1),
                  await h(
                    "updateFetchingStatus",
                    {
                      isFetching: !1,
                    },
                    {
                      context: "content-script",
                      tabId: m,
                    },
                  ).catch((i) => {}),
                  await h(
                    "updateMessage",
                    {
                      message:
                        "Captcha detected but solver is disabled. Please solve manually or enable captcha solver in settings.",
                    },
                    {
                      context: "content-script",
                      tabId: m,
                    },
                  ).catch((i) => {}),
                  await h(
                    "refreshPage",
                    {},
                    {
                      context: "content-script",
                      tabId: m,
                    },
                  ).catch((i) => {}));
                return;
              }
              if (
                (await h(
                  "updateMessage",
                  {
                    message: "Captcha page detected. Attempting to solve...",
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((i) => {}),
                await h(
                  "solveCaptcha",
                  {},
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((i) => {}),
                await new Promise((i) => setTimeout(i, 6e4)),
                await v(m))
              ) {
                ((n = !1),
                  await chrome.storage.local.set({ isFetching: false }),
                  (a = !1),
                  await h(
                    "updateFetchingStatus",
                    {
                      isFetching: !1,
                    },
                    {
                      context: "content-script",
                      tabId: m,
                    },
                  ).catch((i) => {}),
                  await h(
                    "updateMessage",
                    {
                      message:
                        "Still blocked after attempt. Please solve manually.",
                    },
                    {
                      context: "content-script",
                      tabId: m,
                    },
                  ).catch((i) => {}));
                return;
              }
            }
            const w = await Ne.fetchTasks(C, {
              task_type: "tiktokpdp",
            });

            // Apply delay clamping to ensure backend never forces delays > 15s
            if (w.config) {
              w.config = AntiDetection.clampDelayConfig(w.config);
            }

            if ((console.log("Fetched tasks:", w.tasks), w.error)) {
              ((n = !1),
                await chrome.storage.local.set({ isFetching: false }),
                (a = !1),
                await h(
                  "updateFetchingStatus",
                  {
                    isFetching: !1,
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((o) => {}),
                await h(
                  "updateMessage",
                  {
                    message: `ÔØî ${w.error}`,
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((o) => {}));
              return;
            }
            if (w.tasks.length > 0 && a && n) {
              await h(
                "updateCurrentTask",
                {
                  task: w.tasks[0].expected_url,
                },
                {
                  context: "content-script",
                  tabId: m,
                },
              ).catch((A) => {});

              const o = Math.max(0, Math.round(w.config.delay_min / 4)),
                i = Math.max(o, Math.round(w.config.delay_max / 4));
              await _(w.tasks[0], m, o, i);
            } else
              ((n = !1),
                await chrome.storage.local.set({ isFetching: false }),
                (a = !1),
                await h(
                  "updateFetchingStatus",
                  {
                    isFetching: !1,
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((o) => {}));
          }
        }
        async function W(d) {
          await new Promise((i) => setTimeout(i, 2e3));
          const u = await K();
          if (!u?.id) {
            await k(d);
            return;
          }
          const m = u.id,
            w = u.url || "";
          if (
            (await h(
              "updateMessage",
              {
                message: "Starting task initialization...",
              },
              {
                context: "content-script",
                tabId: m,
              },
            ).catch((i) => {}),
            console.log("Initializing tasks for region:", d),
            I(w, N[d]))
          ) {
            if (!u.url?.includes("captcha")) {
              ((n = !1),
                await chrome.storage.local.set({ isFetching: false }),
                (a = !1),
                await h(
                  "updateFetchingStatus",
                  {
                    isFetching: !1,
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((p) => {}),
                await h(
                  "updateMessage",
                  {
                    message: "Blocked page detected. Process stopped.",
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((p) => {}));
              return;
            }
            if ((await J.getSetting("captchaSolverEnabled")) !== !0) {
              ((n = !1),
                await chrome.storage.local.set({ isFetching: false }),
                (a = !1),
                await h(
                  "updateFetchingStatus",
                  {
                    isFetching: !1,
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((p) => {}),
                await h(
                  "updateMessage",
                  {
                    message:
                      "Captcha detected but solver is disabled. Please solve manually or enable captcha solver in settings.",
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((p) => {}));
              return;
            }
            (await h(
              "updateMessage",
              {
                message: "Captcha page detected. Attempting to solve...",
              },
              {
                context: "content-script",
                tabId: m,
              },
            ).catch((p) => {}),
              await h(
                "solveCaptcha",
                {},
                {
                  context: "content-script",
                  tabId: m,
                },
              ).catch((p) => {}),
              await new Promise((p) => setTimeout(p, 6e4)));
            const A = await $.tabs.get(m);
            if (I(A.url || "", N[d])) {
              ((n = !1),
                await chrome.storage.local.set({ isFetching: false }),
                (a = !1),
                await h(
                  "updateFetchingStatus",
                  {
                    isFetching: !1,
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((p) => {}),
                await h(
                  "updateMessage",
                  {
                    message:
                      "Still blocked after attempt. Please solve manually.",
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((p) => {}));
              return;
            }
          }
          const o =
            Math.random() > 0.15
              ? await Ne.fetchTasks(C, {
                  region: d,
                })
              : y(d);

          // Apply delay clamping to ensure backend never forces delays > 15s
          if (o.config) {
            o.config = AntiDetection.clampDelayConfig(o.config);
          }

          if ((console.log("Fetched tasks:", o.tasks), o.error)) {
            ((n = !1),
              await chrome.storage.local.set({ isFetching: false }),
              (a = !1),
              await h(
                "updateFetchingStatus",
                {
                  isFetching: !1,
                },
                {
                  context: "content-script",
                  tabId: m,
                },
              ).catch((i) => {}),
              await h(
                "updateMessage",
                {
                  message: `ÔØî ${o.error}`,
                },
                {
                  context: "content-script",
                  tabId: m,
                },
              ).catch((i) => {}));
            return;
          }
          if (o.tasks.length > 0) {
            (await h(
              "updateCurrentTask",
              {
                task: o.tasks[0].expected_url,
              },
              {
                context: "content-script",
                tabId: m,
              },
            ).catch((i) => {}),
              a &&
                (await h(
                  "updateMessage",
                  {
                    message: "Performing random scroll...",
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((i) => {})),
              (f = !0),
              await h(
                "performRandomScroll",
                {},
                {
                  context: "content-script",
                  tabId: m,
                },
              ),
              a &&
                (await h(
                  "updateMessage",
                  {
                    message: "Random scroll completed.",
                  },
                  {
                    context: "content-script",
                    tabId: m,
                  },
                ).catch((i) => {})));
            try {
              await _(o.tasks[0], m, o.config.delay_min, o.config.delay_max);
            } finally {
              f = !1;
            }
          } else
            ((n = !1),
              await chrome.storage.local.set({ isFetching: false }),
              (a = !1),
              await h(
                "updateMessage",
                {
                  message: "No tasks available.",
                },
                {
                  context: "content-script",
                  tabId: m,
                },
              ).catch((i) => {}),
              await h(
                "updateFetchingStatus",
                {
                  isFetching: !1,
                },
                {
                  context: "content-script",
                  tabId: m,
                },
              ).catch((i) => {}));
        }
        (B("startTaskFetching", async ({ data: d }) => {
          a = !0;
          const { region: u } = d;
          if (((O = u), n))
            return (
              console.log("Already fetching, request ignored."),
              {
                status: "Already fetching",
              }
            );
          const m = await K();
          if (!m?.id)
            return (
              console.log("No Shopee tab found, opening homepage."),
              await k(u),
              {
                status: "No Shopee tab found, homepage opened",
              }
            );
          if (m.url?.includes("tokopedia")) {
            (console.log(
              "Detected Tokopedia tab for ID region, initializing TikTok tasks.",
            ),
              (n = !0),
              await chrome.storage.local.set({ isFetching: true }));
            try {
              return (
                await S("id"),
                {
                  status: "Tokopedia tab detected, initializing TikTok tasks",
                }
              );
            } catch (w) {
              console.error("Task fetching failed:", w);
              const o = w instanceof Error ? w.message : String(w);
              return (
                await Z(o, "Initialize Task", {
                  region: O,
                  username: C,
                }),
                {
                  status: "error",
                  message: o,
                }
              );
            }
          } else {
            if (!N[u])
              return (
                console.error("Invalid Shopee region:", u),
                {
                  status: "error",
                  message: "Invalid Shopee region",
                }
              );
            (console.log(`Starting task fetching for region: ${u}`),
              (n = !0),
              await chrome.storage.local.set({ isFetching: true }));
            try {
              return (
                await W(u),
                {
                  status: "Task fetching completed",
                }
              );
            } catch (w) {
              console.error("Task fetching failed:", w);
              const o = w instanceof Error ? w.message : String(w);
              return (
                await Z(o, "Initialize Task", {
                  region: O,
                  username: C,
                }),
                {
                  status: "error",
                  message: o,
                }
              );
            }
          }
        }),
          B("stopTaskFetching", async () => {
            (s && (clearTimeout(s), (s = void 0)),
              (n = !1),
              await chrome.storage.local.set({ isFetching: false }),
              (a = !1),
              (taskExecutionActive = !1),
              (taskCounter = 0),
              await new Promise((u) => setTimeout(u, 500)),
              g.clear());
            const d = await K();
            return (
              d?.id &&
                (await h(
                  "updateMessage",
                  {
                    message: "Task processing is stopped",
                  },
                  {
                    context: "content-script",
                    tabId: d.id,
                  },
                ).catch((u) => {}),
                await h(
                  "updateCurrentTask",
                  {
                    task: null,
                  },
                  {
                    context: "content-script",
                    tabId: d.id,
                  },
                ).catch((u) => {}),
                await h(
                  "updateFetchingStatus",
                  {
                    isFetching: !1,
                  },
                  {
                    context: "content-script",
                    tabId: d.id,
                  },
                ).catch((u) => {})),
              console.log("All task processing stopped."),
              {
                status: "All processes stopped",
              }
            );
          }),
          B("getBackgroundState", async () => {
            const state = await chrome.storage.local.get({ isFetching: false });
            console.log("Fetching background state:", {
              isFetching: state.isFetching,
            });
            return {
              isFetching: state.isFetching,
            };
          }),
          $.tabs.onUpdated.addListener(async (d, u, m) => {
            if (
              n &&
              a &&
              u.status === "complete" &&
              m.url?.includes("shopee") &&
              !g.has(d) &&
              !f
            ) {
              g.add(d);
              try {
                const w = Ct(m.url);
                w && (await W(w));
              } finally {
                g.delete(d);
              }
            } else if (
              n &&
              a &&
              u.status === "complete" &&
              m.url?.includes("tokopedia") &&
              !g.has(d) &&
              !f
            ) {
              g.add(d);
              try {
                await S("id");
              } finally {
                g.delete(d);
              }
            }
          }),
          B("webhook", async ({ data: d }) => await Ft(d)),
          B("webhookTiktok", async ({ data: d }) => await Dt(d)),
          $.runtime.onStartup.addListener(async () => {
            ((n = !1), (a = !1), g.clear());
            await chrome.storage.local.set({ isFetching: false });
            const d = await K();
            d?.id &&
              h(
                "updateFetchingStatus",
                {
                  isFetching: n,
                },
                {
                  context: "content-script",
                  tabId: d.id,
                },
              ).catch((u) => {});
          }),
          $.runtime.onInstalled.addListener(async () => {
            ((n = !1), (a = !1), g.clear());
            await chrome.storage.local.set({ isFetching: false });
            const d = await K();
            d?.id &&
              h(
                "updateFetchingStatus",
                {
                  isFetching: n,
                },
                {
                  context: "content-script",
                  tabId: d.id,
                },
              ).catch((u) => {});
          }));
        let O = "id",
          C = "";
        (B("reportRegion", ({ data: d }) => {
          const u = d;
          u &&
            ((O = u),
            console.log(`Background updated last known region to: ${u}`));
        }),
          B("reportUsername", ({ data: d }) => {
            const u = d;
            u &&
              ((C = u),
              console.log(`Background updated last known username to: ${u}`));
          }),
          B("reportError", async ({ data: d }) => {
            try {
              const { error: u, event: m, context: w } = d;
              return (
                await Z(u, m, w),
                {
                  status: "Error logged",
                }
              );
            } catch (u) {
              return (
                console.error("Failed to log error:", u),
                {
                  status: "Error logging failed",
                  error: String(u),
                }
              );
            }
          }),
          B("keepAlivePing", () => true));
    });

    function Nt() {}

    function ce(e, ...t) {}
    const Lt = {
        debug: (...e) => ce(console.debug, ...e),
        log: (...e) => ce(console.log, ...e),
        warn: (...e) => ce(console.warn, ...e),
        error: (...e) => ce(console.error, ...e)
    };
    let be;
    try {
        be = Ot.main(), be instanceof Promise && console.warn("The background's main() function return a promise, but it must be synchronous")
    } catch (e) {
        throw Lt.error("The background crashed on startup!"), e
    }
    return be
}();
background;
