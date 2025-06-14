(function() {
        function addScript({async, defer, name, src, ucStates, id, data, loadEventName}) {
            try {
                if (src && typeof src === 'string') {
                    const script = document.createElement('script');
                    script.src = src;
                    script.dataset.uid = name;
                    script.async = async;
                    script.defer = defer;
                    script.onload = () => {
                        window.dispatchEvent(new CustomEvent((loadEventName || name) + '.loaded'));
                    }
                    ;
                    if (id) {
                        script.id = id;
                    }
                    if (data && typeof data === 'object') {
                        Object.keys(data).forEach(key => script.dataset[key] = data[key]);
                    }
                    if (ucStates && ucStates.length) {
                        script.name = name;
                        WBD.UserConsent.addScriptElement(script, ucStates, document.head);
                    } else {
                        document.head.appendChild(script);
                    }
                }
            } catch (e) {
                console.error('ExternalScripts: error adding script "' + name + '"', e);
            }
        }
        ;//snippet: user-consent
        !function(e, t) {
            "use strict";
            function n(t) {
                if (t && t.detail && e.zion_analytics && e.zion_analytics.isReady && e.ZION_SDK && e.ZION_SDK.V2) {
                    let n = 9
                      , s = "Blocked";
                    t.detail.code && (n = t.detail.code,
                    s = t.detail.msg || "Unknown error"),
                    e.zion_analytics.track(new ZION_SDK.V2.ConsentError({
                        consent_error_code: n,
                        consent_error_message: s,
                        consent_region: t.detail.region,
                        consent_version: t.detail.otVers + "|" + e.WBD.UserConsent.getVersion() + "||"
                    }))
                }
            }
            t.addEventListener("userConsentChanged", (function(t) {
                t && t.detail && e.zion_analytics && e.zion_analytics.isReady && e.ZION_SDK && e.ZION_SDK.V2 && e.zion_analytics.track(new ZION_SDK.V2.DeviceChangedConsentPreferences({
                    consent_id: t.detail.otId,
                    consent_interaction: t.detail.otIact,
                    consent_gpc_active: t.detail.gpcActive,
                    consent_region: t.detail.region,
                    consent_state: e.WBD.UserConsent.getSimpleConsentState(),
                    consent_version: t.detail.otVers + "|" + e.WBD.UserConsent.getVersion() + "|GPP" + t.detail.gppVers + "|TCF" + t.detail.tcfVers
                }))
            }
            ), !1),
            t.addEventListener("oneTrustFailed", n, !1),
            t.addEventListener("oneTrustBlocked", n, {
                once: !0
            }),
            e.location && e.location.hostname && e.WBD.UserConsentConfig && e.WBD.UserConsentConfig.domId && (0 === e.location.hostname.search(/^(?:www|us|edition|cnnespanol|cnne-stage|lite|dev-lite|(?:develop\.)?arabic)\.cnn\.com$/i) || e.location.hostname.search(/stage\d?\.cnn\.com$/i) >= 0 ? e.WBD.UserConsentConfig.src = "/wbdot" : e.WBD.UserConsentConfig.src = "https://us.cnn.com/wbdot",
            e.WBD.UserConsentConfig.src += (e.WBD.UserConsentConfig.domId.startsWith("0c1") ? "s" : "p") + "/scripttemplates/otSDKStub.js"),
            function() {
                var n, s, i;
                !function(e) {
                    e.STUB = "stub",
                    e.LOADING = "loading",
                    e.LOADED = "loaded",
                    e.ERROR = "error"
                }(n || (n = {})),
                function(e) {
                    e.VISIBLE = "visible",
                    e.HIDDEN = "hidden",
                    e.DISABLED = "disabled"
                }(s || (s = {}));
                class o {
                    constructor(e, t, n, s) {
                        this.eventName = e,
                        this.listenerId = t,
                        this.data = n,
                        this.pingData = s
                    }
                }
                class r {
                    constructor(e) {
                        this.gppVersion = e.gppVersion,
                        this.cmpStatus = e.cmpStatus,
                        this.cmpDisplayStatus = e.cmpDisplayStatus,
                        this.signalStatus = e.signalStatus,
                        this.supportedAPIs = e.supportedAPIs,
                        this.cmpId = e.cmpId,
                        this.sectionList = e.gppModel.getSectionIds(),
                        this.applicableSections = e.applicableSections,
                        this.gppString = e.gppModel.encode(),
                        this.parsedSections = e.gppModel.toObject()
                    }
                }
                class a {
                    constructor(t) {
                        this.eventQueue = new Map,
                        this.queueNumber = 1e3,
                        this.cmpApiContext = t;
                        try {
                            let t = e.__gpp("events") || [];
                            for (var n = 0; n < t.length; n++) {
                                let e = t[n];
                                this.eventQueue.set(e.id, {
                                    callback: e.callback,
                                    parameter: e.parameter
                                })
                            }
                        } catch (t) {
                            console.log(t)
                        }
                    }
                    add(e) {
                        return this.eventQueue.set(this.queueNumber, e),
                        this.queueNumber++
                    }
                    get(e) {
                        return this.eventQueue.get(e)
                    }
                    remove(e) {
                        return this.eventQueue.delete(e)
                    }
                    exec(e, t) {
                        this.eventQueue.forEach(( (n, s) => {
                            let i = new o(e,s,t,new r(this.cmpApiContext));
                            n.callback(i, !0)
                        }
                        ))
                    }
                    clear() {
                        this.queueNumber = 1e3,
                        this.eventQueue.clear()
                    }
                    get size() {
                        return this.eventQueue.size
                    }
                    events() {
                        let e = [];
                        return this.eventQueue.forEach(( (t, n) => {
                            e.push({
                                id: n,
                                callback: t.callback,
                                parameter: t.parameter
                            })
                        }
                        )),
                        e
                    }
                }
                class c extends Error {
                    constructor(e) {
                        super(e),
                        this.name = "InvalidFieldError"
                    }
                }
                class l {
                    constructor() {
                        this.encodedString = null,
                        this.dirty = !1,
                        this.decoded = !0,
                        this.segments = this.initializeSegments()
                    }
                    hasField(e) {
                        this.decoded || (this.segments = this.decodeSection(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0);
                        for (let t = 0; t < this.segments.length; t++) {
                            let n = this.segments[t];
                            if (n.getFieldNames().includes(e))
                                return n.hasField(e)
                        }
                        return !1
                    }
                    getFieldValue(e) {
                        this.decoded || (this.segments = this.decodeSection(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0);
                        for (let t = 0; t < this.segments.length; t++) {
                            let n = this.segments[t];
                            if (n.hasField(e))
                                return n.getFieldValue(e)
                        }
                        throw new c("Invalid field: '" + e + "'")
                    }
                    setFieldValue(e, t) {
                        this.decoded || (this.segments = this.decodeSection(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0);
                        for (let n = 0; n < this.segments.length; n++) {
                            let s = this.segments[n];
                            if (s.hasField(e))
                                return void s.setFieldValue(e, t)
                        }
                        throw new c("Invalid field: '" + e + "'")
                    }
                    toObj() {
                        let e = {};
                        for (let t = 0; t < this.segments.length; t++) {
                            let n = this.segments[t].toObj();
                            for (const [t,s] of Object.entries(n))
                                e[t] = s
                        }
                        return e
                    }
                    encode() {
                        return (null == this.encodedString || 0 === this.encodedString.length || this.dirty) && (this.encodedString = this.encodeSection(this.segments),
                        this.dirty = !1,
                        this.decoded = !0),
                        this.encodedString
                    }
                    decode(e) {
                        this.encodedString = e,
                        this.dirty = !1,
                        this.decoded = !1
                    }
                }
                class d extends Error {
                    constructor(e) {
                        super(e),
                        this.name = "DecodingError"
                    }
                }
                class u extends Error {
                    constructor(e) {
                        super(e),
                        this.name = "EncodingError"
                    }
                }
                class g {
                    static encode(e, t) {
                        let n = [];
                        if (e >= 1)
                            for (n.push(1); e >= 2 * n[0]; )
                                n.unshift(2 * n[0]);
                        let s = "";
                        for (let t = 0; t < n.length; t++) {
                            let i = n[t];
                            e >= i ? (s += "1",
                            e -= i) : s += "0"
                        }
                        if (s.length > t)
                            throw new u("Numeric value '" + e + "' is too large for a bit string length of '" + t + "'");
                        for (; s.length < t; )
                            s = "0" + s;
                        return s
                    }
                    static decode(e) {
                        if (!/^[0-1]*$/.test(e))
                            throw new d("Undecodable FixedInteger '" + e + "'");
                        let t = 0
                          , n = [];
                        for (let t = 0; t < e.length; t++)
                            n[e.length - (t + 1)] = 0 === t ? 1 : 2 * n[e.length - t];
                        for (let s = 0; s < e.length; s++)
                            "1" === e.charAt(s) && (t += n[s]);
                        return t
                    }
                }
                class p {
                    encode(e) {
                        if (!/^[0-1]*$/.test(e))
                            throw new u("Unencodable Base64Url '" + e + "'");
                        e = this.pad(e);
                        let t = ""
                          , n = 0;
                        for (; n <= e.length - 6; ) {
                            let s = e.substring(n, n + 6);
                            try {
                                let e = g.decode(s);
                                t += p.DICT.charAt(e),
                                n += 6
                            } catch (t) {
                                throw new u("Unencodable Base64Url '" + e + "'")
                            }
                        }
                        return t
                    }
                    decode(e) {
                        if (!/^[A-Za-z0-9\-_]*$/.test(e))
                            throw new d("Undecodable Base64URL string '" + e + "'");
                        let t = "";
                        for (let n = 0; n < e.length; n++) {
                            let s = e.charAt(n)
                              , i = p.REVERSE_DICT.get(s);
                            t += g.encode(i, 6)
                        }
                        return t
                    }
                }
                p.DICT = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
                p.REVERSE_DICT = new Map([["A", 0], ["B", 1], ["C", 2], ["D", 3], ["E", 4], ["F", 5], ["G", 6], ["H", 7], ["I", 8], ["J", 9], ["K", 10], ["L", 11], ["M", 12], ["N", 13], ["O", 14], ["P", 15], ["Q", 16], ["R", 17], ["S", 18], ["T", 19], ["U", 20], ["V", 21], ["W", 22], ["X", 23], ["Y", 24], ["Z", 25], ["a", 26], ["b", 27], ["c", 28], ["d", 29], ["e", 30], ["f", 31], ["g", 32], ["h", 33], ["i", 34], ["j", 35], ["k", 36], ["l", 37], ["m", 38], ["n", 39], ["o", 40], ["p", 41], ["q", 42], ["r", 43], ["s", 44], ["t", 45], ["u", 46], ["v", 47], ["w", 48], ["x", 49], ["y", 50], ["z", 51], ["0", 52], ["1", 53], ["2", 54], ["3", 55], ["4", 56], ["5", 57], ["6", 58], ["7", 59], ["8", 60], ["9", 61], ["-", 62], ["_", 63]]);
                class h extends p {
                    constructor() {
                        super()
                    }
                    static getInstance() {
                        return this.instance
                    }
                    pad(e) {
                        for (; e.length % 8 > 0; )
                            e += "0";
                        for (; e.length % 6 > 0; )
                            e += "0";
                        return e
                    }
                }
                h.instance = new h;
                class S {
                    constructor() {}
                    static getInstance() {
                        return this.instance
                    }
                    encode(e, t) {
                        let n = "";
                        for (let s = 0; s < t.length; s++) {
                            let i = t[s];
                            if (!e.containsKey(i))
                                throw new Error("Field not found: '" + i + "'");
                            n += e.get(i).encode()
                        }
                        return n
                    }
                    decode(e, t, n) {
                        let s = 0;
                        for (let i = 0; i < t.length; i++) {
                            let o = t[i];
                            if (!n.containsKey(o))
                                throw new Error("Field not found: '" + o + "'");
                            {
                                let t = n.get(o);
                                try {
                                    let n = t.substring(e, s);
                                    t.decode(n),
                                    s += n.length
                                } catch (e) {
                                    if ("SubstringError" !== e.name || t.getHardFailIfMissing())
                                        throw new d("Unable to decode field '" + o + "'");
                                    return
                                }
                            }
                        }
                    }
                }
                S.instance = new S;
                class f {
                    static encode(e) {
                        let t = [];
                        if (e >= 1 && (t.push(1),
                        e >= 2)) {
                            t.push(2);
                            let n = 2;
                            for (; e >= t[n - 1] + t[n - 2]; )
                                t.push(t[n - 1] + t[n - 2]),
                                n++
                        }
                        let n = "1";
                        for (let s = t.length - 1; s >= 0; s--) {
                            let i = t[s];
                            e >= i ? (n = "1" + n,
                            e -= i) : n = "0" + n
                        }
                        return n
                    }
                    static decode(e) {
                        if (!/^[0-1]*$/.test(e) || e.length < 2 || e.indexOf("11") !== e.length - 2)
                            throw new d("Undecodable FibonacciInteger '" + e + "'");
                        let t = 0
                          , n = [];
                        for (let t = 0; t < e.length - 1; t++)
                            0 === t ? n.push(1) : 1 === t ? n.push(2) : n.push(n[t - 1] + n[t - 2]);
                        for (let s = 0; s < e.length - 1; s++)
                            "1" === e.charAt(s) && (t += n[s]);
                        return t
                    }
                }
                class E {
                    static encode(e) {
                        if (!0 === e)
                            return "1";
                        if (!1 === e)
                            return "0";
                        throw new u("Unencodable Boolean '" + e + "'")
                    }
                    static decode(e) {
                        if ("1" === e)
                            return !0;
                        if ("0" === e)
                            return !1;
                        throw new d("Undecodable Boolean '" + e + "'")
                    }
                }
                class C {
                    static encode(e) {
                        e = e.sort(( (e, t) => e - t));
                        let t = []
                          , n = 0
                          , s = 0;
                        for (; s < e.length; ) {
                            let n = s;
                            for (; n < e.length - 1 && e[n] + 1 === e[n + 1]; )
                                n++;
                            t.push(e.slice(s, n + 1)),
                            s = n + 1
                        }
                        let i = g.encode(t.length, 12);
                        for (let e = 0; e < t.length; e++)
                            if (1 == t[e].length) {
                                let s = t[e][0] - n;
                                n = t[e][0],
                                i += "0" + f.encode(s)
                            } else {
                                let s = t[e][0] - n;
                                n = t[e][0];
                                let o = t[e][t[e].length - 1] - n;
                                n = t[e][t[e].length - 1],
                                i += "1" + f.encode(s) + f.encode(o)
                            }
                        return i
                    }
                    static decode(e) {
                        if (!/^[0-1]*$/.test(e) || e.length < 12)
                            throw new d("Undecodable FibonacciIntegerRange '" + e + "'");
                        let t = []
                          , n = g.decode(e.substring(0, 12))
                          , s = 0
                          , i = 12;
                        for (let o = 0; o < n; o++) {
                            let n = E.decode(e.substring(i, i + 1));
                            if (i++,
                            !0 === n) {
                                let n = e.indexOf("11", i)
                                  , o = f.decode(e.substring(i, n + 2)) + s;
                                s = o,
                                i = n + 2,
                                n = e.indexOf("11", i);
                                let r = f.decode(e.substring(i, n + 2)) + s;
                                s = r,
                                i = n + 2;
                                for (let e = o; e <= r; e++)
                                    t.push(e)
                            } else {
                                let n = e.indexOf("11", i)
                                  , o = f.decode(e.substring(i, n + 2)) + s;
                                s = o,
                                t.push(o),
                                i = n + 2
                            }
                        }
                        return t
                    }
                }
                class m extends Error {
                    constructor(e) {
                        super(e),
                        this.name = "ValidationError"
                    }
                }
                class I {
                    constructor(e=!0) {
                        this.hardFailIfMissing = e
                    }
                    withValidator(e) {
                        return this.validator = e,
                        this
                    }
                    hasValue() {
                        return void 0 !== this.value && null !== this.value
                    }
                    getValue() {
                        return this.value
                    }
                    setValue(e) {
                        if (this.validator && !this.validator.test(e))
                            throw new m("Invalid value '" + e + "'");
                        this.value = e
                    }
                    getHardFailIfMissing() {
                        return this.hardFailIfMissing
                    }
                }
                class T extends d {
                    constructor(e) {
                        super(e),
                        this.name = "SubstringError"
                    }
                }
                class _ {
                    static substring(e, t, n) {
                        if (n > e.length || t < 0 || t > n)
                            throw new T("Invalid substring indexes " + t + ":" + n + " for string of length " + e.length);
                        return e.substring(t, n)
                    }
                }
                class b extends I {
                    constructor(e, t=!0) {
                        super(t),
                        this.setValue(e)
                    }
                    encode() {
                        try {
                            return C.encode(this.value)
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            this.value = C.decode(e)
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            let n = g.decode(_.substring(e, t, t + 12))
                              , s = t + 12;
                            for (let t = 0; t < n; t++)
                                s = "1" === e.charAt(s) ? e.indexOf("11", e.indexOf("11", s + 1) + 2) + 2 : e.indexOf("11", s + 1) + 2;
                            return _.substring(e, t, s)
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                    getValue() {
                        return [...super.getValue()]
                    }
                    setValue(e) {
                        super.setValue(Array.from(new Set(e)).sort(( (e, t) => e - t)))
                    }
                }
                class O extends I {
                    constructor(e, t, n=!0) {
                        super(n),
                        this.bitStringLength = e,
                        this.setValue(t)
                    }
                    encode() {
                        try {
                            return g.encode(this.value, this.bitStringLength)
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            this.value = g.decode(e)
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            return _.substring(e, t, t + this.bitStringLength)
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                }
                class y {
                    constructor() {
                        this.fields = new Map
                    }
                    containsKey(e) {
                        return this.fields.has(e)
                    }
                    put(e, t) {
                        this.fields.set(e, t)
                    }
                    get(e) {
                        return this.fields.get(e)
                    }
                    getAll() {
                        return new Map(this.fields)
                    }
                    reset(e) {
                        this.fields.clear(),
                        e.getAll().forEach(( (e, t) => {
                            this.fields.set(t, e)
                        }
                        ))
                    }
                }
                !function(e) {
                    e.ID = "Id",
                    e.VERSION = "Version",
                    e.SECTION_IDS = "SectionIds"
                }(i || (i = {}));
                const N = [i.ID, i.VERSION, i.SECTION_IDS];
                class A {
                    constructor() {
                        this.encodedString = null,
                        this.dirty = !1,
                        this.decoded = !0,
                        this.fields = this.initializeFields()
                    }
                    validate() {}
                    hasField(e) {
                        return this.fields.containsKey(e)
                    }
                    getFieldValue(e) {
                        if (this.decoded || (this.decodeSegment(this.encodedString, this.fields),
                        this.dirty = !1,
                        this.decoded = !0),
                        this.fields.containsKey(e))
                            return this.fields.get(e).getValue();
                        throw new c("Invalid field: '" + e + "'")
                    }
                    setFieldValue(e, t) {
                        if (this.decoded || (this.decodeSegment(this.encodedString, this.fields),
                        this.dirty = !1,
                        this.decoded = !0),
                        !this.fields.containsKey(e))
                            throw new c(e + " not found");
                        this.fields.get(e).setValue(t),
                        this.dirty = !0
                    }
                    toObj() {
                        let e = {}
                          , t = this.getFieldNames();
                        for (let n = 0; n < t.length; n++) {
                            let s = t[n]
                              , i = this.getFieldValue(s);
                            e[s] = i
                        }
                        return e
                    }
                    encode() {
                        return (null == this.encodedString || 0 === this.encodedString.length || this.dirty) && (this.validate(),
                        this.encodedString = this.encodeSegment(this.fields),
                        this.dirty = !1,
                        this.decoded = !0),
                        this.encodedString
                    }
                    decode(e) {
                        this.encodedString = e,
                        this.dirty = !1,
                        this.decoded = !1
                    }
                }
                class w extends A {
                    constructor(e) {
                        super(),
                        this.base64UrlEncoder = h.getInstance(),
                        this.bitStringEncoder = S.getInstance(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return N
                    }
                    initializeFields() {
                        let e = new y;
                        return e.put(i.ID.toString(), new O(6,P.ID)),
                        e.put(i.VERSION.toString(), new O(6,P.VERSION)),
                        e.put(i.SECTION_IDS.toString(), new b([])),
                        e
                    }
                    encodeSegment(e) {
                        let t = this.bitStringEncoder.encode(e, this.getFieldNames());
                        return this.base64UrlEncoder.encode(t)
                    }
                    decodeSegment(e, t) {
                        null != e && 0 !== e.length || this.fields.reset(t);
                        try {
                            let n = this.base64UrlEncoder.decode(e);
                            this.bitStringEncoder.decode(n, this.getFieldNames(), t)
                        } catch (t) {
                            throw new d("Unable to decode HeaderV1CoreSegment '" + e + "'")
                        }
                    }
                }
                class P extends l {
                    constructor(e) {
                        super(),
                        e && e.length > 0 && this.decode(e)
                    }
                    getId() {
                        return P.ID
                    }
                    getName() {
                        return P.NAME
                    }
                    getVersion() {
                        return P.VERSION
                    }
                    initializeSegments() {
                        let e = [];
                        return e.push(new w),
                        e
                    }
                    decodeSection(e) {
                        let t = this.initializeSegments();
                        if (null != e && 0 !== e.length) {
                            let n = e.split(".");
                            for (let e = 0; e < t.length; e++)
                                n.length > e && t[e].decode(n[e])
                        }
                        return t
                    }
                    encodeSection(e) {
                        let t = [];
                        for (let n = 0; n < e.length; n++) {
                            let s = e[n];
                            t.push(s.encode())
                        }
                        return t.join(".")
                    }
                }
                var v;
                P.ID = 3,
                P.VERSION = 1,
                P.NAME = "header",
                function(e) {
                    e.VERSION = "Version",
                    e.CREATED = "Created",
                    e.LAST_UPDATED = "LastUpdated",
                    e.CMP_ID = "CmpId",
                    e.CMP_VERSION = "CmpVersion",
                    e.CONSENT_SCREEN = "ConsentScreen",
                    e.CONSENT_LANGUAGE = "ConsentLanguage",
                    e.VENDOR_LIST_VERSION = "VendorListVersion",
                    e.POLICY_VERSION = "PolicyVersion",
                    e.IS_SERVICE_SPECIFIC = "IsServiceSpecific",
                    e.USE_NON_STANDARD_STACKS = "UseNonStandardStacks",
                    e.SPECIAL_FEATURE_OPTINS = "SpecialFeatureOptins",
                    e.PURPOSE_CONSENTS = "PurposeConsents",
                    e.PURPOSE_LEGITIMATE_INTERESTS = "PurposeLegitimateInterests",
                    e.PURPOSE_ONE_TREATMENT = "PurposeOneTreatment",
                    e.PUBLISHER_COUNTRY_CODE = "PublisherCountryCode",
                    e.VENDOR_CONSENTS = "VendorConsents",
                    e.VENDOR_LEGITIMATE_INTERESTS = "VendorLegitimateInterests",
                    e.PUBLISHER_RESTRICTIONS = "PublisherRestrictions",
                    e.PUBLISHER_PURPOSES_SEGMENT_TYPE = "PublisherPurposesSegmentType",
                    e.PUBLISHER_CONSENTS = "PublisherConsents",
                    e.PUBLISHER_LEGITIMATE_INTERESTS = "PublisherLegitimateInterests",
                    e.NUM_CUSTOM_PURPOSES = "NumCustomPurposes",
                    e.PUBLISHER_CUSTOM_CONSENTS = "PublisherCustomConsents",
                    e.PUBLISHER_CUSTOM_LEGITIMATE_INTERESTS = "PublisherCustomLegitimateInterests",
                    e.VENDORS_ALLOWED_SEGMENT_TYPE = "VendorsAllowedSegmentType",
                    e.VENDORS_ALLOWED = "VendorsAllowed",
                    e.VENDORS_DISCLOSED_SEGMENT_TYPE = "VendorsDisclosedSegmentType",
                    e.VENDORS_DISCLOSED = "VendorsDisclosed"
                }(v || (v = {}));
                const D = [v.VERSION, v.CREATED, v.LAST_UPDATED, v.CMP_ID, v.CMP_VERSION, v.CONSENT_SCREEN, v.CONSENT_LANGUAGE, v.VENDOR_LIST_VERSION, v.POLICY_VERSION, v.IS_SERVICE_SPECIFIC, v.USE_NON_STANDARD_STACKS, v.SPECIAL_FEATURE_OPTINS, v.PURPOSE_CONSENTS, v.PURPOSE_LEGITIMATE_INTERESTS, v.PURPOSE_ONE_TREATMENT, v.PUBLISHER_COUNTRY_CODE, v.VENDOR_CONSENTS, v.VENDOR_LEGITIMATE_INTERESTS, v.PUBLISHER_RESTRICTIONS]
                  , R = [v.PUBLISHER_PURPOSES_SEGMENT_TYPE, v.PUBLISHER_CONSENTS, v.PUBLISHER_LEGITIMATE_INTERESTS, v.NUM_CUSTOM_PURPOSES, v.PUBLISHER_CUSTOM_CONSENTS, v.PUBLISHER_CUSTOM_LEGITIMATE_INTERESTS]
                  , V = [v.VENDORS_ALLOWED_SEGMENT_TYPE, v.VENDORS_ALLOWED]
                  , U = [v.VENDORS_DISCLOSED_SEGMENT_TYPE, v.VENDORS_DISCLOSED];
                class L extends p {
                    constructor() {
                        super()
                    }
                    static getInstance() {
                        return this.instance
                    }
                    pad(e) {
                        for (; e.length % 24 > 0; )
                            e += "0";
                        return e
                    }
                }
                L.instance = new L;
                class k {
                    static encode(e) {
                        e.sort(( (e, t) => e - t));
                        let t = []
                          , n = 0;
                        for (; n < e.length; ) {
                            let s = n;
                            for (; s < e.length - 1 && e[s] + 1 === e[s + 1]; )
                                s++;
                            t.push(e.slice(n, s + 1)),
                            n = s + 1
                        }
                        let s = g.encode(t.length, 12);
                        for (let e = 0; e < t.length; e++)
                            1 === t[e].length ? s += "0" + g.encode(t[e][0], 16) : s += "1" + g.encode(t[e][0], 16) + g.encode(t[e][t[e].length - 1], 16);
                        return s
                    }
                    static decode(e) {
                        if (!/^[0-1]*$/.test(e) || e.length < 12)
                            throw new d("Undecodable FixedIntegerRange '" + e + "'");
                        let t = []
                          , n = g.decode(e.substring(0, 12))
                          , s = 12;
                        for (let i = 0; i < n; i++) {
                            let n = E.decode(e.substring(s, s + 1));
                            if (s++,
                            !0 === n) {
                                let n = g.decode(e.substring(s, s + 16));
                                s += 16;
                                let i = g.decode(e.substring(s, s + 16));
                                s += 16;
                                for (let e = n; e <= i; e++)
                                    t.push(e)
                            } else {
                                let n = g.decode(e.substring(s, s + 16));
                                t.push(n),
                                s += 16
                            }
                        }
                        return t
                    }
                }
                class M extends I {
                    constructor(e, t=!0) {
                        super(t),
                        this.setValue(e)
                    }
                    encode() {
                        try {
                            return k.encode(this.value)
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            this.value = k.decode(e)
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            let n = g.decode(_.substring(e, t, t + 12))
                              , s = t + 12;
                            for (let t = 0; t < n; t++)
                                "1" === e.charAt(s) ? s += 33 : s += 17;
                            return _.substring(e, t, s)
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                    getValue() {
                        return [...super.getValue()]
                    }
                    setValue(e) {
                        super.setValue(Array.from(new Set(e)).sort(( (e, t) => e - t)))
                    }
                }
                class x {
                    constructor(e, t, n) {
                        this.key = e,
                        this.type = t,
                        this.ids = n
                    }
                    getKey() {
                        return this.key
                    }
                    setKey(e) {
                        this.key = e
                    }
                    getType() {
                        return this.type
                    }
                    setType(e) {
                        this.type = e
                    }
                    getIds() {
                        return this.ids
                    }
                    setIds(e) {
                        this.ids = e
                    }
                }
                class G extends I {
                    constructor(e, t, n, s=!0) {
                        super(s),
                        this.keyBitStringLength = e,
                        this.typeBitStringLength = t,
                        this.setValue(n)
                    }
                    encode() {
                        try {
                            let e = this.value
                              , t = "";
                            t += g.encode(e.length, 12);
                            for (let n = 0; n < e.length; n++) {
                                let s = e[n];
                                t += g.encode(s.getKey(), this.keyBitStringLength),
                                t += g.encode(s.getType(), this.typeBitStringLength),
                                t += k.encode(s.getIds())
                            }
                            return t
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            let t = []
                              , n = g.decode(_.substring(e, 0, 12))
                              , s = 12;
                            for (let i = 0; i < n; i++) {
                                let n = g.decode(_.substring(e, s, s + this.keyBitStringLength));
                                s += this.keyBitStringLength;
                                let i = g.decode(_.substring(e, s, s + this.typeBitStringLength));
                                s += this.typeBitStringLength;
                                let o = new M([]).substring(e, s)
                                  , r = k.decode(o);
                                s += o.length,
                                t.push(new x(n,i,r))
                            }
                            this.value = t
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            let n = "";
                            n += _.substring(e, t, t + 12);
                            let s = g.decode(n.toString())
                              , i = t + n.length;
                            for (let t = 0; t < s; t++) {
                                let t = _.substring(e, i, i + this.keyBitStringLength);
                                i += t.length,
                                n += t;
                                let s = _.substring(e, i, i + this.typeBitStringLength);
                                i += s.length,
                                n += s;
                                let o = new M([]).substring(e, i);
                                i += o.length,
                                n += o
                            }
                            return n
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                }
                class F extends I {
                    constructor(e, t=!0) {
                        super(t),
                        this.setValue(e)
                    }
                    encode() {
                        try {
                            return E.encode(this.value)
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            this.value = E.decode(e)
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            return _.substring(e, t, t + 1)
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                }
                class B {
                    static encode(e) {
                        return e ? g.encode(Math.round(e.getTime() / 100), 36) : g.encode(0, 36)
                    }
                    static decode(e) {
                        if (!/^[0-1]*$/.test(e) || 36 !== e.length)
                            throw new d("Undecodable Datetime '" + e + "'");
                        return new Date(100 * g.decode(e))
                    }
                }
                class z extends I {
                    constructor(e, t=!0) {
                        super(t),
                        this.setValue(e)
                    }
                    encode() {
                        try {
                            return B.encode(this.value)
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            this.value = B.decode(e)
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            return _.substring(e, t, t + 36)
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                }
                class W {
                    static encode(e, t) {
                        if (e.length > t)
                            throw new u("Too many values '" + e.length + "'");
                        let n = "";
                        for (let t = 0; t < e.length; t++)
                            n += E.encode(e[t]);
                        for (; n.length < t; )
                            n += "0";
                        return n
                    }
                    static decode(e) {
                        if (!/^[0-1]*$/.test(e))
                            throw new d("Undecodable FixedBitfield '" + e + "'");
                        let t = [];
                        for (let n = 0; n < e.length; n++)
                            t.push(E.decode(e.substring(n, n + 1)));
                        return t
                    }
                }
                class H extends I {
                    constructor(e, t=!0) {
                        super(t),
                        this.numElements = e.length,
                        this.setValue(e)
                    }
                    encode() {
                        try {
                            return W.encode(this.value, this.numElements)
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            this.value = W.decode(e)
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            return _.substring(e, t, t + this.numElements)
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                    getValue() {
                        return [...super.getValue()]
                    }
                    setValue(e) {
                        let t = [...e];
                        for (let e = t.length; e < this.numElements; e++)
                            t.push(!1);
                        t.length > this.numElements && (t = t.slice(0, this.numElements)),
                        super.setValue(t)
                    }
                }
                class j {
                    static encode(e, t) {
                        for (; e.length < t; )
                            e += " ";
                        let n = "";
                        for (let t = 0; t < e.length; t++) {
                            let s = e.charCodeAt(t);
                            if (32 === s)
                                n += g.encode(63, 6);
                            else {
                                if (!(s >= 65))
                                    throw new u("Unencodable FixedString '" + e + "'");
                                n += g.encode(e.charCodeAt(t) - 65, 6)
                            }
                        }
                        return n
                    }
                    static decode(e) {
                        if (!/^[0-1]*$/.test(e) || e.length % 6 != 0)
                            throw new d("Undecodable FixedString '" + e + "'");
                        let t = "";
                        for (let n = 0; n < e.length; n += 6) {
                            let s = g.decode(e.substring(n, n + 6));
                            t += 63 === s ? " " : String.fromCharCode(s + 65)
                        }
                        return t.trim()
                    }
                }
                class q extends I {
                    constructor(e, t, n=!0) {
                        super(n),
                        this.stringLength = e,
                        this.setValue(t)
                    }
                    encode() {
                        try {
                            return j.encode(this.value, this.stringLength)
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            this.value = j.decode(e)
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            return _.substring(e, t, t + 6 * this.stringLength)
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                }
                class Y extends I {
                    constructor(e, t=!0) {
                        super(t),
                        this.setValue(e)
                    }
                    encode() {
                        try {
                            let e = this.value.length > 0 ? this.value[this.value.length - 1] : 0
                              , t = k.encode(this.value)
                              , n = t.length
                              , s = e;
                            if (n <= s)
                                return g.encode(e, 16) + "1" + t;
                            {
                                let t = []
                                  , n = 0;
                                for (let s = 0; s < e; s++)
                                    s === this.value[n] - 1 ? (t[s] = !0,
                                    n++) : t[s] = !1;
                                return g.encode(e, 16) + "0" + W.encode(t, s)
                            }
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            if ("1" === e.charAt(16))
                                this.value = k.decode(e.substring(17));
                            else {
                                let t = []
                                  , n = W.decode(e.substring(17));
                                for (let e = 0; e < n.length; e++)
                                    !0 === n[e] && t.push(e + 1);
                                this.value = t
                            }
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            let n = g.decode(_.substring(e, t, t + 16));
                            return "1" === e.charAt(t + 16) ? _.substring(e, t, t + 17) + new M([]).substring(e, t + 17) : _.substring(e, t, t + 17 + n)
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                    getValue() {
                        return [...super.getValue()]
                    }
                    setValue(e) {
                        super.setValue(Array.from(new Set(e)).sort(( (e, t) => e - t)))
                    }
                }
                class K extends A {
                    constructor(e) {
                        super(),
                        this.base64UrlEncoder = L.getInstance(),
                        this.bitStringEncoder = S.getInstance(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return D
                    }
                    initializeFields() {
                        let e = new Date
                          , t = new y;
                        return t.put(v.VERSION.toString(), new O(6,$.VERSION)),
                        t.put(v.CREATED.toString(), new z(e)),
                        t.put(v.LAST_UPDATED.toString(), new z(e)),
                        t.put(v.CMP_ID.toString(), new O(12,0)),
                        t.put(v.CMP_VERSION.toString(), new O(12,0)),
                        t.put(v.CONSENT_SCREEN.toString(), new O(6,0)),
                        t.put(v.CONSENT_LANGUAGE.toString(), new q(2,"EN")),
                        t.put(v.VENDOR_LIST_VERSION.toString(), new O(12,0)),
                        t.put(v.POLICY_VERSION.toString(), new O(6,2)),
                        t.put(v.IS_SERVICE_SPECIFIC.toString(), new F(!1)),
                        t.put(v.USE_NON_STANDARD_STACKS.toString(), new F(!1)),
                        t.put(v.SPECIAL_FEATURE_OPTINS.toString(), new H([!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1])),
                        t.put(v.PURPOSE_CONSENTS.toString(), new H([!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1])),
                        t.put(v.PURPOSE_LEGITIMATE_INTERESTS.toString(), new H([!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1])),
                        t.put(v.PURPOSE_ONE_TREATMENT.toString(), new F(!1)),
                        t.put(v.PUBLISHER_COUNTRY_CODE.toString(), new q(2,"AA")),
                        t.put(v.VENDOR_CONSENTS.toString(), new Y([])),
                        t.put(v.VENDOR_LEGITIMATE_INTERESTS.toString(), new Y([])),
                        t.put(v.PUBLISHER_RESTRICTIONS.toString(), new G(6,2,[],!1)),
                        t
                    }
                    encodeSegment(e) {
                        let t = this.bitStringEncoder.encode(e, this.getFieldNames());
                        return this.base64UrlEncoder.encode(t)
                    }
                    decodeSegment(e, t) {
                        null != e && 0 !== e.length || this.fields.reset(t);
                        try {
                            let n = this.base64UrlEncoder.decode(e);
                            this.bitStringEncoder.decode(n, this.getFieldNames(), t)
                        } catch (t) {
                            throw new d("Unable to decode TcfEuV2CoreSegment '" + e + "'")
                        }
                    }
                }
                class Q extends I {
                    constructor(e, t, n=!0) {
                        super(n),
                        this.getLength = e,
                        this.setValue(t)
                    }
                    encode() {
                        try {
                            return W.encode(this.value, this.getLength())
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            this.value = W.decode(e)
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            return _.substring(e, t, t + this.getLength())
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                    getValue() {
                        return [...super.getValue()]
                    }
                    setValue(e) {
                        let t = this.getLength()
                          , n = [...e];
                        for (let e = n.length; e < t; e++)
                            n.push(!1);
                        n.length > t && (n = n.slice(0, t)),
                        super.setValue([...n])
                    }
                }
                class J extends A {
                    constructor(e) {
                        super(),
                        this.base64UrlEncoder = L.getInstance(),
                        this.bitStringEncoder = S.getInstance(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return R
                    }
                    initializeFields() {
                        let e = new y;
                        e.put(v.PUBLISHER_PURPOSES_SEGMENT_TYPE.toString(), new O(3,3)),
                        e.put(v.PUBLISHER_CONSENTS.toString(), new H([!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1])),
                        e.put(v.PUBLISHER_LEGITIMATE_INTERESTS.toString(), new H([!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1]));
                        let t = new O(6,0);
                        return e.put(v.NUM_CUSTOM_PURPOSES.toString(), t),
                        e.put(v.PUBLISHER_CUSTOM_CONSENTS.toString(), new Q(( () => t.getValue()),[])),
                        e.put(v.PUBLISHER_CUSTOM_LEGITIMATE_INTERESTS.toString(), new Q(( () => t.getValue()),[])),
                        e
                    }
                    encodeSegment(e) {
                        let t = this.bitStringEncoder.encode(e, this.getFieldNames());
                        return this.base64UrlEncoder.encode(t)
                    }
                    decodeSegment(e, t) {
                        null != e && 0 !== e.length || this.fields.reset(t);
                        try {
                            let n = this.base64UrlEncoder.decode(e);
                            this.bitStringEncoder.decode(n, this.getFieldNames(), t)
                        } catch (t) {
                            throw new d("Unable to decode TcfEuV2PublisherPurposesSegment '" + e + "'")
                        }
                    }
                }
                class X extends A {
                    constructor(e) {
                        super(),
                        this.base64UrlEncoder = L.getInstance(),
                        this.bitStringEncoder = S.getInstance(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return V
                    }
                    initializeFields() {
                        let e = new y;
                        return e.put(v.VENDORS_ALLOWED_SEGMENT_TYPE.toString(), new O(3,2)),
                        e.put(v.VENDORS_ALLOWED.toString(), new Y([])),
                        e
                    }
                    encodeSegment(e) {
                        let t = this.bitStringEncoder.encode(e, this.getFieldNames());
                        return this.base64UrlEncoder.encode(t)
                    }
                    decodeSegment(e, t) {
                        null != e && 0 !== e.length || this.fields.reset(t);
                        try {
                            let n = this.base64UrlEncoder.decode(e);
                            this.bitStringEncoder.decode(n, this.getFieldNames(), t)
                        } catch (t) {
                            throw new d("Unable to decode TcfEuV2VendorsAllowedSegment '" + e + "'")
                        }
                    }
                }
                class Z extends A {
                    constructor(e) {
                        super(),
                        this.base64UrlEncoder = L.getInstance(),
                        this.bitStringEncoder = S.getInstance(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return U
                    }
                    initializeFields() {
                        let e = new y;
                        return e.put(v.VENDORS_DISCLOSED_SEGMENT_TYPE.toString(), new O(3,1)),
                        e.put(v.VENDORS_DISCLOSED.toString(), new Y([])),
                        e
                    }
                    encodeSegment(e) {
                        let t = this.bitStringEncoder.encode(e, this.getFieldNames());
                        return this.base64UrlEncoder.encode(t)
                    }
                    decodeSegment(e, t) {
                        null != e && 0 !== e.length || this.fields.reset(t);
                        try {
                            let n = this.base64UrlEncoder.decode(e);
                            this.bitStringEncoder.decode(n, this.getFieldNames(), t)
                        } catch (t) {
                            throw new d("Unable to decode TcfEuV2VendorsDisclosedSegment '" + e + "'")
                        }
                    }
                }
                class $ extends l {
                    constructor(e) {
                        super(),
                        e && e.length > 0 && this.decode(e)
                    }
                    getId() {
                        return $.ID
                    }
                    getName() {
                        return $.NAME
                    }
                    getVersion() {
                        return $.VERSION
                    }
                    initializeSegments() {
                        let e = [];
                        return e.push(new K),
                        e.push(new J),
                        e.push(new X),
                        e.push(new Z),
                        e
                    }
                    decodeSection(e) {
                        let t = this.initializeSegments();
                        if (null != e && 0 !== e.length) {
                            let n = e.split(".");
                            for (let e = 0; e < n.length; e++) {
                                let s = n[e];
                                if (0 !== s.length) {
                                    let i = s.charAt(0);
                                    if (i >= "A" && i <= "H")
                                        t[0].decode(n[e]);
                                    else if (i >= "I" && i <= "P")
                                        t[3].decode(n[e]);
                                    else if (i >= "Q" && i <= "X")
                                        t[2].decode(n[e]);
                                    else {
                                        if (!(i >= "Y" && i <= "Z" || i >= "a" && i <= "f"))
                                            throw new d("Unable to decode TcfEuV2 segment '" + s + "'");
                                        t[1].decode(n[e])
                                    }
                                }
                            }
                        }
                        return t
                    }
                    encodeSection(e) {
                        let t = [];
                        return e.length >= 1 && (t.push(e[0].encode()),
                        this.getFieldValue(v.IS_SERVICE_SPECIFIC) ? e.length >= 2 && t.push(e[1].encode()) : e.length >= 2 && (t.push(e[2].encode()),
                        e.length >= 3 && t.push(e[3].encode()))),
                        t.join(".")
                    }
                    setFieldValue(e, t) {
                        if (e == v.PURPOSE_LEGITIMATE_INTERESTS && (t[0] = t[2] = t[3] = t[4] = t[5] = !1),
                        e == v.CREATED)
                            super.setFieldValue(v.LAST_UPDATED, t);
                        else if (e == v.LAST_UPDATED)
                            super.setFieldValue(v.CREATED, t);
                        else {
                            const e = new Date;
                            super.setFieldValue(v.CREATED, e),
                            super.setFieldValue(v.LAST_UPDATED, e)
                        }
                        super.setFieldValue(e, t)
                    }
                }
                var ee;
                $.ID = 2,
                $.VERSION = 2,
                $.NAME = "tcfeuv2",
                function(e) {
                    e.VERSION = "Version",
                    e.CREATED = "Created",
                    e.LAST_UPDATED = "LastUpdated",
                    e.CMP_ID = "CmpId",
                    e.CMP_VERSION = "CmpVersion",
                    e.CONSENT_SCREEN = "ConsentScreen",
                    e.CONSENT_LANGUAGE = "ConsentLanguage",
                    e.VENDOR_LIST_VERSION = "VendorListVersion",
                    e.TCF_POLICY_VERSION = "TcfPolicyVersion",
                    e.USE_NON_STANDARD_STACKS = "UseNonStandardStacks",
                    e.SPECIAL_FEATURE_EXPRESS_CONSENT = "SpecialFeatureExpressConsent",
                    e.PUB_PURPOSES_SEGMENT_TYPE = "PubPurposesSegmentType",
                    e.PURPOSES_EXPRESS_CONSENT = "PurposesExpressConsent",
                    e.PURPOSES_IMPLIED_CONSENT = "PurposesImpliedConsent",
                    e.VENDOR_EXPRESS_CONSENT = "VendorExpressConsent",
                    e.VENDOR_IMPLIED_CONSENT = "VendorImpliedConsent",
                    e.PUB_RESTRICTIONS = "PubRestrictions",
                    e.PUB_PURPOSES_EXPRESS_CONSENT = "PubPurposesExpressConsent",
                    e.PUB_PURPOSES_IMPLIED_CONSENT = "PubPurposesImpliedConsent",
                    e.NUM_CUSTOM_PURPOSES = "NumCustomPurposes",
                    e.CUSTOM_PURPOSES_EXPRESS_CONSENT = "CustomPurposesExpressConsent",
                    e.CUSTOM_PURPOSES_IMPLIED_CONSENT = "CustomPurposesImpliedConsent",
                    e.DISCLOSED_VENDORS_SEGMENT_TYPE = "DisclosedVendorsSegmentType",
                    e.DISCLOSED_VENDORS = "DisclosedVendors"
                }(ee || (ee = {}));
                const te = [ee.VERSION, ee.CREATED, ee.LAST_UPDATED, ee.CMP_ID, ee.CMP_VERSION, ee.CONSENT_SCREEN, ee.CONSENT_LANGUAGE, ee.VENDOR_LIST_VERSION, ee.TCF_POLICY_VERSION, ee.USE_NON_STANDARD_STACKS, ee.SPECIAL_FEATURE_EXPRESS_CONSENT, ee.PURPOSES_EXPRESS_CONSENT, ee.PURPOSES_IMPLIED_CONSENT, ee.VENDOR_EXPRESS_CONSENT, ee.VENDOR_IMPLIED_CONSENT, ee.PUB_RESTRICTIONS]
                  , ne = [ee.PUB_PURPOSES_SEGMENT_TYPE, ee.PUB_PURPOSES_EXPRESS_CONSENT, ee.PUB_PURPOSES_IMPLIED_CONSENT, ee.NUM_CUSTOM_PURPOSES, ee.CUSTOM_PURPOSES_EXPRESS_CONSENT, ee.CUSTOM_PURPOSES_IMPLIED_CONSENT]
                  , se = [ee.DISCLOSED_VENDORS_SEGMENT_TYPE, ee.DISCLOSED_VENDORS];
                class ie extends A {
                    constructor(e) {
                        super(),
                        this.base64UrlEncoder = h.getInstance(),
                        this.bitStringEncoder = S.getInstance(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return te
                    }
                    initializeFields() {
                        let e = new Date
                          , t = new y;
                        return t.put(ee.VERSION.toString(), new O(6,ae.VERSION)),
                        t.put(ee.CREATED.toString(), new z(e)),
                        t.put(ee.LAST_UPDATED.toString(), new z(e)),
                        t.put(ee.CMP_ID.toString(), new O(12,0)),
                        t.put(ee.CMP_VERSION.toString(), new O(12,0)),
                        t.put(ee.CONSENT_SCREEN.toString(), new O(6,0)),
                        t.put(ee.CONSENT_LANGUAGE.toString(), new q(2,"EN")),
                        t.put(ee.VENDOR_LIST_VERSION.toString(), new O(12,0)),
                        t.put(ee.TCF_POLICY_VERSION.toString(), new O(6,2)),
                        t.put(ee.USE_NON_STANDARD_STACKS.toString(), new F(!1)),
                        t.put(ee.SPECIAL_FEATURE_EXPRESS_CONSENT.toString(), new H([!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1])),
                        t.put(ee.PURPOSES_EXPRESS_CONSENT.toString(), new H([!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1])),
                        t.put(ee.PURPOSES_IMPLIED_CONSENT.toString(), new H([!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1])),
                        t.put(ee.VENDOR_EXPRESS_CONSENT.toString(), new Y([])),
                        t.put(ee.VENDOR_IMPLIED_CONSENT.toString(), new Y([])),
                        t.put(ee.PUB_RESTRICTIONS.toString(), new G(6,2,[],!1)),
                        t
                    }
                    encodeSegment(e) {
                        let t = this.bitStringEncoder.encode(e, this.getFieldNames());
                        return this.base64UrlEncoder.encode(t)
                    }
                    decodeSegment(e, t) {
                        null != e && 0 !== e.length || this.fields.reset(t);
                        try {
                            let n = this.base64UrlEncoder.decode(e);
                            this.bitStringEncoder.decode(n, this.getFieldNames(), t)
                        } catch (t) {
                            throw new d("Unable to decode TcfCaV1CoreSegment '" + e + "'")
                        }
                    }
                }
                class oe extends A {
                    constructor(e) {
                        super(),
                        this.base64UrlEncoder = h.getInstance(),
                        this.bitStringEncoder = S.getInstance(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return ne
                    }
                    initializeFields() {
                        let e = new y;
                        e.put(ee.PUB_PURPOSES_SEGMENT_TYPE.toString(), new O(3,3)),
                        e.put(ee.PUB_PURPOSES_EXPRESS_CONSENT.toString(), new H([!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1])),
                        e.put(ee.PUB_PURPOSES_IMPLIED_CONSENT.toString(), new H([!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1]));
                        let t = new O(6,0);
                        return e.put(ee.NUM_CUSTOM_PURPOSES.toString(), t),
                        e.put(ee.CUSTOM_PURPOSES_EXPRESS_CONSENT.toString(), new Q(( () => t.getValue()),[])),
                        e.put(ee.CUSTOM_PURPOSES_IMPLIED_CONSENT.toString(), new Q(( () => t.getValue()),[])),
                        e
                    }
                    encodeSegment(e) {
                        let t = this.bitStringEncoder.encode(e, this.getFieldNames());
                        return this.base64UrlEncoder.encode(t)
                    }
                    decodeSegment(e, t) {
                        null != e && 0 !== e.length || this.fields.reset(t);
                        try {
                            let n = this.base64UrlEncoder.decode(e);
                            this.bitStringEncoder.decode(n, this.getFieldNames(), t)
                        } catch (t) {
                            throw new d("Unable to decode TcfCaV1PublisherPurposesSegment '" + e + "'")
                        }
                    }
                }
                class re extends A {
                    constructor(e) {
                        super(),
                        this.base64UrlEncoder = L.getInstance(),
                        this.bitStringEncoder = S.getInstance(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return se
                    }
                    initializeFields() {
                        let e = new y;
                        return e.put(ee.DISCLOSED_VENDORS_SEGMENT_TYPE.toString(), new O(3,1)),
                        e.put(ee.DISCLOSED_VENDORS.toString(), new Y([])),
                        e
                    }
                    encodeSegment(e) {
                        let t = this.bitStringEncoder.encode(e, this.getFieldNames());
                        return this.base64UrlEncoder.encode(t)
                    }
                    decodeSegment(e, t) {
                        null != e && 0 !== e.length || this.fields.reset(t);
                        try {
                            let n = this.base64UrlEncoder.decode(e);
                            this.bitStringEncoder.decode(n, this.getFieldNames(), t)
                        } catch (t) {
                            throw new d("Unable to decode HeaderV1CoreSegment '" + e + "'")
                        }
                    }
                }
                class ae extends l {
                    constructor(e) {
                        super(),
                        e && e.length > 0 && this.decode(e)
                    }
                    getId() {
                        return ae.ID
                    }
                    getName() {
                        return ae.NAME
                    }
                    getVersion() {
                        return ae.VERSION
                    }
                    initializeSegments() {
                        let e = [];
                        return e.push(new ie),
                        e.push(new oe),
                        e.push(new re),
                        e
                    }
                    decodeSection(e) {
                        let t = this.initializeSegments();
                        if (null != e && 0 !== e.length) {
                            let n = e.split(".");
                            for (let e = 0; e < n.length; e++) {
                                let s = n[e];
                                if (0 !== s.length) {
                                    let i = s.charAt(0);
                                    if (i >= "A" && i <= "H")
                                        t[0].decode(n[e]);
                                    else if (i >= "I" && i <= "P")
                                        t[2].decode(n[e]);
                                    else {
                                        if (!(i >= "Y" && i <= "Z" || i >= "a" && i <= "f"))
                                            throw new d("Unable to decode TcfCaV1 segment '" + s + "'");
                                        t[1].decode(n[e])
                                    }
                                }
                            }
                        }
                        return t
                    }
                    encodeSection(e) {
                        let t = [];
                        return t.push(e[0].encode()),
                        t.push(e[1].encode()),
                        this.getFieldValue(ee.DISCLOSED_VENDORS).length > 0 && t.push(e[2].encode()),
                        t.join(".")
                    }
                    setFieldValue(e, t) {
                        if (super.setFieldValue(e, t),
                        e !== ee.CREATED && e !== ee.LAST_UPDATED) {
                            let e = new Date;
                            super.setFieldValue(ee.CREATED, e),
                            super.setFieldValue(ee.LAST_UPDATED, e)
                        }
                    }
                }
                ae.ID = 5,
                ae.VERSION = 1,
                ae.NAME = "tcfcav1";
                class ce {
                    constructor(e, t) {
                        this.value = null,
                        this.validator = t || new class {
                            test(e) {
                                return !0
                            }
                        }
                        ,
                        this.setValue(e)
                    }
                    hasValue() {
                        return null != this.value
                    }
                    getValue() {
                        return this.value
                    }
                    setValue(e) {
                        e ? this.value = e.charAt(0) : e = null
                    }
                }
                class le {
                    constructor(e, t) {
                        this.value = null,
                        this.validator = t || new class {
                            test(e) {
                                return !0
                            }
                        }
                        ,
                        this.setValue(e)
                    }
                    hasValue() {
                        return null != this.value
                    }
                    getValue() {
                        return this.value
                    }
                    setValue(e) {
                        this.value = e
                    }
                }
                class de {
                    constructor() {
                        this.fields = new Map
                    }
                    containsKey(e) {
                        return this.fields.has(e)
                    }
                    put(e, t) {
                        this.fields.set(e, t)
                    }
                    get(e) {
                        return this.fields.get(e)
                    }
                    getAll() {
                        return new Map(this.fields)
                    }
                    reset(e) {
                        this.fields.clear(),
                        e.getAll().forEach(( (e, t) => {
                            this.fields.set(t, e)
                        }
                        ))
                    }
                }
                var ue;
                !function(e) {
                    e.VERSION = "Version",
                    e.NOTICE = "Notice",
                    e.OPT_OUT_SALE = "OptOutSale",
                    e.LSPA_COVERED = "LspaCovered"
                }(ue || (ue = {}));
                const ge = [ue.VERSION, ue.NOTICE, ue.OPT_OUT_SALE, ue.LSPA_COVERED];
                class pe extends A {
                    constructor(e) {
                        super(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return ge
                    }
                    initializeFields() {
                        const e = new class {
                            test(e) {
                                return "-" === e || "Y" === e || "N" === e
                            }
                        }
                        ;
                        let t = new de;
                        return t.put(ue.VERSION, new le(he.VERSION)),
                        t.put(ue.NOTICE, new ce("-",e)),
                        t.put(ue.OPT_OUT_SALE, new ce("-",e)),
                        t.put(ue.LSPA_COVERED, new ce("-",e)),
                        t
                    }
                    encodeSegment(e) {
                        let t = "";
                        return t += e.get(ue.VERSION).getValue(),
                        t += e.get(ue.NOTICE).getValue(),
                        t += e.get(ue.OPT_OUT_SALE).getValue(),
                        t += e.get(ue.LSPA_COVERED).getValue(),
                        t
                    }
                    decodeSegment(e, t) {
                        if (null == e || 4 != e.length)
                            throw new d("Unable to decode UspV1CoreSegment '" + e + "'");
                        try {
                            t.get(ue.VERSION).setValue(parseInt(e.substring(0, 1))),
                            t.get(ue.NOTICE).setValue(e.charAt(1)),
                            t.get(ue.OPT_OUT_SALE).setValue(e.charAt(2)),
                            t.get(ue.LSPA_COVERED).setValue(e.charAt(3))
                        } catch (t) {
                            throw new d("Unable to decode UspV1CoreSegment '" + e + "'")
                        }
                    }
                }
                class he extends l {
                    constructor(e) {
                        super(),
                        e && e.length > 0 && this.decode(e)
                    }
                    getId() {
                        return he.ID
                    }
                    getName() {
                        return he.NAME
                    }
                    getVersion() {
                        return he.VERSION
                    }
                    initializeSegments() {
                        let e = [];
                        return e.push(new pe),
                        e
                    }
                    decodeSection(e) {
                        let t = this.initializeSegments();
                        if (null != e && 0 !== e.length) {
                            let n = e.split(".");
                            for (let e = 0; e < t.length; e++)
                                n.length > e && t[e].decode(n[e])
                        }
                        return t
                    }
                    encodeSection(e) {
                        let t = [];
                        for (let n = 0; n < e.length; n++) {
                            let s = e[n];
                            t.push(s.encode())
                        }
                        return t.join(".")
                    }
                }
                var Se;
                he.ID = 6,
                he.VERSION = 1,
                he.NAME = "uspv1",
                function(e) {
                    e.VERSION = "Version",
                    e.SHARING_NOTICE = "SharingNotice",
                    e.SALE_OPT_OUT_NOTICE = "SaleOptOutNotice",
                    e.SHARING_OPT_OUT_NOTICE = "SharingOptOutNotice",
                    e.TARGETED_ADVERTISING_OPT_OUT_NOTICE = "TargetedAdvertisingOptOutNotice",
                    e.SENSITIVE_DATA_PROCESSING_OPT_OUT_NOTICE = "SensitiveDataProcessingOptOutNotice",
                    e.SENSITIVE_DATA_LIMIT_USE_NOTICE = "SensitiveDataLimitUseNotice",
                    e.SALE_OPT_OUT = "SaleOptOut",
                    e.SHARING_OPT_OUT = "SharingOptOut",
                    e.TARGETED_ADVERTISING_OPT_OUT = "TargetedAdvertisingOptOut",
                    e.SENSITIVE_DATA_PROCESSING = "SensitiveDataProcessing",
                    e.KNOWN_CHILD_SENSITIVE_DATA_CONSENTS = "KnownChildSensitiveDataConsents",
                    e.PERSONAL_DATA_CONSENTS = "PersonalDataConsents",
                    e.MSPA_COVERED_TRANSACTION = "MspaCoveredTransaction",
                    e.MSPA_OPT_OUT_OPTION_MODE = "MspaOptOutOptionMode",
                    e.MSPA_SERVICE_PROVIDER_MODE = "MspaServiceProviderMode",
                    e.GPC_SEGMENT_TYPE = "GpcSegmentType",
                    e.GPC_SEGMENT_INCLUDED = "GpcSegmentIncluded",
                    e.GPC = "Gpc"
                }(Se || (Se = {}));
                const fe = [Se.VERSION, Se.SHARING_NOTICE, Se.SALE_OPT_OUT_NOTICE, Se.SHARING_OPT_OUT_NOTICE, Se.TARGETED_ADVERTISING_OPT_OUT_NOTICE, Se.SENSITIVE_DATA_PROCESSING_OPT_OUT_NOTICE, Se.SENSITIVE_DATA_LIMIT_USE_NOTICE, Se.SALE_OPT_OUT, Se.SHARING_OPT_OUT, Se.TARGETED_ADVERTISING_OPT_OUT, Se.SENSITIVE_DATA_PROCESSING, Se.KNOWN_CHILD_SENSITIVE_DATA_CONSENTS, Se.PERSONAL_DATA_CONSENTS, Se.MSPA_COVERED_TRANSACTION, Se.MSPA_OPT_OUT_OPTION_MODE, Se.MSPA_SERVICE_PROVIDER_MODE]
                  , Ee = [Se.GPC_SEGMENT_TYPE, Se.GPC];
                class Ce {
                    static encode(e, t, n) {
                        if (e.length > n)
                            throw new u("Too many values '" + e.length + "'");
                        let s = "";
                        for (let n = 0; n < e.length; n++)
                            s += g.encode(e[n], t);
                        for (; s.length < t * n; )
                            s += "0";
                        return s
                    }
                    static decode(e, t, n) {
                        if (!/^[0-1]*$/.test(e))
                            throw new d("Undecodable FixedInteger '" + e + "'");
                        if (e.length > t * n)
                            throw new d("Undecodable FixedIntegerList '" + e + "'");
                        if (e.length % t != 0)
                            throw new d("Undecodable FixedIntegerList '" + e + "'");
                        for (; e.length < t * n; )
                            e += "0";
                        e.length > t * n && (e = e.substring(0, t * n));
                        let s = [];
                        for (let n = 0; n < e.length; n += t)
                            s.push(g.decode(e.substring(n, n + t)));
                        for (; s.length < n; )
                            s.push(0);
                        return s
                    }
                }
                class me extends I {
                    constructor(e, t, n=!0) {
                        super(n),
                        this.elementBitStringLength = e,
                        this.numElements = t.length,
                        this.setValue(t)
                    }
                    encode() {
                        try {
                            return Ce.encode(this.value, this.elementBitStringLength, this.numElements)
                        } catch (e) {
                            throw new u(e)
                        }
                    }
                    decode(e) {
                        try {
                            this.value = Ce.decode(e, this.elementBitStringLength, this.numElements)
                        } catch (e) {
                            throw new d(e)
                        }
                    }
                    substring(e, t) {
                        try {
                            return _.substring(e, t, t + this.elementBitStringLength * this.numElements)
                        } catch (e) {
                            throw new T(e)
                        }
                    }
                    getValue() {
                        return [...super.getValue()]
                    }
                    setValue(e) {
                        let t = [...e];
                        for (let e = t.length; e < this.numElements; e++)
                            t.push(0);
                        t.length > this.numElements && (t = t.slice(0, this.numElements)),
                        super.setValue(t)
                    }
                }
                class Ie extends A {
                    constructor(e) {
                        super(),
                        this.base64UrlEncoder = h.getInstance(),
                        this.bitStringEncoder = S.getInstance(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return fe
                    }
                    initializeFields() {
                        const e = new class {
                            test(e) {
                                return e >= 0 && e <= 2
                            }
                        }
                          , t = new class {
                            test(e) {
                                return e >= 1 && e <= 2
                            }
                        }
                          , n = new class {
                            test(e) {
                                for (let t = 0; t < e.length; t++) {
                                    let n = e[t];
                                    if (n < 0 || n > 2)
                                        return !1
                                }
                                return !0
                            }
                        }
                        ;
                        let s = new y;
                        return s.put(Se.VERSION.toString(), new O(6,_e.VERSION)),
                        s.put(Se.SHARING_NOTICE.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.SALE_OPT_OUT_NOTICE.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.SHARING_OPT_OUT_NOTICE.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.TARGETED_ADVERTISING_OPT_OUT_NOTICE.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.SENSITIVE_DATA_PROCESSING_OPT_OUT_NOTICE.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.SENSITIVE_DATA_LIMIT_USE_NOTICE.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.SALE_OPT_OUT.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.SHARING_OPT_OUT.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.TARGETED_ADVERTISING_OPT_OUT.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.SENSITIVE_DATA_PROCESSING.toString(), new me(2,[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).withValidator(n)),
                        s.put(Se.KNOWN_CHILD_SENSITIVE_DATA_CONSENTS.toString(), new me(2,[0, 0]).withValidator(n)),
                        s.put(Se.PERSONAL_DATA_CONSENTS.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.MSPA_COVERED_TRANSACTION.toString(), new O(2,1).withValidator(t)),
                        s.put(Se.MSPA_OPT_OUT_OPTION_MODE.toString(), new O(2,0).withValidator(e)),
                        s.put(Se.MSPA_SERVICE_PROVIDER_MODE.toString(), new O(2,0).withValidator(e)),
                        s
                    }
                    encodeSegment(e) {
                        let t = this.bitStringEncoder.encode(e, this.getFieldNames());
                        return this.base64UrlEncoder.encode(t)
                    }
                    decodeSegment(e, t) {
                        null != e && 0 !== e.length || this.fields.reset(t);
                        try {
                            let n = this.base64UrlEncoder.decode(e);
                            this.bitStringEncoder.decode(n, this.getFieldNames(), t)
                        } catch (t) {
                            throw new d("Unable to decode UsNatCoreSegment '" + e + "'")
                        }
                    }
                    validate() {
                        let e = this.fields.get(Se.SHARING_NOTICE).getValue()
                          , t = this.fields.get(Se.SHARING_OPT_OUT_NOTICE).getValue()
                          , n = this.fields.get(Se.SHARING_OPT_OUT).getValue()
                          , s = this.fields.get(Se.SALE_OPT_OUT_NOTICE).getValue()
                          , i = this.fields.get(Se.SALE_OPT_OUT).getValue()
                          , o = this.fields.get(Se.TARGETED_ADVERTISING_OPT_OUT_NOTICE).getValue()
                          , r = this.fields.get(Se.TARGETED_ADVERTISING_OPT_OUT).getValue()
                          , a = this.fields.get(Se.MSPA_SERVICE_PROVIDER_MODE).getValue()
                          , c = this.fields.get(Se.MSPA_OPT_OUT_OPTION_MODE).getValue()
                          , l = this.fields.get(Se.SENSITIVE_DATA_LIMIT_USE_NOTICE).getValue();
                        if (0 == e) {
                            if (0 != n)
                                throw new m("Invalid usnat sharing notice / opt out combination: {" + e + " / " + n + "}")
                        } else if (1 == e) {
                            if (1 != n && 2 != n)
                                throw new m("Invalid usnat sharing notice / opt out combination: {" + e + " / " + n + "}")
                        } else if (2 == e && 1 != n)
                            throw new m("Invalid usnat sharing notice / opt out combination: {" + e + " / " + n + "}");
                        if (0 == t) {
                            if (0 != n)
                                throw new m("Invalid usnat sharing notice / opt out combination: {" + t + " / " + n + "}")
                        } else if (1 == t) {
                            if (1 != n && 2 != n)
                                throw new m("Invalid usnat sharing notice / opt out combination: {" + t + " / " + n + "}")
                        } else if (2 == t && 1 != n)
                            throw new m("Invalid usnat sharing notice / opt out combination: {" + t + " / " + n + "}");
                        if (0 == s) {
                            if (0 != i)
                                throw new m("Invalid usnat sale notice / opt out combination: {" + s + " / " + i + "}")
                        } else if (1 == s) {
                            if (1 != i && 2 != i)
                                throw new m("Invalid usnat sale notice / opt out combination: {" + s + " / " + i + "}")
                        } else if (2 == s && 1 != i)
                            throw new m("Invalid usnat sale notice / opt out combination: {" + s + " / " + i + "}");
                        if (0 == o) {
                            if (0 != r)
                                throw new m("Invalid usnat targeted advertising notice / opt out combination: {" + o + " / " + r + "}")
                        } else if (1 == o) {
                            if (1 != i && 2 != i)
                                throw new m("Invalid usnat targeted advertising notice / opt out combination: {" + o + " / " + r + "}")
                        } else if (2 == o && 1 != i)
                            throw new m("Invalid usnat targeted advertising notice / opt out combination: {" + o + " / " + r + "}");
                        if (0 == a) {
                            if (0 != s)
                                throw new m("Invalid usnat mspa service provider mode / sale opt out notice combination: {" + a + " / " + s + "}");
                            if (0 != t)
                                throw new m("Invalid usnat mspa service provider mode / sharing opt out notice combination: {" + a + " / " + t + "}");
                            if (0 != l)
                                throw new m("Invalid usnat mspa service provider mode / sensitive data limit use notice combination: {" + a + " / " + l + "}")
                        } else if (1 == a) {
                            if (2 != c)
                                throw new m("Invalid usnat mspa service provider / opt out option modes combination: {" + a + " / " + a + "}");
                            if (0 != s)
                                throw new m("Invalid usnat mspa service provider mode / sale opt out notice combination: {" + a + " / " + s + "}");
                            if (0 != t)
                                throw new m("Invalid usnat mspa service provider mode / sharing opt out notice combination: {" + a + " / " + t + "}");
                            if (0 != l)
                                throw new m("Invalid usnat mspa service provider mode / sensitive data limit use notice combination: {" + a + " / " + l + "}")
                        } else if (2 == a && 1 != c)
                            throw new m("Invalid usnat mspa service provider / opt out option modes combination: {" + a + " / " + c + "}")
                    }
                }
                class Te extends A {
                    constructor(e) {
                        super(),
                        this.base64UrlEncoder = h.getInstance(),
                        this.bitStringEncoder = S.getInstance(),
                        e && this.decode(e)
                    }
                    getFieldNames() {
                        return Ee
                    }
                    initializeFields() {
                        let e = new y;
                        return e.put(Se.GPC_SEGMENT_TYPE.toString(), new O(2,1)),
                        e.put(Se.GPC_SEGMENT_INCLUDED.toString(), new F(!0)),
                        e.put(Se.GPC.toString(), new F(!1)),
                        e
                    }
                    encodeSegment(e) {
                        let t = this.bitStringEncoder.encode(e, this.getFieldNames());
                        return this.base64UrlEncoder.encode(t)
                    }
                    decodeSegment(e, t) {
                        null != e && 0 !== e.length || this.fields.reset(t);
                        try {
                            let n = this.base64UrlEncoder.decode(e);
                            this.bitStringEncoder.decode(n, this.getFieldNames(), t)
                        } catch (t) {
                            throw new d("Unable to decode UsNatGpcSegment '" + e + "'")
                        }
                    }
                }
                class _e extends l {
                    constructor(e) {
                        super(),
                        e && e.length > 0 && this.decode(e)
                    }
                    getId() {
                        return _e.ID
                    }
                    getName() {
                        return _e.NAME
                    }
                    getVersion() {
                        return _e.VERSION
                    }
                    initializeSegments() {
                        let e = [];
                        return e.push(new Ie),
                        e.push(new Te),
                        e
                    }
                    decodeSection(e) {
                        let t = this.initializeSegments();
                        if (null != e && 0 !== e.length) {
                            let n = e.split(".");
                            n.length > 0 && t[0].decode(n[0]),
                            n.length > 1 ? (t[1].setFieldValue(Se.GPC_SEGMENT_INCLUDED, !0),
                            t[1].decode(n[1])) : t[1].setFieldValue(Se.GPC_SEGMENT_INCLUDED, !1)
                        }
                        return t
                    }
                    encodeSection(e) {
                        let t = [];
                        return e.length >= 1 && (t.push(e[0].encode()),
                        e.length >= 2 && !0 === e[1].getFieldValue(Se.GPC_SEGMENT_INCLUDED) && t.push(e[1].encode())),
                        t.join(".")
                    }
                }
                _e.ID = 7,
                _e.VERSION = 1,
                _e.NAME = "usnat";
                class be {
                }
                be.SECTION_ID_NAME_MAP = new Map([[$.ID, $.NAME], [ae.ID, ae.NAME], [he.ID, he.NAME], [_e.ID, _e.NAME]]),
                be.SECTION_ORDER = [$.NAME, ae.NAME, he.NAME, _e.NAME];
                class Oe {
                    constructor(e) {
                        this.sections = new Map,
                        this.encodedString = null,
                        this.decoded = !0,
                        this.dirty = !1,
                        e && this.decode(e)
                    }
                    setFieldValue(e, t, n) {
                        this.decoded || (this.sections = this.decodeModel(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0);
                        let s = null;
                        if (this.sections.has(e) ? s = this.sections.get(e) : e === ae.NAME ? (s = new ae,
                        this.sections.set(ae.NAME, s)) : e === $.NAME ? (s = new $,
                        this.sections.set($.NAME, s)) : e === he.NAME ? (s = new he,
                        this.sections.set(he.NAME, s)) : e === _e.NAME && (s = new _e,
                        this.sections.set(_e.NAME, s)),
                        !s)
                            throw new c(e + "." + t + " not found");
                        s.setFieldValue(t, n),
                        this.dirty = !0
                    }
                    setFieldValueBySectionId(e, t, n) {
                        this.setFieldValue(be.SECTION_ID_NAME_MAP.get(e), t, n)
                    }
                    getFieldValue(e, t) {
                        return this.decoded || (this.sections = this.decodeModel(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0),
                        this.sections.has(e) ? this.sections.get(e).getFieldValue(t) : null
                    }
                    getFieldValueBySectionId(e, t) {
                        return this.getFieldValue(be.SECTION_ID_NAME_MAP.get(e), t)
                    }
                    hasField(e, t) {
                        return this.decoded || (this.sections = this.decodeModel(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0),
                        !!this.sections.has(e) && this.sections.get(e).hasField(t)
                    }
                    hasFieldBySectionId(e, t) {
                        return this.hasField(be.SECTION_ID_NAME_MAP.get(e), t)
                    }
                    hasSection(e) {
                        return this.decoded || (this.sections = this.decodeModel(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0),
                        this.sections.has(e)
                    }
                    hasSectionId(e) {
                        return this.hasSection(be.SECTION_ID_NAME_MAP.get(e))
                    }
                    deleteSection(e) {
                        !this.decoded && null != this.encodedString && this.encodedString.length > 0 && this.decode(this.encodedString),
                        this.sections.delete(e),
                        this.dirty = !0
                    }
                    deleteSectionById(e) {
                        this.deleteSection(be.SECTION_ID_NAME_MAP.get(e))
                    }
                    clear() {
                        this.sections.clear(),
                        this.encodedString = "DBAA",
                        this.decoded = !1,
                        this.dirty = !1
                    }
                    getHeader() {
                        this.decoded || (this.sections = this.decodeModel(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0);
                        let e = new P;
                        return e.setFieldValue("SectionIds", this.getSectionIds()),
                        e.toObj()
                    }
                    getSection(e) {
                        return this.decoded || (this.sections = this.decodeModel(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0),
                        this.sections.has(e) ? this.sections.get(e).toObj() : null
                    }
                    getSectionIds() {
                        this.decoded || (this.sections = this.decodeModel(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0);
                        let e = [];
                        for (let t = 0; t < be.SECTION_ORDER.length; t++) {
                            let n = be.SECTION_ORDER[t];
                            if (this.sections.has(n)) {
                                let t = this.sections.get(n);
                                e.push(t.getId())
                            }
                        }
                        return e
                    }
                    encodeModel(e) {
                        let t = []
                          , n = [];
                        for (let s = 0; s < be.SECTION_ORDER.length; s++) {
                            let i = be.SECTION_ORDER[s];
                            if (e.has(i)) {
                                let s = e.get(i);
                                t.push(s.encode()),
                                n.push(s.getId())
                            }
                        }
                        let s = new P;
                        return s.setFieldValue("SectionIds", n),
                        t.unshift(s.encode()),
                        t.join("~")
                    }
                    decodeModel(e) {
                        if (!e || 0 == e.length || e.startsWith("DB")) {
                            let t = e.split("~")
                              , n = new Map;
                            if (t[0].startsWith("D")) {
                                let s = new P(t[0]).getFieldValue("SectionIds");
                                if (s.length !== t.length - 1)
                                    throw new d("Unable to decode '" + e + "'. The number of sections does not match the number of sections defined in the header.");
                                for (let i = 0; i < s.length; i++) {
                                    if ("" === t[i + 1].trim())
                                        throw new d("Unable to decode '" + e + "'. Section " + (i + 1) + " is blank.");
                                    if (s[i] === ae.ID) {
                                        let e = new ae(t[i + 1]);
                                        n.set(ae.NAME, e)
                                    } else if (s[i] === $.ID) {
                                        let e = new $(t[i + 1]);
                                        n.set($.NAME, e)
                                    } else if (s[i] === he.ID) {
                                        let e = new he(t[i + 1]);
                                        n.set(he.NAME, e)
                                    } else if (s[i] === _e.ID) {
                                        let e = new _e(t[i + 1]);
                                        n.set(_e.NAME, e)
                                    }
                                }
                            }
                            return n
                        }
                        if (e.startsWith("C")) {
                            let t = new Map
                              , n = new $(e);
                            return t.set($.NAME, n),
                            (new P).setFieldValue(i.SECTION_IDS, [2]),
                            t.set(P.NAME, n),
                            t
                        }
                        throw new d("Unable to decode '" + e + "'")
                    }
                    encodeSection(e) {
                        return this.decoded || (this.sections = this.decodeModel(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0),
                        this.sections.has(e) ? this.sections.get(e).encode() : null
                    }
                    encodeSectionById(e) {
                        return this.encodeSection(be.SECTION_ID_NAME_MAP.get(e))
                    }
                    decodeSection(e, t) {
                        let n = null;
                        this.sections.has(e) ? n = this.sections.get(e) : e === ae.NAME ? (n = new ae,
                        this.sections.set(ae.NAME, n)) : e === $.NAME ? (n = new $,
                        this.sections.set($.NAME, n)) : e === he.NAME ? (n = new he,
                        this.sections.set(he.NAME, n)) : e === _e.NAME && (n = new _e,
                        this.sections.set(_e.NAME, n)),
                        n && n.decode(t)
                    }
                    decodeSectionById(e, t) {
                        this.decodeSection(be.SECTION_ID_NAME_MAP.get(e), t)
                    }
                    toObject() {
                        this.decoded || (this.sections = this.decodeModel(this.encodedString),
                        this.dirty = !1,
                        this.decoded = !0);
                        let e = {};
                        for (let t = 0; t < be.SECTION_ORDER.length; t++) {
                            let n = be.SECTION_ORDER[t];
                            this.sections.has(n) && (e[n] = this.sections.get(n).toObj())
                        }
                        return e
                    }
                    encode() {
                        return (null == this.encodedString || 0 === this.encodedString.length || this.dirty) && (this.encodedString = this.encodeModel(this.sections),
                        this.dirty = !1,
                        this.decoded = !0),
                        this.encodedString
                    }
                    decode(e) {
                        this.encodedString = e,
                        this.dirty = !1,
                        this.decoded = !1
                    }
                }
                var ye, Ne, Ae, we, Pe, ve, De, Re;
                !function(e) {
                    e.NOT_READY = "not ready",
                    e.READY = "ready"
                }(ye || (ye = {}));
                class Ve {
                    constructor() {
                        this.gppVersion = "1.1",
                        this.supportedAPIs = [],
                        this.eventQueue = new a(this),
                        this.cmpStatus = n.LOADING,
                        this.cmpDisplayStatus = s.HIDDEN,
                        this.signalStatus = ye.NOT_READY,
                        this.applicableSections = [],
                        this.gppModel = new Oe
                    }
                    reset() {
                        this.eventQueue.clear(),
                        this.cmpStatus = n.LOADING,
                        this.cmpDisplayStatus = s.HIDDEN,
                        this.signalStatus = ye.NOT_READY,
                        this.applicableSections = [],
                        this.supportedAPIs = [],
                        this.gppModel = new Oe,
                        delete this.cmpId,
                        delete this.cmpVersion,
                        delete this.eventStatus
                    }
                }
                !function(e) {
                    e.ADD_EVENT_LISTENER = "addEventListener",
                    e.GET_FIELD = "getField",
                    e.GET_SECTION = "getSection",
                    e.HAS_SECTION = "hasSection",
                    e.PING = "ping",
                    e.REMOVE_EVENT_LISTENER = "removeEventListener"
                }(Ne || (Ne = {}));
                class Ue {
                    constructor(e, t, n) {
                        this.success = !0,
                        this.cmpApiContext = e,
                        Object.assign(this, {
                            callback: t,
                            parameter: n
                        })
                    }
                    execute() {
                        try {
                            return this.respond()
                        } catch (e) {
                            return this.invokeCallback(null),
                            null
                        }
                    }
                    invokeCallback(e) {
                        const t = null !== e;
                        this.callback && this.callback(e, t)
                    }
                }
                class Le {
                }
                Ae = Ne.ADD_EVENT_LISTENER,
                we = Ne.GET_FIELD,
                Pe = Ne.GET_SECTION,
                ve = Ne.HAS_SECTION,
                De = Ne.PING,
                Re = Ne.REMOVE_EVENT_LISTENER,
                Le[Ae] = class extends Ue {
                    respond() {
                        let e = this.cmpApiContext.eventQueue.add({
                            callback: this.callback,
                            parameter: this.parameter
                        })
                          , t = new o("listenerRegistered",e,!0,new r(this.cmpApiContext));
                        this.invokeCallback(t)
                    }
                }
                ,
                Le[we] = class extends Ue {
                    respond() {
                        if (!this.parameter || 0 === this.parameter.length)
                            throw new Error("<section>.<field> parameter required");
                        let e = this.parameter.split(".");
                        if (2 != e.length)
                            throw new Error("Field name must be in the format <section>.<fieldName>");
                        let t = e[0]
                          , n = e[1]
                          , s = null;
                        "tcfeuv2" != this.parameter && (s = this.cmpApiContext.gppModel.getFieldValue(t, n)),
                        this.invokeCallback(s)
                    }
                }
                ,
                Le[Pe] = class extends Ue {
                    respond() {
                        if (!this.parameter || 0 === this.parameter.length)
                            throw new Error("<section> parameter required");
                        let e = null;
                        "tcfeuv2" != this.parameter && this.cmpApiContext.gppModel.hasSection(this.parameter) && (e = this.cmpApiContext.gppModel.getSection(this.parameter)),
                        this.invokeCallback(e)
                    }
                }
                ,
                Le[ve] = class extends Ue {
                    respond() {
                        if (!this.parameter || 0 === this.parameter.length)
                            throw new Error("<section>[.version] parameter required");
                        let e = this.cmpApiContext.gppModel.hasSection(this.parameter);
                        this.invokeCallback(e)
                    }
                }
                ,
                Le[De] = class extends Ue {
                    respond() {
                        let e = new r(this.cmpApiContext);
                        this.invokeCallback(e)
                    }
                }
                ,
                Le[Re] = class extends Ue {
                    respond() {
                        let e = this.parameter
                          , t = this.cmpApiContext.eventQueue.remove(e)
                          , n = new o("listenerRemoved",e,t,new r(this.cmpApiContext));
                        this.invokeCallback(n)
                    }
                }
                ;
                class ke {
                    constructor(t, n) {
                        if (this.cmpApiContext = t,
                        n) {
                            let e = Ne.ADD_EVENT_LISTENER;
                            if (null == n ? void 0 : n[e])
                                throw new Error(`Built-In Custom Commmand for ${e} not allowed`);
                            if (e = Ne.REMOVE_EVENT_LISTENER,
                            null == n ? void 0 : n[e])
                                throw new Error(`Built-In Custom Commmand for ${e} not allowed`);
                            this.customCommands = n
                        }
                        try {
                            this.callQueue = e.__gpp() || []
                        } catch (t) {
                            this.callQueue = []
                        } finally {
                            e.__gpp = this.apiCall.bind(this),
                            this.purgeQueuedCalls()
                        }
                    }
                    apiCall(e, t, n, s) {
                        if ("string" != typeof e)
                            t(null, !1);
                        else {
                            if ("events" === e)
                                return this.cmpApiContext.eventQueue.events();
                            if (t && "function" != typeof t)
                                throw new Error("invalid callback function");
                            this.isCustomCommand(e) ? this.customCommands[e](t, n) : this.isBuiltInCommand(e) ? new Le[e](this.cmpApiContext,t,n).execute() : t && t(null, !1)
                        }
                    }
                    purgeQueuedCalls() {
                        const t = this.callQueue;
                        this.callQueue = [],
                        t.forEach((t => {
                            e.__gpp(...t)
                        }
                        ))
                    }
                    isCustomCommand(e) {
                        return this.customCommands && "function" == typeof this.customCommands[e]
                    }
                    isBuiltInCommand(e) {
                        return void 0 !== Le[e]
                    }
                }
                class Me {
                    static absCall(e, t, n, s) {
                        return new Promise(( (i, o) => {
                            const r = new XMLHttpRequest;
                            r.withCredentials = n,
                            r.addEventListener("load", ( () => {
                                if (r.readyState == XMLHttpRequest.DONE)
                                    if (r.status >= 200 && r.status < 300) {
                                        let e = r.response;
                                        if ("string" == typeof e)
                                            try {
                                                e = JSON.parse(e)
                                            } catch (e) {}
                                        i(e)
                                    } else
                                        o(new Error(`HTTP Status: ${r.status} response type: ${r.responseType}`))
                            }
                            )),
                            r.addEventListener("error", ( () => {
                                o(new Error("error"))
                            }
                            )),
                            r.addEventListener("abort", ( () => {
                                o(new Error("aborted"))
                            }
                            )),
                            null === t ? r.open("GET", e, !0) : r.open("POST", e, !0),
                            r.responseType = "json",
                            r.timeout = s,
                            r.ontimeout = () => {
                                o(new Error("Timeout " + s + "ms " + e))
                            }
                            ,
                            r.send(t)
                        }
                        ))
                    }
                    static post(e, t, n=!1, s=0) {
                        return this.absCall(e, JSON.stringify(t), n, s)
                    }
                    static fetch(e, t=!1, n=0) {
                        return this.absCall(e, null, t, n)
                    }
                }
                class xe extends Error {
                    constructor(e) {
                        super(e),
                        this.name = "GVLError"
                    }
                }
                class Ge {
                    has(e) {
                        return Ge.langSet.has(e)
                    }
                    forEach(e) {
                        Ge.langSet.forEach(e)
                    }
                    get size() {
                        return Ge.langSet.size
                    }
                }
                Ge.langSet = new Set(["BG", "CA", "CS", "DA", "DE", "EL", "EN", "ES", "ET", "FI", "FR", "HR", "HU", "IT", "JA", "LT", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "RU", "SK", "SL", "SV", "TR", "ZH"]);
                var Fe = e && e.__awaiter || function(e, t, n, s) {
                    return new (n || (n = Promise))((function(i, o) {
                        function r(e) {
                            try {
                                c(s.next(e))
                            } catch (e) {
                                o(e)
                            }
                        }
                        function a(e) {
                            try {
                                c(s.throw(e))
                            } catch (e) {
                                o(e)
                            }
                        }
                        function c(e) {
                            var t;
                            e.done ? i(e.value) : (t = e.value,
                            t instanceof n ? t : new n((function(e) {
                                e(t)
                            }
                            ))).then(r, a)
                        }
                        c((s = s.apply(e, t || [])).next())
                    }
                    ))
                }
                ;
                class Be {
                    constructor() {
                        this.consentLanguages = new Ge,
                        this.language = Be.DEFAULT_LANGUAGE,
                        this.ready = !1,
                        this.languageFilename = "purposes-[LANG].json"
                    }
                    static fromVendorList(e) {
                        let t = new Be;
                        return t.populate(e),
                        t
                    }
                    static fromUrl(e) {
                        return Fe(this, void 0, void 0, (function*() {
                            let t = e.baseUrl;
                            if (!t || 0 === t.length)
                                throw new xe("Invalid baseUrl: '" + t + "'");
                            if (/^https?:\/\/vendorlist\.consensu\.org\//.test(t))
                                throw new xe("Invalid baseUrl!  You may not pull directly from vendorlist.consensu.org and must provide your own cache");
                            t.length > 0 && "/" !== t[t.length - 1] && (t += "/");
                            let n = new Be;
                            if (n.baseUrl = t,
                            e.languageFilename ? n.languageFilename = e.languageFilename : n.languageFilename = "purposes-[LANG].json",
                            e.version > 0) {
                                let s = e.versionedFilename;
                                s || (s = "archives/vendor-list-v[VERSION].json");
                                let i = t + s.replace("[VERSION]", String(e.version));
                                n.populate(yield Me.fetch(i))
                            } else {
                                let s = e.latestFilename;
                                s || (s = "vendor-list.json");
                                let i = t + s;
                                n.populate(yield Me.fetch(i))
                            }
                            return n
                        }
                        ))
                    }
                    changeLanguage(e) {
                        return Fe(this, void 0, void 0, (function*() {
                            const t = e.toUpperCase();
                            if (!this.consentLanguages.has(t))
                                throw new xe(`unsupported language ${e}`);
                            if (t !== this.language) {
                                this.language = t;
                                const n = this.baseUrl + this.languageFilename.replace("[LANG]", e);
                                try {
                                    this.populate(yield Me.fetch(n))
                                } catch (e) {
                                    throw new xe("unable to load language: " + e.message)
                                }
                            }
                        }
                        ))
                    }
                    getJson() {
                        return JSON.parse(JSON.stringify({
                            gvlSpecificationVersion: this.gvlSpecificationVersion,
                            vendorListVersion: this.vendorListVersion,
                            tcfPolicyVersion: this.tcfPolicyVersion,
                            lastUpdated: this.lastUpdated,
                            purposes: this.purposes,
                            specialPurposes: this.specialPurposes,
                            features: this.features,
                            specialFeatures: this.specialFeatures,
                            stacks: this.stacks,
                            dataCategories: this.dataCategories,
                            vendors: this.fullVendorList
                        }))
                    }
                    isVendorList(e) {
                        return void 0 !== e && void 0 !== e.vendors
                    }
                    populate(e) {
                        this.purposes = e.purposes,
                        this.specialPurposes = e.specialPurposes,
                        this.features = e.features,
                        this.specialFeatures = e.specialFeatures,
                        this.stacks = e.stacks,
                        this.dataCategories = e.dataCategories,
                        this.isVendorList(e) && (this.gvlSpecificationVersion = e.gvlSpecificationVersion,
                        this.tcfPolicyVersion = e.tcfPolicyVersion,
                        this.vendorListVersion = e.vendorListVersion,
                        this.lastUpdated = e.lastUpdated,
                        "string" == typeof this.lastUpdated && (this.lastUpdated = new Date(this.lastUpdated)),
                        this.vendors = e.vendors,
                        this.fullVendorList = e.vendors,
                        this.mapVendors(),
                        this.ready = !0)
                    }
                    mapVendors(e) {
                        this.byPurposeVendorMap = {},
                        this.bySpecialPurposeVendorMap = {},
                        this.byFeatureVendorMap = {},
                        this.bySpecialFeatureVendorMap = {},
                        Object.keys(this.purposes).forEach((e => {
                            this.byPurposeVendorMap[e] = {
                                legInt: new Set,
                                impCons: new Set,
                                consent: new Set,
                                flexible: new Set
                            }
                        }
                        )),
                        Object.keys(this.specialPurposes).forEach((e => {
                            this.bySpecialPurposeVendorMap[e] = new Set
                        }
                        )),
                        Object.keys(this.features).forEach((e => {
                            this.byFeatureVendorMap[e] = new Set
                        }
                        )),
                        Object.keys(this.specialFeatures).forEach((e => {
                            this.bySpecialFeatureVendorMap[e] = new Set
                        }
                        )),
                        Array.isArray(e) || (e = Object.keys(this.fullVendorList).map((e => +e))),
                        this.vendorIds = new Set(e),
                        this.vendors = e.reduce(( (e, t) => {
                            const n = this.vendors[String(t)];
                            return n && void 0 === n.deletedDate && (n.purposes.forEach((e => {
                                this.byPurposeVendorMap[String(e)].consent.add(t)
                            }
                            )),
                            n.specialPurposes.forEach((e => {
                                this.bySpecialPurposeVendorMap[String(e)].add(t)
                            }
                            )),
                            n.legIntPurposes && n.legIntPurposes.forEach((e => {
                                this.byPurposeVendorMap[String(e)].legInt.add(t)
                            }
                            )),
                            n.impConsPurposes && n.impConsPurposes.forEach((e => {
                                this.byPurposeVendorMap[String(e)].impCons.add(t)
                            }
                            )),
                            n.flexiblePurposes && n.flexiblePurposes.forEach((e => {
                                this.byPurposeVendorMap[String(e)].flexible.add(t)
                            }
                            )),
                            n.features.forEach((e => {
                                this.byFeatureVendorMap[String(e)].add(t)
                            }
                            )),
                            n.specialFeatures.forEach((e => {
                                this.bySpecialFeatureVendorMap[String(e)].add(t)
                            }
                            )),
                            e[t] = n),
                            e
                        }
                        ), {})
                    }
                    getFilteredVendors(e, t, n, s) {
                        const i = e.charAt(0).toUpperCase() + e.slice(1);
                        let o;
                        const r = {};
                        return o = "purpose" === e && n ? this["by" + i + "VendorMap"][String(t)][n] : this["by" + (s ? "Special" : "") + i + "VendorMap"][String(t)],
                        o.forEach((e => {
                            r[String(e)] = this.vendors[String(e)]
                        }
                        )),
                        r
                    }
                    getVendorsWithConsentPurpose(e) {
                        return this.getFilteredVendors("purpose", e, "consent")
                    }
                    getVendorsWithLegIntPurpose(e) {
                        return this.getFilteredVendors("purpose", e, "legInt")
                    }
                    getVendorsWithFlexiblePurpose(e) {
                        return this.getFilteredVendors("purpose", e, "flexible")
                    }
                    getVendorsWithSpecialPurpose(e) {
                        return this.getFilteredVendors("purpose", e, void 0, !0)
                    }
                    getVendorsWithFeature(e) {
                        return this.getFilteredVendors("feature", e)
                    }
                    getVendorsWithSpecialFeature(e) {
                        return this.getFilteredVendors("feature", e, void 0, !0)
                    }
                    narrowVendorsTo(e) {
                        this.mapVendors(e)
                    }
                    get isReady() {
                        return this.ready
                    }
                    static isInstanceOf(e) {
                        return "object" == typeof e && "function" == typeof e.narrowVendorsTo
                    }
                }
                Be.DEFAULT_LANGUAGE = "EN";
                var ze = e && e.__awaiter || function(e, t, n, s) {
                    return new (n || (n = Promise))((function(i, o) {
                        function r(e) {
                            try {
                                c(s.next(e))
                            } catch (e) {
                                o(e)
                            }
                        }
                        function a(e) {
                            try {
                                c(s.throw(e))
                            } catch (e) {
                                o(e)
                            }
                        }
                        function c(e) {
                            var t;
                            e.done ? i(e.value) : (t = e.value,
                            t instanceof n ? t : new n((function(e) {
                                e(t)
                            }
                            ))).then(r, a)
                        }
                        c((s = s.apply(e, t || [])).next())
                    }
                    ))
                }
                ;
                class We {
                    constructor(e, t, n) {
                        this.cmpApiContext = new Ve,
                        this.cmpApiContext.cmpId = e,
                        this.cmpApiContext.cmpVersion = t,
                        this.callResponder = new ke(this.cmpApiContext,n)
                    }
                    fireEvent(e, t) {
                        this.cmpApiContext.eventQueue.exec(e, t)
                    }
                    fireErrorEvent(e) {
                        this.cmpApiContext.eventQueue.exec("error", e)
                    }
                    fireSectionChange(e) {
                        this.cmpApiContext.eventQueue.exec("sectionChange", e)
                    }
                    getEventStatus() {
                        return this.cmpApiContext.eventStatus
                    }
                    setEventStatus(e) {
                        this.cmpApiContext.eventStatus = e
                    }
                    getCmpStatus() {
                        return this.cmpApiContext.cmpStatus
                    }
                    setCmpStatus(e) {
                        this.cmpApiContext.cmpStatus = e,
                        this.cmpApiContext.eventQueue.exec("cmpStatus", e)
                    }
                    getCmpDisplayStatus() {
                        return this.cmpApiContext.cmpDisplayStatus
                    }
                    setCmpDisplayStatus(e) {
                        this.cmpApiContext.cmpDisplayStatus = e,
                        this.cmpApiContext.eventQueue.exec("cmpDisplayStatus", e)
                    }
                    getSignalStatus() {
                        return this.cmpApiContext.signalStatus
                    }
                    setSignalStatus(e) {
                        this.cmpApiContext.signalStatus = e,
                        this.cmpApiContext.eventQueue.exec("signalStatus", e)
                    }
                    getApplicableSections() {
                        return this.cmpApiContext.applicableSections
                    }
                    setApplicableSections(e) {
                        this.cmpApiContext.applicableSections = e
                    }
                    getSupportedAPIs() {
                        return this.cmpApiContext.supportedAPIs
                    }
                    setSupportedAPIs(e) {
                        this.cmpApiContext.supportedAPIs = e
                    }
                    setGppString(e) {
                        this.cmpApiContext.gppModel.decode(e)
                    }
                    getGppString() {
                        return this.cmpApiContext.gppModel.encode()
                    }
                    setSectionString(e, t) {
                        this.cmpApiContext.gppModel.decodeSection(e, t)
                    }
                    setSectionStringById(e, t) {
                        this.setSectionString(be.SECTION_ID_NAME_MAP.get(e), t)
                    }
                    getSectionString(e) {
                        return this.cmpApiContext.gppModel.encodeSection(e)
                    }
                    getSectionStringById(e) {
                        return this.getSectionString(be.SECTION_ID_NAME_MAP.get(e))
                    }
                    setFieldValue(e, t, n) {
                        this.cmpApiContext.gppModel.setFieldValue(e, t, n)
                    }
                    setFieldValueBySectionId(e, t, n) {
                        this.setFieldValue(be.SECTION_ID_NAME_MAP.get(e), t, n)
                    }
                    getFieldValue(e, t) {
                        return this.cmpApiContext.gppModel.getFieldValue(e, t)
                    }
                    getFieldValueBySectionId(e, t) {
                        return this.getFieldValue(be.SECTION_ID_NAME_MAP.get(e), t)
                    }
                    getSection(e) {
                        return this.cmpApiContext.gppModel.getSection(e)
                    }
                    getSectionById(e) {
                        return this.getSection(be.SECTION_ID_NAME_MAP.get(e))
                    }
                    hasSection(e) {
                        return this.cmpApiContext.gppModel.hasSection(e)
                    }
                    hasSectionId(e) {
                        return this.hasSection(be.SECTION_ID_NAME_MAP.get(e))
                    }
                    deleteSection(e) {
                        this.cmpApiContext.gppModel.deleteSection(e)
                    }
                    deleteSectionById(e) {
                        this.deleteSection(be.SECTION_ID_NAME_MAP.get(e))
                    }
                    clear() {
                        this.cmpApiContext.gppModel.clear()
                    }
                    getObject() {
                        return this.cmpApiContext.gppModel.toObject()
                    }
                    getGvlFromVendorList(e) {
                        return Be.fromVendorList(e)
                    }
                    getGvlFromUrl(e) {
                        return ze(this, void 0, void 0, (function*() {
                            return Be.fromUrl(e)
                        }
                        ))
                    }
                }
                e.WBD = e.WBD || {},
                e.WM = e.WM || {},
                function(e, t) {
                    if ("function" != typeof e.CustomEvent) {
                        var n = function(e, n) {
                            var s;
                            return n = n || {
                                bubbles: !1,
                                cancelable: !1,
                                detail: void 0
                            },
                            (s = t.createEvent("CustomEvent")).initCustomEvent(e, n.bubbles, n.cancelable, n.detail),
                            s
                        };
                        n.prototype = e.Event.prototype,
                        e.CustomEvent = n,
                        "function" !== e.Event && (e.Event = n)
                    }
                }(e, t),
                e.WBD.UserConsent = e.WBD.UserConsent || function(e, t) {
                    var n, s = "", i = 0, o = {}, r = {}, a = !1, c = [], l = "", d = 0, u = "", g = null, p = null, h = "unknown", S = {}, f = !1, E = {}, C = "", m = "", I = "", T = "", _ = {
                        tcfeuv2: 2,
                        tcfcav1: 5,
                        uspv1: 6,
                        usnat: 7
                    }, b = null, O = 1, y = "", N = "", A = null, w = !1, P = !1, v = !1, D = !1, R = !1, V = "en", U = {
                        binary: !0,
                        boolean: !0,
                        trinary: !0,
                        integer: !0
                    }, L = "", k = "", M = !1, x = "4.1.33", G = null, F = !1, B = !1, z = null, W = !1, H = !1, j = !1, q = !1, Y = null, K = "", Q = {
                        addtlConsentCookie: "OTAdditionalConsentString",
                        adCategories: ["data-share", "data-sell", "data-store", "ads-contextual", "ads-person-prof", "ads-person"],
                        adChoicesLinkAction: "https://www.wbdprivacy.com/policycenter/b2c/",
                        adChoicesLinkTitle: {
                            ar: "اختيارات الإعلان",
                            de: "Anzeigenauswahl",
                            en: "Ad Choices",
                            es: "Elecciones de anuncios",
                            fr: "Choix d’annonces"
                        },
                        affiliatesLinkAction: "https://www.wbdprivacy.com/policycenter/affiliates/",
                        affiliatesLinkTitle: {
                            ar: "الشركات التابعة",
                            en: "Affiliates",
                            de: "Mitgliedsorganisationen",
                            es: "Afiliadas",
                            fr: "Affiliées"
                        },
                        categories: {
                            req: "required",
                            dsa: "data-store",
                            cad: "ads-contextual",
                            pap: "ads-person-prof",
                            pad: "ads-person",
                            pcp: "content-person-prof",
                            pcd: "content-person",
                            map: "measure-ads",
                            mcp: "measure-content",
                            mra: "measure-market",
                            pdd: "product-develop",
                            ccd: "content-contextual",
                            sec: "product-security",
                            tdc: "deliver-content",
                            scp: "privacy-choices",
                            cos: "combine-data",
                            dlk: "link-devices",
                            did: "id-devices",
                            gld: "geolocate",
                            sid: "scan-devices",
                            ftc: "1p-targeting",
                            dsh: "data-share",
                            dsl: "data-sell",
                            pdu: "personal-data",
                            kc12: "known-child-12",
                            kc17: "known-child-17",
                            sdre: "sensitive-racial",
                            sdrb: "sensitive-belief",
                            sdhe: "sensitive-health",
                            sdso: "sensitive-sexual",
                            sdir: "sensitive-citizen",
                            sdge: "sensitive-gene",
                            sdbm: "sensitive-biometric",
                            sdsp: "sensitive-spi",
                            sdss: "sensitive-ssi",
                            sduo: "sensitive-org",
                            sdco: "sensitive-comm"
                        },
                        ccCookie: "countryCode",
                        ccpaGeos: ["US:CA", "US:CO", "US:CT", "US:DE", "US:IA", "US:MD", "US:MN", "US:MT", "US:NE", "US:NH", "US:NJ", "US:OR", "US:RI", "US:TN", "US:TX", "US:UT", "US:VA"],
                        compatCategories: {
                            vendor: ["data-share", "data-sell", "ads-contextual", "ads-person-prof", "ads-person"],
                            "targeted-ads": ["ads-person-prof", "ads-person"],
                            "sensitive-geo": ["geolocate"]
                        },
                        confirmCookie: "OptanonAlertBoxClosed",
                        consentChangeAction: null,
                        consentChangeActionDelay: 500,
                        consentCookie: "OptanonConsent",
                        consentDefaults: {
                            required: !0,
                            "data-store": !0,
                            "ads-contextual": !0,
                            "ads-person": !0,
                            "ads-person-prof": !0,
                            "content-person": !0,
                            "content-person-prof": !0,
                            "measure-ads": !0,
                            "measure-content": !0,
                            "measure-market": !0,
                            "product-develop": !0,
                            "content-contextual": !0,
                            "product-security": !0,
                            "deliver-content": !0,
                            "privacy-choices": !0,
                            "combine-data": !0,
                            "link-devices": !0,
                            "id-devices": !0,
                            geolocate: !1,
                            "scan-devices": !1,
                            "1p-targeting": !0,
                            "data-share": !0,
                            "data-sell": !0,
                            "personal-data": !1,
                            "known-child-12": !1,
                            "known-child-17": !1,
                            "sensitive-racial": !1,
                            "sensitive-belief": !1,
                            "sensitive-health": !1,
                            "sensitive-sexual": !1,
                            "sensitive-citizen": !1,
                            "sensitive-gene": !1,
                            "sensitive-biometric": !1,
                            "sensitive-spi": !1,
                            "sensitive-ssi": !1,
                            "sensitive-org": !1,
                            "sensitive-comm": !1
                        },
                        consentExpireIn: 1,
                        consentNotApplicable: ["personal-data", "known-child-12", "known-child-17", "sensitive-racial", "sensitive-belief", "sensitive-health", "sensitive-sexual", "sensitive-citizen", "sensitive-gene", "sensitive-biometric", "geolocate", "sensitive-spi", "sensitive-ssi", "sensitive-org", "sensitive-comm"],
                        consentLinkTitle: {
                            ar: "ملفات تعريف الارتباط",
                            de: "Cookie-Einstellungen",
                            en: "Cookie Settings",
                            es: "Configuración de Cookies",
                            fr: "Paramètres des Cookies"
                        },
                        controlCookie: "OptanonControl",
                        cookieSameSite: "Lax",
                        cookieSecure: !1,
                        defaultCountry: "US",
                        defaultLanguage: "en",
                        defaultState: "",
                        enableDebug: !1,
                        enableGPC: !0,
                        enableTransitionCheck: !0,
                        enableWebViewCheck: !0,
                        gdprIabCookie: "eupubconsent-v2",
                        geoCheckFunction: null,
                        geoPassedToOneTrust: !0,
                        gpcFixCookie: "",
                        gppCategories: {
                            usnat: [{
                                field: "SharingNotice",
                                type: "trinary",
                                default: 1
                            }, {
                                field: "SaleOptOutNotice",
                                type: "trinary",
                                default: 1
                            }, {
                                field: "SharingOptOutNotice",
                                type: "trinary",
                                default: 1
                            }, {
                                field: "TargetedAdvertisingOptOutNotice",
                                type: "trinary",
                                default: 1
                            }, {
                                field: "SensitiveDataProcessingOptOutNotice",
                                type: "trinary",
                                default: 0
                            }, {
                                field: "SensitiveDataLimitUseNotice",
                                type: "trinary",
                                default: 0
                            }, {
                                field: "SaleOptOut",
                                type: "trinary",
                                val: "data-sell"
                            }, {
                                field: "SharingOptOut",
                                type: "trinary",
                                val: "data-share"
                            }, {
                                field: "TargetedAdvertisingOptOut",
                                type: "trinary",
                                val: ["ads-person-prof", "ads-person"]
                            }, {
                                field: "SensitiveDataProcessing",
                                type: "array-trinary",
                                default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                maxCount: 12,
                                0: "sensitive-racial",
                                1: "sensitive-belief",
                                2: "sensitive-health",
                                3: "sensitive-sexual",
                                4: "sensitive-citizen",
                                5: "sensitive-gene",
                                6: "sensitive-biometric",
                                7: "geolocate",
                                8: "sensitive-spi",
                                9: "sensitive-ssi",
                                10: "sensitive-org",
                                11: "sensitive-comm"
                            }, {
                                field: "KnownChildSensitiveDataConsents",
                                type: "array-trinary",
                                default: [0, 0],
                                maxCount: 2,
                                0: "known-child-12",
                                1: "known-child-17"
                            }, {
                                field: "PersonalDataConsents",
                                type: "trinary",
                                default: 0,
                                val: "personal-data"
                            }, {
                                field: "MspaCoveredTransaction",
                                type: "trinary",
                                default: 1
                            }, {
                                field: "MspaOptOutOptionMode",
                                type: "trinary",
                                default: 1
                            }, {
                                field: "MspaServiceProviderMode",
                                type: "trinary",
                                default: 2
                            }],
                            uspv1: [{
                                field: "OptOutSale",
                                type: "binary",
                                val: ["data-share", "data-sell", "ads-person-prof", "ads-person"]
                            }]
                        },
                        gppIabCookie: "OTGPPConsent",
                        gppSection: "",
                        iabRegion: "",
                        languageFromBrowser: !0,
                        oneTrustLoadTimeout: 15e3,
                        privacyCenterLinkAction: "https://www.wbdprivacy.com/policycenter/b2c/",
                        privacyCenterLinkTitle: {
                            ar: "سياسة خصوصية المستهلك",
                            de: "Datenschutzhinweise",
                            en: "Privacy Policy",
                            es: "Política de Privacidad",
                            fr: "Politique de Confidentialité"
                        },
                        regionChangeAction: null,
                        regions: [{
                            id: "us",
                            adCategories: ["data-share", "data-sell", "ads-person-prof", "ads-person"],
                            compatCodes: {
                                ven: ["dsh", "dsl", "pap", "pad"],
                                tpv: ["dsh", "dsl", "pap", "pad"]
                            },
                            compatTransition: {
                                cond: !1,
                                new: ["dsh", "dsl", "pap", "pad"],
                                old: "ven"
                            },
                            consentExpireIn: 3,
                            consentGpcDefaults: {
                                "data-share": !1,
                                "data-sell": !1,
                                "ads-person-prof": !1,
                                "ads-person": !1
                            },
                            consentImpliedDefaults: {
                                "data-store": !0,
                                "ads-contextual": !0,
                                "content-person": !0,
                                "content-person-prof": !0,
                                "measure-ads": !0,
                                "measure-content": !0,
                                "measure-market": !0,
                                "product-develop": !0,
                                "content-contextual": !0,
                                "product-security": !0,
                                "deliver-content": !0,
                                "privacy-choices": !0,
                                "combine-data": !0,
                                "link-devices": !0,
                                "id-devices": !0,
                                "1p-targeting": !0,
                                geolocate: !1,
                                "scan-devices": !1
                            },
                            consentLinkTitle: {
                                ar: "لا تبيع أو تشارك معلوماتي الشخصية",
                                de: "Nicht Verkauf oder Nicht Weitergabe Ihrer personenbezogenen Daten zu stellen",
                                en: "Do Not Sell Or Share My Personal Information",
                                es: "No Venda Vi Comparta Mi Información Personal",
                                fr: "Ne pas vendre ni partager mes informations personnelles"
                            },
                            rightsRequestLinkAction: "https://www.wbdprivacy.com/policycenter/usstatesupplement/en-us/",
                            geoMatch: ["US:CA", "US:CO", "US:CT", "US:DE", "US:IA", "US:MD", "US:MN", "US:MT", "US:NE", "US:NH", "US:NJ", "US:OR", "US:RI", "US:TN", "US:TX", "US:UT", "US:VA"],
                            gppSection: "usnat",
                            iabRegion: "ccpa"
                        }, {
                            id: "gdpr",
                            adCategories: ["data-store", "ads-contextual", "ads-person-prof", "ads-person"],
                            consentDefaults: {
                                "data-store": !1,
                                "ads-contextual": !1,
                                "ads-person-prof": !1,
                                "ads-person": !1,
                                "content-person-prof": !1,
                                "content-person": !1,
                                "measure-ads": !1,
                                "measure-content": !1,
                                "measure-market": !1,
                                "product-develop": !1,
                                "content-contextual": !1,
                                "combine-data": !1,
                                "link-devices": !1,
                                "id-devices": !1
                            },
                            consentImpliedDefaults: {
                                "product-security": !0,
                                "deliver-content": !0,
                                "privacy-choices": !0,
                                "combine-data": !0,
                                "link-devices": !0,
                                "id-devices": !0,
                                "1p-targeting": !0,
                                geolocate: !1,
                                "scan-devices": !1,
                                "data-share": !0,
                                "data-sell": !0
                            },
                            consentLinkTitle: {
                                ar: "إدارة ملفات تعريف الارتباط+",
                                de: "Cookies Verwalten+",
                                en: "Manage Cookies+",
                                es: "Administrar cookies+",
                                fr: "Gérer les Cookies+"
                            },
                            geoMatch: ["GB", "DE", "FR", "IT", "ES", "PL", "RO", "NL", "BE", "GR", "CZ", "PT", "SE", "HU", "AT", "BG", "DK", "FI", "SK", "IE", "HR", "LT", "SI", "LV", "EE", "CY", "LU", "MT", "NO", "IS", "LI", "CH"],
                            iabRegion: "gdpr"
                        }, {
                            id: "other-optin",
                            consentDefaults: {
                                "ads-contextual": !1,
                                "ads-person-prof": !1,
                                "ads-person": !1,
                                "content-person-prof": !1,
                                "content-person": !1,
                                "measure-ads": !1,
                                "measure-content": !1,
                                "measure-market": !1,
                                "product-develop": !1,
                                "content-contextual": !1,
                                "combine-data": !1,
                                "link-devices": !1,
                                "id-devices": !1
                            },
                            consentImpliedDefaults: {
                                "product-security": !0,
                                "deliver-content": !0,
                                "privacy-choices": !0,
                                "combine-data": !0,
                                "link-devices": !0,
                                "id-devices": !0,
                                "1p-targeting": !0,
                                geolocate: !1,
                                "scan-devices": !1,
                                "data-store": !0,
                                "data-share": !0,
                                "data-sell": !0
                            },
                            geoMatch: ["CA", "CO", "UY", "PE", "AR", "CR", "CL"]
                        }, {
                            id: "other-optout",
                            consentImpliedDefaults: {
                                "product-security": !0,
                                "deliver-content": !0,
                                "privacy-choices": !0,
                                "combine-data": !0,
                                "link-devices": !0,
                                "id-devices": !0,
                                "1p-targeting": !0,
                                geolocate: !1,
                                "scan-devices": !1,
                                "data-store": !0,
                                "data-share": !0,
                                "data-sell": !0
                            },
                            geoMatch: ["MX", "PY", "BR", "VE", "NI"]
                        }, {
                            id: "global",
                            geoMatch: ["*"],
                            useFixedConsent: !0
                        }],
                        reloadOnConsentChange: !0,
                        reloadOnConsentReduction: !1,
                        rightsRequestLinkAction: "https://www.wbdprivacy.com/policycenter/b2c/",
                        rightsRequestLinkTitle: {
                            ar: "بوابة طلبات الحقوق الفردية",
                            de: "Anfrageportal für Individualrechte",
                            en: "Individual Rights Request Portal",
                            es: "Portal de solicitud de derechos individuales",
                            fr: "Portail de demande de droits des individus"
                        },
                        scCookie: "stateCode",
                        setPageClass: !0,
                        src: "https://cdn.cookielaw.org/scripttemplates/otSDKStub.js",
                        strictIabCompliance: !0,
                        tcfOpts: {
                            categories: {
                                purposes: ["data-store", "ads-contextual", "ads-person-prof", "ads-person", "content-person-prof", "content-person", "measure-ads", "measure-content", "measure-market", "product-develop", "content-contextual"],
                                specialPurposes: ["product-security", "deliver-content", "privacy-choices"],
                                features: ["combine-data", "link-devices", "id-devices"],
                                specialFeatures: ["geolocate", "scan-devices"]
                            },
                            policies: {
                                2: {
                                    iabMaxPurposes: 10,
                                    iabMaxSpecialFeats: 2
                                },
                                3: {
                                    iabMaxPurposes: 10,
                                    iabMaxSpecialFeats: 2
                                },
                                4: {
                                    iabMaxPurposes: 11,
                                    iabMaxSpecialFeats: 2
                                },
                                5: {
                                    iabMaxPurposes: 11,
                                    iabMaxSpecialFeats: 2
                                }
                            }
                        },
                        ucFlavor: "iab",
                        useFixedConsent: !1,
                        useGPP: !0,
                        useIAB: !0,
                        useIabString: !0,
                        uspApiCookieName: "usprivacy",
                        uspApiExplicitNotice: !0,
                        uspApiIsLspa: !1
                    };
                    function J(e) {
                        const t = Array.prototype.slice.call(arguments);
                        t[0] = "[WMUC]" + (0 === C.length ? "" : " (" + C + ")") + ":",
                        "error" === e ? console.error.apply(console, t) : console.log.apply(console, t)
                    }
                    function X(e) {
                        const n = t.cookie.match(new RegExp("(^|;) *" + e + " *= *([^;]+)"));
                        return n ? n.pop() : null
                    }
                    function Z(e, n, s) {
                        e && (s = s || {},
                        t.cookie = e + "=" + ("string" == typeof n ? n : "") + "; Domain=" + (s.domain || r.cookieDomain) + "; Path=" + (s.path || "/") + (s.maxage ? "; Max-Age=" + s.maxage : s.expires ? "; Expires=" + s.expires : "") + (s.secure ? "; Secure" : "") + (s.samesite ? "; SameSite=" + s.samesite : ""))
                    }
                    function $(t) {
                        if ("function" == typeof e.atob)
                            try {
                                return atob(t.replace(/_/g, "/").replace(/-/g, "+"))
                            } catch (e) {
                                J("error", "Failed to decode TC string")
                            }
                        return ""
                    }
                    function ee(e) {
                        return !!Number(e)
                    }
                    function te(e) {
                        return parseInt(e, 2) || 0
                    }
                    function ne(e) {
                        return 100 * te(e)
                    }
                    function se(e) {
                        const t = "A".charCodeAt()
                          , n = e.match(/.{6}/g) || [];
                        let s = "";
                        for (let e = 0; e < n.length; e++)
                            s += String.fromCharCode(te(n[e]) + t);
                        return s
                    }
                    function ie(e) {
                        const t = e.split("");
                        let n = {};
                        for (let e = 0; e < t.length; e++)
                            ee(t[e]) && (n[e + 1] = !0);
                        return n
                    }
                    function oe(e) {
                        let t = !1;
                        for (let n = 0; n < e.length; n++)
                            if (e[n])
                                if (m === e[n] || T === e[n] || "*" === e[n] || e[n] === r.regId)
                                    t = !0;
                                else if ("!" === e[n].charAt(0)) {
                                    let s = e[n].substring(1);
                                    if (m === s || T === s || r.regId === s) {
                                        t = !1;
                                        break
                                    }
                                }
                        return t
                    }
                    function re(e, t) {
                        let n = t ? new Date(t) : new Date;
                        return n.setUTCFullYear(n.getUTCFullYear() + e),
                        n
                    }
                    function ae(e) {
                        let t;
                        return t = "object" == typeof e && null !== e ? e[V] || e[r.defaultLanguage] || "" : "string" == typeof e ? e : "",
                        t
                    }
                    function ce(e) {
                        let t = {};
                        if (e)
                            for (let s = 0; s < n.length; s++)
                                t[n[s]] = e[n[s]];
                        else
                            J("error", "Critical Error: Attempt to read or copy consent before UserConsent is initialized!");
                        return t
                    }
                    function le(e, t) {
                        if (t) {
                            e = e || {};
                            for (let s = 0; s < n.length; s++)
                                "boolean" == typeof t[n[s]] && (e[n[s]] = t[n[s]])
                        }
                        return e
                    }
                    function de(n) {
                        if (n > 0) {
                            const s = 1 === n ? "Stub load failure" : 2 === n ? "Initialization failure" : 3 === n ? "SDK load timeout" : "Unknown error";
                            J("error", "OneTrust Error (", n, "): ", s),
                            e.WBD.UserConsent_wait >= 0 && (clearTimeout(e.WBD.UserConsent_wait),
                            e.WBD.UserConsent_wait = -1),
                            D = !0,
                            f && J("debug", "Dispatching oneTrustFailed event."),
                            t.dispatchEvent(new CustomEvent("oneTrustFailed",{
                                bubbles: !1,
                                cancelable: !1,
                                detail: {
                                    region: r.regId,
                                    time: new Date,
                                    consentConfirmed: a,
                                    otId: l,
                                    otVers: h,
                                    code: n,
                                    msg: s
                                }
                            }))
                        }
                    }
                    function ue() {
                        if (!w) {
                            if (e.OneTrust && "function" == typeof e.OneTrust.getGeolocationData) {
                                let t = e.OneTrust.getGeolocationData();
                                !t || t.country === m && t.state === I ? w = !0 : "function" == typeof e.OneTrust.setGeoLocation ? (e.OneTrust.setGeoLocation(m, I),
                                w = !0) : e.OneTrustStub && "function" == typeof e.OneTrustStub.setGeoLocation && (e.OneTrustStub.setGeoLocation(m, I),
                                w = !0)
                            } else
                                e.OneTrustStub && "function" == typeof e.OneTrustStub.setGeoLocation && (e.OneTrustStub.setGeoLocation(m, I),
                                w = !0);
                            f && J("debug", w ? "Set OneTrust geo-location." : "Not yet able to set OneTrust geo-location.")
                        }
                    }
                    function ge(e, t, s) {
                        let i = b.getFieldValue(e, t.field)
                          , o = t.type.toLowerCase()
                          , a = (e, t, i) => {
                            const o = "string" == typeof t ? [t] : t
                              , a = "boolean" === i ? e : "trinary" === i ? 2 === e : 0 !== e;
                            for (let e of o)
                                (0 === r.consentNotApplicable.length || r.consentNotApplicable.indexOf(e) < 0) && (n.indexOf(e) >= 0 && r.consentNotApplicable.indexOf(e) < 0 ? s[e] = a : J("error", 'Invalid consent "' + e + '" specified in GPP Categories!'))
                        }
                        ;
                        if (o.startsWith("array"))
                            if (o = o.substring(6),
                            U[o] && t.maxCount && Array.isArray(i))
                                for (let e = 0; e < t.maxCount; e++)
                                    t[e] && a(i[e], t[e], o);
                            else
                                J("error", 'Error: Unparsable data type "' + o + '" or missing maxCount in GPP Categories "' + t.field + '" value!');
                        else
                            t.val && (U[o] ? a(i, void 0 !== t.val ? t.val : t.default, o) : J("error", 'Error: Unparsable data type "' + o + '" in GPP Categories!'))
                    }
                    function pe(e, t, s) {
                        let i = b.getFieldValue(e, t.field)
                          , o = t.type.toLowerCase()
                          , r = (e, t) => {
                            const i = "string" == typeof e ? [e] : e;
                            let o = 0
                              , r = !0;
                            for (let e of i)
                                n.indexOf(e) >= 0 ? void 0 !== s[e] && (r = r && s[e],
                                o++) : J("error", 'Invalid consent "' + e + '" specified in GPP Categories!');
                            return o > 0 ? "boolean" === t ? r : "trinary" === t ? r ? 2 : 1 : r ? 1 : 0 : "boolean" !== t && 0
                        }
                        ;
                        try {
                            if (o.startsWith("array")) {
                                if (o = o.substring(6),
                                !U[o])
                                    throw "unparse";
                                if (!t.maxCount || !Array.isArray(i))
                                    throw "badarray";
                                for (let e = 0; e < t.maxCount; e++)
                                    t[e] ? i[e] = r(t[e], o) : t.default && void 0 !== t.default[e] && (i[e] = t.default[e])
                            } else {
                                if (!U[o])
                                    throw "unparse";
                                t.val ? i = r(t.val, o) : void 0 !== t.default && (i = t.default)
                            }
                            b.setFieldValue(e, t.field, i)
                        } catch (e) {
                            J("error", "unparse" === e ? 'Error: Unparsable data type "' + o + '" in GPP Categories!' : "badarray" === e ? 'Error: Missing maxCount or bad array in GPP Categories "' + t.field + '" value!' : 'Failed to set GPP field "' + t.field + '" value!')
                        }
                    }
                    function he(e, t) {
                        const n = y
                          , s = r.gppSection;
                        if ("string" == typeof e && e.length > 0)
                            try {
                                b.setGppString(e),
                                (y = e) && b.hasSection(s) && b.setApplicableSections([_[s]]),
                                f && J("debug", "GPP string set from CMP: ", e)
                            } catch (e) {
                                return J("error", "Failed to set GPP string: ", e),
                                !1
                            }
                        else {
                            if ("object" != typeof t || null === t || !Array.isArray(r.gppCategories[r.gppSection]))
                                return J("error", "Failed to set GPP string, invalid parameters."),
                                !1;
                            try {
                                if (y || b.setApplicableSections([_[s]]),
                                Array.isArray(r.gppCategories[s])) {
                                    const e = r.gppCategories[s];
                                    for (let n of e)
                                        "object" == typeof n && null !== n && n.field && pe(s, n, t)
                                }
                                B && b.setFieldValue(s, "Gpc", B),
                                (y = b.getGppString()) && b.hasSection(s) && (b.setApplicableSections([_[s]]),
                                !1 === q && 0 !== n.length && n !== y && b.fireSectionChange(s)),
                                f && J("debug", "GPP string set from consent state: ", y)
                            } catch (e) {
                                return J("error", "Failed to set GPP string: ", e),
                                !1
                            }
                        }
                        return !0
                    }
                    function Se(t) {
                        let n;
                        return r.useExternalConsent || function() {
                            let e = X(r.consentCookie);
                            if (e && e.indexOf("&groups=") >= 0) {
                                const t = e.split("&");
                                for (let e = 0; e < t.length; e++) {
                                    let n = t[e];
                                    if (n) {
                                        let e = n.split("=")
                                          , t = e[0]
                                          , s = e[1];
                                        "version" === t && s ? h = s : "consentId" === t && s && (l = s)
                                    }
                                }
                                return !0
                            }
                            return !1
                        }() || (a = !1,
                        p = null),
                        !a || r.useFixedConsent ? (n = ce(r.consentDefaults),
                        u = "defaults") : j && (r.useExternalConsent || r.gppIabCookie) && (n = function(t) {
                            const n = r.gppSection;
                            let s = "string" == typeof t ? t : ""
                              , i = "CMP"
                              , o = null;
                            if (0 === s.length && (r.useExternalConsent ? (s = e.OTExternalConsent.gppString || "",
                            i = "external consent") : (s = function(e) {
                                let t;
                                if (null === (t = X(e))) {
                                    t = "";
                                    for (let n = 1, s = null; "" !== s && n < 10; n++,
                                    t += s)
                                        s = X(e + n.toString(10)) || ""
                                }
                                return t
                            }(r.gppIabCookie) || "",
                            i = "cookie")),
                            "" === s)
                                return f && J("debug", "No GPP string present."),
                                null;
                            try {
                                b.setGppString(s)
                            } catch (e) {
                                return J("error", "GPP string invalid, ignoring."),
                                null
                            }
                            if (!b.hasSection(n) || !Array.isArray(r.gppCategories[n]))
                                return f && J("debug", "GPP string present, but for different region/section."),
                                null;
                            b.setApplicableSections([_[n]]);
                            const a = r.gppCategories[n];
                            o = ce(r.consentDefaults);
                            for (let e of a)
                                "object" == typeof e && null !== e && e.field && ge(n, e, o);
                            return r.useExternalConsent || (b.getFieldValue(n, "GpcSegmentIncluded") && !b.getFieldValue(n, "Gpc") === B && (b.setFieldValue(n, "Gpc", B),
                            s = b.getGppString()),
                            B && (o = le(o, r.consentGpcDefaults))),
                            s !== y && (y = s),
                            f && J("debug", "Processed GPP string from " + i + ": " + y),
                            o
                        }(t)) ? u = t ? "gpp string" : r.useExternalConsent ? "external GPP consent" : r.gppIabCookie + " cookie" : H && (r.useExternalConsent && e.OTExternalConsent.tcString || r.gdprIabCookie) && (n = function(t, n) {
                            let i = null;
                            if (!0 === r.useExternalConsent && e.OTExternalConsent.tcString || "string" == typeof t && 0 !== t.length) {
                                let o, a;
                                if (!0 === r.useExternalConsent && e.OTExternalConsent.tcString ? (L = e.OTExternalConsent.tcString,
                                o = "external consent",
                                a = o,
                                s = e.OTExternalConsent.addtlConsent ? e.OTExternalConsent.addtlConsent : "") : (L = X(t),
                                o = '"' + t + '" cookie',
                                a = '"' + n + '" cookie',
                                null === (s = "string" == typeof n && 0 !== n.length ? X(n) : "") && (s = "")),
                                L && r.useIabString) {
                                    const e = function(e) {
                                        let t = 0
                                          , n = {}
                                          , s = function(e, t, n, s) {
                                            let i = () => {
                                                if (s.pubRestrictionEntry && s.rangeEntry)
                                                    for (let e in s.rangeEntry)
                                                        Object.prototype.hasOwnProperty.call(s.rangeEntry, e) && (s.pubRestrictionEntry[e] = (s.pubRestrictionEntry[e] || []).concat(s.rangeEntry[e]));
                                                s.numPubRestrictions && (s.numPubRestrictions--,
                                                e.push({
                                                    key: "purposeId",
                                                    size: 6
                                                }, {
                                                    key: "restrictionType",
                                                    size: 2
                                                }, {
                                                    key: "numEntries",
                                                    size: 12
                                                }))
                                            }
                                              , o = () => {
                                                s.numEntries ? (s.numEntries--,
                                                e.push({
                                                    key: "isARange",
                                                    size: 1,
                                                    decoder: ee
                                                }, {
                                                    key: "startVendorId",
                                                    size: 16
                                                })) : i()
                                            }
                                              , r = () => !s.purposeId || [{
                                                purpose: s.purposeId,
                                                isAllowed: 0 !== s.restrictionType,
                                                isConsentRequired: 1 === s.restrictionType,
                                                isLegitimateInterestRequired: 2 === s.restrictionType
                                            }];
                                            if ("isRangeEncoding" === t.key)
                                                e.push(n ? {
                                                    key: "numEntries",
                                                    size: 12
                                                } : {
                                                    key: "bitField",
                                                    size: s.maxVendorId,
                                                    decoder: ie
                                                });
                                            else if ("numEntries" === t.key)
                                                s.rangeEntry = {},
                                                o();
                                            else if ("isARange" === t.key)
                                                n && e.push({
                                                    key: "endVendorId",
                                                    size: 16
                                                });
                                            else if ("startVendorId" === t.key)
                                                s.isARange || (s.rangeEntry[n] = r(),
                                                o());
                                            else if ("endVendorId" === t.key) {
                                                for (let e = s.startVendorId; e <= s.endVendorId; e += 1)
                                                    s.rangeEntry[e] = r();
                                                o()
                                            } else
                                                "numCustomPurposes" === t.key ? e.push({
                                                    key: "customPurposeConsents",
                                                    size: s.numCustomPurposes,
                                                    decoder: ie
                                                }, {
                                                    key: "customPurposeLegitimateInterests",
                                                    size: s.numCustomPurposes,
                                                    decoder: ie
                                                }) : "numPubRestrictions" === t.key && (s.pubRestrictionEntry = {},
                                                i())
                                        }
                                          , i = e => e.pubRestrictionEntry || e.rangeEntry || e.bitField || e
                                          , o = (e, n) => {
                                            const s = n.slice(t, t + e.size);
                                            return t += e.size,
                                            (e.decoder || te)(s)
                                        }
                                          , r = (e, t) => {
                                            let n = {};
                                            if (!e.queue)
                                                return o(e, t);
                                            for (let i = 0; i < e.queue.length; i += 1) {
                                                let r = e.queue[i]
                                                  , a = o(r, t);
                                                r.key && (n[r.key] = a),
                                                s(e.queue, r, a, n)
                                            }
                                            return i(n)
                                        }
                                          , a = (e, t) => {
                                            let n = {};
                                            for (let i = 0; i < e.queue.length; i++) {
                                                let o = e.queue[i]
                                                  , a = r(o, t);
                                                o.key && (n[o.key] = a),
                                                s(e.queue, o, a, n)
                                            }
                                            return i(n)
                                        }
                                        ;
                                        const c = function(e) {
                                            let t, n = [];
                                            if ("string" != typeof e)
                                                return J("error", "Invalid TC string specified"),
                                                n;
                                            t = e.split(".");
                                            for (let e = 0; e < t.length; e++) {
                                                let s = $(t[e])
                                                  , i = "";
                                                for (let e = 0; e < s.length; e++) {
                                                    let t = s.charCodeAt(e).toString(2);
                                                    i += "00000000".slice(0, 8 - t.length) + t
                                                }
                                                n.push(i)
                                            }
                                            return 2 !== te(n[0].slice(0, 6)) ? (J("error", "Unsupported TC string version"),
                                            []) : n
                                        }(e)
                                          , l = function(e) {
                                            const t = [{
                                                key: "purposeConsents",
                                                size: 24,
                                                decoder: ie
                                            }, {
                                                key: "purposeLegitimateInterests",
                                                size: 24,
                                                decoder: ie
                                            }]
                                              , n = [{
                                                key: "maxVendorId",
                                                size: 16
                                            }, {
                                                key: "isRangeEncoding",
                                                size: 1,
                                                decoder: ee
                                            }]
                                              , s = [{
                                                key: "version",
                                                size: 6
                                            }, {
                                                key: "created",
                                                size: 36,
                                                decoder: ne
                                            }, {
                                                key: "lastUpdated",
                                                size: 36,
                                                decoder: ne
                                            }, {
                                                key: "cmpId",
                                                size: 12
                                            }, {
                                                key: "cmpVersion",
                                                size: 12
                                            }, {
                                                key: "consentScreen",
                                                size: 6
                                            }, {
                                                key: "consentLanguage",
                                                size: 12,
                                                decoder: se
                                            }, {
                                                key: "vendorListVersion",
                                                size: 12
                                            }, {
                                                key: "tcfPolicyVersion",
                                                size: 6
                                            }, {
                                                key: "isServiceSpecific",
                                                size: 1,
                                                decoder: ee
                                            }, {
                                                key: "useNonStandardStacks",
                                                size: 1,
                                                decoder: ee
                                            }, {
                                                key: "specialFeatureOptins",
                                                size: 12,
                                                decoder: ie
                                            }].concat(t).concat({
                                                key: "purposeOneTreatment",
                                                size: 1,
                                                decoder: ee
                                            }, {
                                                key: "publisherCountryCode",
                                                size: 12,
                                                decoder: se
                                            }, {
                                                key: "vendorConsents",
                                                queue: [{
                                                    key: "maxVendorId",
                                                    size: 16
                                                }, {
                                                    key: "isRangeEncoding",
                                                    size: 1,
                                                    decoder: ee
                                                }]
                                            }, {
                                                key: "vendorLegitimateInterests",
                                                queue: n
                                            }, {
                                                key: "publisherRestrictions",
                                                queue: [{
                                                    key: "numPubRestrictions",
                                                    size: 12
                                                }]
                                            })
                                              , i = [{
                                                size: 3
                                            }]
                                              , o = [].concat(i).concat(n)
                                              , r = [].concat(i).concat(n)
                                              , a = [].concat(i).concat(t).concat({
                                                key: "numCustomPurposes",
                                                size: 6
                                            });
                                            let c = [{
                                                key: "core",
                                                queue: s
                                            }];
                                            for (let t = 1; t < e.length; t++) {
                                                let n = te(e[t].slice(0, 3));
                                                1 === n ? c.push({
                                                    key: "disclosedVendors",
                                                    queue: o
                                                }) : 2 === n ? c.push({
                                                    key: "allowedVendors",
                                                    queue: r
                                                }) : 3 === n && c.push({
                                                    key: "publisherTC",
                                                    queue: a
                                                })
                                            }
                                            return c
                                        }(c);
                                        for (let e = 0; e < l.length; e++) {
                                            let s = a(l[e], c[e]);
                                            l[e].key && (n[l[e].key] = s),
                                            t = 0
                                        }
                                        return n
                                    }(L);
                                    if (e && e.core && "object" == typeof r.tcfOpts.policies[e.core.tcfPolicyVersion] && e.core.purposeConsents) {
                                        let t, n, c, l, d, u = r.tcfOpts.policies[e.core.tcfPolicyVersion], g = e.core.purposeConsents, p = e.core.purposeLegitimateInterests || {}, h = e.core.specialFeatureOptins || {};
                                        for (f && J("debug", "Processed TC string (policy " + e.core.tcfPolicyVersion + ") from " + o + ": ", e),
                                        k = e.core.tcfPolicyVersion,
                                        i = ce(r.consentImpliedDefaults),
                                        t = 1; t <= r.tcfOpts.categories.purposes.length; t++)
                                            if (c = r.tcfOpts.categories.purposes[t - 1],
                                            c && "unused" !== c)
                                                for (l = Array.isArray(c) ? c : [c],
                                                n = 0; n < l.length; n++)
                                                    c = l[n],
                                                    c && "unused" !== c && "required" !== c && (d = t <= u.iabMaxPurposes ? "boolean" == typeof g[t] ? g[t] : "boolean" == typeof p[t] ? p[t] : "boolean" == typeof r.consentImpliedDefaults[c] && r.consentImpliedDefaults[c] : "boolean" == typeof r.consentImpliedDefaults[c] && r.consentImpliedDefaults[c],
                                                    i[c] = "boolean" == typeof i[c] ? i[c] && d : d);
                                        for (t = 1; t <= r.tcfOpts.categories.specialFeatures.length; t++)
                                            if (c = r.tcfOpts.categories.specialFeatures[t - 1],
                                            c && "unused" !== c)
                                                for (l = Array.isArray(c) ? c : [c],
                                                n = 0; n < l.length; n++)
                                                    c = l[n],
                                                    c && "unused" !== c && "required" !== c && (d = t <= u.iabMaxSpecialFeats && "boolean" == typeof h[t] ? h[t] : "boolean" == typeof r.consentImpliedDefaults[c] && r.consentImpliedDefaults[c],
                                                    i[c] = "boolean" == typeof i[c] ? i[c] && d : d);
                                        0 !== s.length && -1 === s.search(/^\d+~[\d\.]*$/) && (J("error", "Error: Invalid AC string in " + a + "."),
                                        s = "")
                                    } else
                                        J("error", "Error: Invalid TC string in " + o + "."),
                                        L = "",
                                        s = ""
                                } else
                                    r.useIabString ? (L = "",
                                    s = "") : f && J("debug", "Bypassed parsing TC string.")
                            }
                            return i
                        }(r.gdprIabCookie, r.addtlConsentCookie)) ? u = r.useExternalConsent ? "external TCF consent" : r.gdprIabCookie + " cookie" : (n = function() {
                            let t = X(r.consentCookie)
                              , n = null;
                            if (r.useExternalConsent && (t = "groups=" + encodeURIComponent(e.OTExternalConsent.groups),
                            B = !1),
                            t && t.indexOf("&groups=") >= 0) {
                                const e = t.split("&");
                                for (let t = 0; t < e.length; t++) {
                                    let s = e[t];
                                    if (s) {
                                        let e = s.split("=")
                                          , t = e[0]
                                          , i = e[1];
                                        if ("groups" === t && i) {
                                            let e = decodeURIComponent(i).split(",")
                                              , t = []
                                              , s = []
                                              , o = 0
                                              , a = !1;
                                            n = le(ce(r.consentDefaults), r.consentImpliedDefaults);
                                            for (let i = 0; i < e.length; i++) {
                                                let c = e[i].split(":")
                                                  , l = c[0].toLowerCase()
                                                  , d = "1" === c[1];
                                                l && (r.categories[l] ? (n[r.categories[l]] = d,
                                                "required" !== r.categories[l] && o++) : (r.compatTransition && r.compatTransition.old === l && r.compatTransition.cond === d && (a = !0),
                                                r.compatCodes[l] && (t.push(l),
                                                s.push(d))))
                                            }
                                            if (0 === o && t.length > 0) {
                                                F = !0;
                                                for (let e = 0; e < t.length; e++) {
                                                    let i = r.compatCodes[t[e]];
                                                    i && !Array.isArray(i) && (i = [i]);
                                                    for (let t of i) {
                                                        let i = r.categories[t];
                                                        i && (n[i] = s[e],
                                                        o++)
                                                    }
                                                }
                                            } else if (a && r.compatTransition.new)
                                                if (Array.isArray(r.compatTransition.new))
                                                    for (let e = 0; e < r.compatTransition.new.length; e++)
                                                        n[r.categories[r.compatTransition.new[e]]] = r.compatTransition.cond,
                                                        o++;
                                                else
                                                    n[r.categories[r.compatTransition.new]] = r.compatTransition.cond,
                                                    o++;
                                            0 === o && (n = null)
                                        }
                                    }
                                }
                            }
                            return n
                        }()) ? u = r.useExternalConsent ? "external consent" : r.consentCookie + " cookie" : (n = ce(r.consentDefaults),
                        u = "defaults"),
                        r.useExternalConsent || B && (n = le(n, r.consentGpcDefaults)),
                        n
                    }
                    function fe() {
                        return ce(g)
                    }
                    function Ee() {
                        return M
                    }
                    function Ce() {
                        return !M
                    }
                    function me() {
                        return P
                    }
                    function Ie() {
                        return null !== g
                    }
                    function Te(e, t) {
                        const n = "iab-" + (r.iabRegion || "N/A")
                          , s = "gpp-" + (r.gppSection || "N/A");
                        let i = !0
                          , o = "not ready";
                        if (t = t || {},
                        Ie() && e) {
                            e = Array.isArray(e) ? e : [e],
                            t.checkIAB && r.useIAB && "" !== r.iabRegion && e.unshift(t.checkIAB);
                            for (let a = 0; a < e.length && i; a++)
                                if (o = e[a],
                                o && "required" !== o)
                                    if ("gpp" === o || "iab-gpp" === o || o === s) {
                                        if (j && (!t || !t.ignoreIAB))
                                            break
                                    } else if ("iab" === o || o === n) {
                                        if (r.useIAB && "" !== r.iabRegion && (!t || !t.ignoreIAB))
                                            break
                                    } else if ("boolean" == typeof g[o] && !1 === g[o])
                                        i = !1;
                                    else if (r.compatCategories[o]) {
                                        let e = r.compatCategories[o];
                                        for (let t = 0; t < e.length; t++) {
                                            let n = e[t];
                                            if ("boolean" == typeof g[n] && !1 === g[n]) {
                                                i = !1;
                                                break
                                            }
                                        }
                                    }
                        }
                        return f && !t.internal && (t.name = t.name || t.id || "unnamed",
                        c.push({
                            ts: new Date,
                            act: t.cact || "CHK",
                            desc: t.name,
                            res: i,
                            note: !i && o || ""
                        }),
                        J("debug", i ? "Check for consent [" + (e && e.join(",") || "empty") + '] ALLOWS "' + t.name + '"' + ("ADD" === t.cact ? ", script added" : "") : "Check for consent [" + (e && e.join(",") || "empty") + '] REJECTS "' + t.name + '"' + ("ADD" === t.cact ? ", script NOT added" : ""))),
                        i
                    }
                    function _e() {
                        let e;
                        return e = W ? "1" + (r.uspApiExplicitNotice ? "Y" : "N") + (Te(["vendor"], {
                            internal: !0
                        }) ? "N" : "Y") + (r.uspApiIsLspa ? "Y" : "N") : "1---",
                        e !== K && (K = e,
                        Ce() && (null === Y && Z(r.uspApiCookieName, e, {
                            domain: r.cookieDomain,
                            path: "/",
                            samesite: r.cookieSameSite,
                            secure: r.cookieSecure
                        }),
                        f && J("debug", "USP string updated: ", e))),
                        K
                    }
                    function be() {
                        let n = function(n, s, i) {
                            let o, r, a = t.createElement(i || "div");
                            return n && (a.id = n),
                            s && (a.className = s),
                            a.style.width = "1px",
                            a.style.display = "block",
                            a = t.body.appendChild(a),
                            o = e.getComputedStyle(a),
                            r = "none" === o.display,
                            a.remove(),
                            r
                        };
                        t.body ? (v = n("onetrust-consent-sdk", "ot-cookie-consent") || n("ot-lst-cnt", "ot-sdk-show-settings") || n("onetrust-pc-sdk", "otPcCenter ot-fade-in") || n("ot-pc-header", "onetrust-pc-dark-filter") || n("ot-pc-content", "ot-pc-scrollbar") || n("ot-sdk-btn", "ot_cookie_settings_btn") || !1) && (f && J("debug", "OneTrust being blocked by filter."),
                        t.dispatchEvent(new CustomEvent("oneTrustBlocked",{
                            bubbles: !1,
                            cancelable: !1,
                            detail: {
                                region: r.regId,
                                time: new Date,
                                consentConfirmed: a,
                                otId: l,
                                otVers: h
                            }
                        }))) : setTimeout(be.bind(e), 5)
                    }
                    function Oe() {
                        e.location.reload()
                    }
                    function ye(n) {
                        if (!e.frames[n]) {
                            if (t.body) {
                                const e = t.createElement("iframe");
                                e.style.cssText = "display:none",
                                e.name = n,
                                t.body.appendChild(e)
                            } else
                                setTimeout(ye.bind(e, n), 5);
                            return !0
                        }
                        return !1
                    }
                    function Ne(t) {
                        let n = null;
                        for (let s = e; s; s = s.parent) {
                            try {
                                if (s.frames && s.frames[t]) {
                                    n = s;
                                    break
                                }
                            } catch (e) {}
                            if (s === e.top)
                                break
                        }
                        return n
                    }
                    function Ae(t) {
                        e.addEventListener ? e.addEventListener("message", t, !1) : e.attachEvent("onmessage", t)
                    }
                    function we(e) {
                        S = e || {
                            ccpaTCS: K,
                            consentInteractions: d,
                            consentTime: p,
                            consentVersion: h,
                            countryCode: m,
                            region: r.regId,
                            stateCode: I,
                            userConsentVersion: x
                        },
                        Ce() && Z(r.controlCookie, "ccc=" + S.countryCode + "&csc=" + S.stateCode + "&cic=" + S.consentInteractions + "&otvers=" + S.consentVersion + "&pctm=" + (S.consentTime && encodeURIComponent(S.consentTime.toISOString()) || "0") + "&reg=" + S.region + "&ustcs=" + encodeURIComponent(S.ccpaTCS) + "&vers=" + S.userConsentVersion, {
                            domain: r.cookieDomain,
                            expires: re(r.consentExpireIn).toUTCString(),
                            path: "/",
                            samesite: r.cookieSameSite,
                            secure: r.cookieSecure
                        })
                    }
                    function Pe() {
                        const t = X(r.confirmCookie);
                        if ("string" == typeof t && 0 !== t.length) {
                            let n = new Date(t);
                            if (!e.isNaN(n.valueOf()))
                                return n
                        }
                        return null
                    }
                    function ve(i) {
                        const o = Pe()
                          , u = a
                          , E = p
                          , C = e.OneTrust && "function" == typeof e.OneTrust.GetDomainData ? e.OneTrust.GetDomainData() : null;
                        let m, I = !1, T = !1, _ = "";
                        if (C)
                            try {
                                _ = C.ConsentIntegrationData.consentPayload.dsDataElements.InteractionType
                            } catch (e) {
                                _ = ""
                            }
                        o && (null === p || o > p) && (a = !0,
                        p = o),
                        i && !j && (i = ""),
                        m = Se(i);
                        for (let e of n)
                            if (m[e] !== g[e] && (I = !0,
                            !0 !== m[e])) {
                                T = !0;
                                break
                            }
                        if (I || !u && a) {
                            const n = e.WBD.UserConsent_wrapproc > 0 ? new Date(e.WBD.UserConsent_wrapproc) : null;
                            let o;
                            if (d++,
                            n && (null === p || n.getTime() > p.getTime() + r.consentChangeActionDelay + 1e3) && (p = n),
                            o = g,
                            g = m,
                            _e(),
                            j && he(i, m),
                            we(),
                            I) {
                                if (f)
                                    try {
                                        c.push({
                                            ts: new Date,
                                            act: "CHG",
                                            desc: JSON.stringify(m),
                                            res: r.reloadOnConsentChange || r.reloadOnConsentReduction && T,
                                            note: "function" == typeof r.consentChangeAction ? "change function" : ""
                                        })
                                    } catch (e) {
                                        J("error", "Failed to track consent change: ", e)
                                    }
                                if ("function" == typeof r.consentChangeAction && r.consentChangeAction(fe(), r.regId, h, o),
                                t.dispatchEvent(new CustomEvent("userConsentChanged",{
                                    bubbles: !1,
                                    cancelable: !1,
                                    detail: {
                                        region: r.regId,
                                        time: p,
                                        otId: l,
                                        otVers: h,
                                        otIact: _,
                                        old: o,
                                        new: fe(),
                                        gpcActive: B,
                                        gpp: y,
                                        gppCmpId: O,
                                        gppVers: N,
                                        usp: K,
                                        tcf: L,
                                        tcfVers: k,
                                        acf: s
                                    }
                                })),
                                r.reloadOnConsentChange || T && r.reloadOnConsentReduction)
                                    setTimeout(Oe, 500);
                                else if (Ce())
                                    try {
                                        e.sessionStorage.setItem("_ucWBDCons", JSON.stringify({
                                            consentState: g,
                                            consentTime: p,
                                            consentVersion: h,
                                            consentConfirmed: a,
                                            gppString: y,
                                            tcString: L,
                                            acString: s
                                        })),
                                        e.postMessage("_ucWBDConsReset", "*")
                                    } catch (e) {
                                        J("error", "Failed to update session storage and notify children of consent change: ", e)
                                    }
                            }
                        }
                        if (!I && e.WBD.UserConsent_optLoaded) {
                            try {
                                c.push({
                                    ts: new Date,
                                    act: "NCC",
                                    desc: JSON.stringify(g),
                                    res: !1,
                                    note: r.regId
                                })
                            } catch (e) {
                                J("error", "Failed to track consent no-change: ", e)
                            }
                            p = E,
                            (!S.region || !S.consentVersion && h || !S.userConsentVersion || S.userConsentVersion < "3.1.1") && we(),
                            t.dispatchEvent(new CustomEvent("userConsentNotChanged",{
                                bubbles: !1,
                                cancelable: !1,
                                detail: {
                                    region: r.regId,
                                    time: p,
                                    otId: l,
                                    otVers: h,
                                    otIact: _,
                                    new: fe(),
                                    gpcActive: B,
                                    gpp: y,
                                    gppCmpId: O,
                                    gppVers: N,
                                    usp: K,
                                    tcf: L,
                                    tcfVers: k,
                                    acf: s
                                }
                            }))
                        }
                        e.WBD.UserConsent_optLoaded = !0,
                        e.WBD.UserConsent_wrapproc = 0
                    }
                    function De(l) {
                        let O, N, v, U = !1, k = null;
                        if (null !== g)
                            return;
                        if (!l || !l.domId || !l.cookieDomain)
                            throw new Error("Invalid config passed to user-consent!");
                        if (l.regId = "",
                        v = Ne("_usrConWBD"),
                        null !== v)
                            if (e === e.top)
                                J("error", "Detected an instance of UserConsent in an iframe acting as the primary instance.  This was likely caused by a delay in this instance initializing, which must be corrected.  Consent is not working correctly!");
                            else {
                                let t, i;
                                C = e.name || "child";
                                try {
                                    t = JSON.parse(e.sessionStorage.getItem("_ucWBDConf"))
                                } catch (e) {
                                    t = null,
                                    J("error", "Failed to parse parent frame consent settings.")
                                }
                                if ("object" == typeof t && null !== t) {
                                    l.countryCode = t.countryCode,
                                    l.cookieDomain = t.cookieDomain,
                                    l.cookieSameSite = t.cookieSameSite,
                                    l.cookieSecure = t.cookieSecure,
                                    l.domId = t.domId,
                                    l.languageFromBrowser = !!t.langFromBrowser,
                                    l.enableDebug = !!t.enableDebug,
                                    l.enableGPC = !!t.enableGPC,
                                    l.regId = t.regId,
                                    l.stateCode = t.stateCode,
                                    l.src = t.src;
                                    try {
                                        i = JSON.parse(e.sessionStorage.getItem("_ucWBDCons"))
                                    } catch (e) {
                                        i = null,
                                        J("error", "Failed to parse parent frame consent state.")
                                    }
                                    "object" == typeof i && null !== i && (g = i.consentState,
                                    p = i.consentTime,
                                    h = i.consentVersion,
                                    a = i.consentConfirmed,
                                    y = i.gppString,
                                    L = i.tcString,
                                    s = i.acString,
                                    M = !0),
                                    t.parentReload || Ae((function(t) {
                                        var i, o;
                                        if ("_ucWBDConsReset" === t.data) {
                                            try {
                                                o = JSON.parse(e.sessionStorage.getItem("_ucWBDCons"))
                                            } catch (e) {
                                                o = null
                                            }
                                            "object" == typeof o && null !== o && (i = function(e, t) {
                                                if (e && t)
                                                    for (let s = 0; s < n.length; s++)
                                                        if (e[n[s]] && !t[n[s]])
                                                            return !0;
                                                return !1
                                            }(g, o.consentState),
                                            r.reloadOnConsentChange || i && r.reloadOnConsentReduction ? setTimeout(Oe, 600 + r.consentChangeActionDelay) : (g = o.consentState,
                                            p = o.consentTime,
                                            h = o.consentVersion,
                                            a = o.consentConfirmed,
                                            y = o.gppString || "",
                                            L = o.tcString || "",
                                            s = o.acString || "",
                                            _e()))
                                        }
                                    }
                                    ))
                                }
                            }
                        if (void 0 === l.gppCategories)
                            l.gppCategories = Q.gppCategories;
                        else {
                            for (N in l.gppCategories)
                                "usnatv1" === N ? (l.gppCategories.usnat = l.gppCategories.usnatv1,
                                delete l.gppCategories.usnatv1) : "uspnatv1" === N ? (l.gppCategories.uspv1 = l.gppCategories.uspnatv1,
                                delete l.gppCategories.uspnatv1) : _[N] || (J("error", 'Error: Unsupported GPP section "' + N + '" ignored.'),
                                delete l.gppCategories[N]);
                            for (N in Q.gppCategories)
                                l.gppCategories[N] = l.gppCategories[N] || Q.gppCategories[N]
                        }
                        for (N in Q)
                            r[N] = void 0 !== l[N] ? l[N] : Q[N];
                        if (Q = null,
                        r.cookieDomain = l.cookieDomain,
                        r.domId = l.domId,
                        r.changeRegions = l.changeRegions,
                        (f = !(!console || !l.enableDebug && -1 === e.location.search.search(/[?&]wmuc_debug=[1t]/))) && J("debug", "Initializing UserConsent v" + x + " (" + r.ucFlavor + ")"),
                        r.strictIabCompliance = !!r.strictIabCompliance,
                        "string" == typeof l.countryCode && 2 === l.countryCode.length && (r.countryCode = l.countryCode),
                        "string" == typeof l.stateCode && 2 === l.stateCode.length && (r.stateCode = l.stateCode),
                        "" !== r.gpcFixCookie && function(t) {
                            if (void 0 === e.navigator.globalPrivacyControl && t) {
                                const n = X(t);
                                if (n && ("1" === n || n.startsWith("t")))
                                    try {
                                        Object.defineProperty(e.Navigator.prototype, "globalPrivacyControl", {
                                            get: function() {
                                                return !0
                                            },
                                            configurable: !0,
                                            enumerable: !0
                                        })
                                    } catch (e) {
                                        J("error", "GPC signal error in browser.")
                                    }
                            }
                        }(r.gpcFixCookie),
                        "object" == typeof e.GetExternalConsent && null !== e.GetExternalConsent && "function" == typeof e.GetExternalConsent.oneTrustCookie) {
                            let t;
                            try {
                                t = JSON.parse(e.GetExternalConsent.oneTrustCookie())
                            } catch (e) {
                                t = null
                            }
                            "object" == typeof t && null !== t && t.consentedDate && (t.gppString || t.tcString || t.groups) && (t.gppString = t.gppString || "",
                            e.OTExternalConsent = t),
                            "function" == typeof e.GetExternalConsent.countryCode && e.GetExternalConsent.countryCode() && (e.ExternalConsentGeo = {
                                countryCode: e.GetExternalConsent.countryCode(),
                                stateCode: e.GetExternalConsent.stateCode() || ""
                            })
                        }
                        r.enableWebViewCheck && "object" == typeof e.OTExternalConsent && null !== e.OTExternalConsent && e.OTExternalConsent.consentedDate && (e.OTExternalConsent.groups || e.OTExternalConsent.gppString || e.OTExternalConsent.tcString) ? (r.useExternalConsent = !0,
                        f && J("debug", "Reading consent from external consent data: ", e.OTExternalConsent)) : r.useExternalConsent = !1;
                        const K = "function" == typeof r.geoCheckFunction ? r.geoCheckFunction() : null;
                        if (Ce() && f && -1 !== e.location.search.search(/[?&]wmuc_cc=[A-Za-z]{2}/))
                            J("debug", "Set debug CC to: ", m = e.location.search.match(/[?&]wmuc_cc=([A-Za-z]{2})/)[1].toUpperCase());
                        else if (r.useExternalConsent && "object" == typeof e.ExternalConsentGeo && "string" == typeof e.ExternalConsentGeo.countryCode && 2 === e.ExternalConsentGeo.countryCode.length)
                            J("debug", "Set external CC to: ", m = e.ExternalConsentGeo.countryCode.toUpperCase());
                        else if ("string" == typeof r.countryCode && 2 === r.countryCode.length)
                            m = r.countryCode.toUpperCase();
                        else if (K && K.countryCode && 2 === K.countryCode.length)
                            m = K.countryCode.toUpperCase();
                        else {
                            const e = X(r.ccCookie || "countryCode");
                            e && 2 === e.length && (m = e.toUpperCase())
                        }
                        if (m && 2 === m.length || J("error", "User-Consent unable to determine country, missing or invalid cookies!  Using default (" + (m = r.defaultCountry && 2 == r.defaultCountry.length ? r.defaultCountry.toUpperCase() : "US") + ")."),
                        f && -1 !== e.location.search.search(/[?&]wmuc_sc=[A-Za-z]{2}/))
                            J("debug", "Set debug SC to: ", I = e.location.search.match(/[?&]wmuc_sc=([A-Za-z]{2})/)[1].toUpperCase());
                        else if (r.useExternalConsent && "object" == typeof e.ExternalConsentGeo && "string" == typeof e.ExternalConsentGeo.stateCode && 2 === e.ExternalConsentGeo.stateCode.length)
                            J("debug", "Set external SC to: ", I = e.ExternalConsentGeo.stateCode.toUpperCase());
                        else if ("string" == typeof r.stateCode && 2 === r.stateCode.length)
                            I = r.stateCode.toUpperCase();
                        else if (K && K.countryCode && 2 === K.countryCode.length)
                            I = "string" == typeof K.stateCode ? K.stateCode.toUpperCase() : "";
                        else {
                            const e = X(r.scCookie || "stateCode");
                            e && 2 === e.length && (I = e.toUpperCase())
                        }
                        if (I && 0 !== I.length || (I = r.defaultState && r.defaultState.length > 0 ? r.defaultState.toUpperCase() : "",
                        f && J("debug", "User-Consent unable to determine state.  Using default (" + I + ").")),
                        T = m + ":" + I,
                        Ce()) {
                            !w && r.geoPassedToOneTrust && (e.OneTrust = e.OneTrust || {},
                            e.OneTrust.geolocationResponse = {
                                countryCode: m,
                                stateCode: I
                            });
                            let t = function(t) {
                                r.geoPassedToOneTrust && ue(),
                                P && !r.useExternalConsent && null !== g && 0 === e.WBD.UserConsent_wrapproc && (e.WBD.UserConsent_wrapproc = (new Date).getTime(),
                                f && J("debug", "Consent changed event handler determining consent changes."),
                                j && q ? e.__gpp("ping", (function(e) {
                                    e && e.gppString && ve(e.gppString)
                                }
                                )) : setTimeout(ve, r.consentChangeActionDelay))
                            };
                            e.addEventListener ? e.addEventListener("OneTrustGroupsUpdated", t, !1) : e.attachEvent("OneTrustGroupsUpdated", t)
                        }
                        O = Object.keys(r.categories),
                        n = [];
                        for (let e = 0; e < O.length; e++)
                            n.push(r.categories[O[e]]);
                        if (r.changeRegions) {
                            for (let e of ["remove", "replace", "insert"])
                                if (r.changeRegions[e] && Array.isArray(r.changeRegions[e]) && 0 !== r.changeRegions[e].length) {
                                    N = r.changeRegions[e];
                                    for (let t = 0; t < N.length; t++)
                                        if ("object" == typeof N[t] && null !== N[t] && N[t].id) {
                                            let n = r.regions.length
                                              , s = N[t]
                                              , i = "insert" === e && s.insertAfter ? s.insertAfter : s.id
                                              , o = 0;
                                            for (; o < n && (!r.regions[o] || !r.regions[o].id || r.regions[o].id !== i); o++)
                                                ;
                                            "remove" === e ? o < n && delete r.regions[o] : "replace" === e ? o < n && (r.regions[o] = s) : "insert" === e && (o < n ? s.insertAfter ? (delete s.insertAfter,
                                            r.regions.splice(o + 1, 0, s)) : r.regions[o] = s : (delete s.insertAfter,
                                            r.regions.splice(o + 1, 0, s)))
                                        }
                                }
                            delete r.changeRegions
                        }
                        for (let e = 0; e < r.regions.length; e++)
                            if (r.regions[e] && r.regions[e].id && r.regions[e].geoMatch) {
                                if (Ce() && oe(r.regions[e].geoMatch) || Ee() && r.regions[e].id === l.regId) {
                                    k = r.regions[e];
                                    break
                                }
                            } else
                                J("error", "Invalid region, missing id or geoMatch!");
                        if (!k) {
                            if (Ee())
                                throw new Error("No matching user-consent region, parent and iframe configs do not match!");
                            throw new Error("No matching user-consent region!")
                        }
                        r.regId = k.id,
                        r.defaultLanguage = (k.defaultLanguage || r.defaultLanguage).toLowerCase();
                        try {
                            let n = "";
                            r.languageFromBrowser || (n = t.getElementsByTagName("html")[0].getAttribute("xml:lang") || t.documentElement.lang || r.defaultLanguage),
                            n || (n = e.navigator.language || r.defaultLanguage),
                            V = n ? n.substr(0, 2).toLowerCase() : "en"
                        } catch (e) {
                            V = "en"
                        }
                        if (f && -1 !== e.location.search.search(/[?&]wmuc_lang=[A-Za-z]{2}/)) {
                            let t = e.location.search.match(/[?&]wmuc_lang=([A-Za-z]{2})/)[1].toLowerCase();
                            U = V !== t,
                            J("debug", "Set debug Language to: ", V = t)
                        }
                        if (r.adCategories = k.adCategories || r.adCategories || [],
                        r.adChoicesLinkAction = k.adChoicesLinkAction || r.adChoicesLinkAction || null,
                        r.adChoicesLinkTitle = ae(k.adChoicesLinkTitle || r.adChoicesLinkTitle),
                        r.affiliatesLinkAction = k.affiliatesLinkAction || r.affiliatesLinkAction || null,
                        r.affiliatesLinkTitle = ae(k.affiliatesLinkTitle || r.affiliatesLinkTitle),
                        r.compatTransition = r.enableTransitionCheck && k.compatTransition ? k.compatTransition : null,
                        r.compatCategories = k.compatCategories || r.compatCategories || {},
                        r.compatCodes = k.compatCodes || r.compatCodes || {},
                        r.consentExpireIn = k.consentExpireIn || r.consentExpireIn || 1,
                        r.consentLinkAction = k.consentLinkAction || r.consentLinkAction || null,
                        r.consentLinkTitle = ae(k.consentLinkTitle || r.consentLinkTitle),
                        r.confirmCookie = k.confirmCookie || r.confirmCookie,
                        r.consentCookie = k.consentCookie || r.consentCookie,
                        r.addtlConsentCookie = k.addtlConsentCookie || r.addtlConsentCookie,
                        k.consentDefaults && (r.consentDefaults = le(r.consentDefaults, k.consentDefaults)),
                        r.consentGpcDefaults = k.consentGpcDefaults || r.consentGpcDefaults || null,
                        r.consentImpliedDefaults = k.consentImpliedDefaults || r.consentImpliedDefaults || {},
                        r.consentImpliedDefaults.required || (r.consentImpliedDefaults.required = !0),
                        r.consentNotApplicable = k.consentNotApplicable || r.consentNotApplicable || [],
                        r.consentNotApplicable && Array.isArray(r.consentNotApplicable) && 0 !== r.consentNotApplicable.length)
                            for (let e of r.consentNotApplicable)
                                void 0 !== r.consentDefaults[e] && delete r.consentDefaults[e],
                                void 0 !== r.consentImpliedDefaults[e] && delete r.consentImpliedDefaults[e];
                        if (r.useFixedConsent = "boolean" == typeof k.useFixedConsent ? k.useFixedConsent : r.useFixedConsent,
                        r.domId = k.domId || r.domId,
                        r.src = k.src || r.src,
                        r.gdprIabCookie = k.gdprIabCookie || r.gdprIabCookie,
                        r.tcfOpts = k.tcfOpts || r.tcfOpts || null,
                        r.privacyCenterLinkAction = k.privacyCenterLinkAction || r.privacyCenterLinkAction || null,
                        r.privacyCenterLinkTitle = ae(k.privacyCenterLinkTitle || r.privacyCenterLinkTitle),
                        r.rightsRequestLinkAction = k.rightsRequestLinkAction || r.rightsRequestLinkAction || null,
                        r.rightsRequestLinkTitle = ae(k.rightsRequestLinkTitle || r.rightsRequestLinkTitle),
                        r.useIAB && (r.iabRegion = ("string" == typeof k.iabRegion && k.iabRegion || r.iabRegion).toLowerCase(),
                        "ccpa" === r.iabRegion ? W = !0 : "gdpr" === r.iabRegion && r.tcfOpts ? H = !0 : r.iabRegion && "gpp" !== r.iabRegion && J("error", 'Error: Invalid IAB region "' + r.iabRegion + '" specified for region "' + r.regId + '", IAB not enabled for region!')),
                        r.useGPP && (r.gppSection = ("string" == typeof k.gppSection && k.gppSection || r.gppSection).toLowerCase(),
                        r.gppSection = "usnat" === r.gppSection || "usnatv1" === r.gppSection ? "usnat" : "uspv1" === r.gppSection || "uspnatv1" === r.gppSection ? "uspv1" : r.gppSection,
                        r.useGPP && r.gppSection && (_[r.gppSection] && r.gppCategories[r.gppSection] ? (j = !0,
                        W && r.ccpaGeos && !oe(r.ccpaGeos) && (W = !1)) : J("error", 'Error: Invalid GPP section "' + r.gppSection + '" specified for region "' + r.regId + '", IAB/GPP not enabled for region!'))),
                        j || W || H || (r.iabRegion = "",
                        r.gppSection = "",
                        r.useIAB = !1,
                        r.useGPP = !1),
                        r.enableGPC && r.consentGpcDefaults && navigator.globalPrivacyControl && (B = !0),
                        r.setPageClass && t.documentElement && (t.documentElement.className = (t.documentElement.className && " " !== t.documentElement.className ? t.documentElement.className + " userconsent-cntry-" : "userconsent-cntry-") + m.toLowerCase() + " userconsent-state-" + I.toLowerCase() + " userconsent-reg-" + r.regId.toLowerCase() + (B ? " userconsent-gpc" : "")),
                        f && (J("debug", "GeoIP Country Code: " + m + ", using consent region: " + r.regId),
                        J("debug", "IAB " + (r.useIAB ? "enabled" : "disabled"))),
                        (j || W || H || r.ccpaGeos) && function() {
                            let t, n, s = function(e, t) {
                                const n = "string" == typeof t.data
                                  , s = e + "Return";
                                let i, r;
                                try {
                                    i = n ? JSON.parse(t.data) : t.data
                                } catch (e) {
                                    i = {}
                                }
                                if (r = i[s],
                                r && void 0 !== r.callId && "function" == typeof o[r.callId]) {
                                    const e = r.callId
                                      , n = r.returnValue;
                                    try {
                                        n && "number" == typeof n.listenerId && !0 === r.success ? (f && J("debug", "Calling post message callback " + e + " (listenerId: " + n.listenerId + ")"),
                                        E[n.listenerId] = e,
                                        o[e](n, r.success)) : (f && J("debug", "Calling post message callback ", e),
                                        o[e](n, r.success),
                                        delete o[e])
                                    } catch (t) {
                                        J("error", "Post message callback error (callId " + e + "): ", t)
                                    }
                                } else
                                    r && J("error", "Post message bad or missing callback (callId " + r.callId + ").")
                            }, r = function(t, n) {
                                const s = "string" == typeof n.data
                                  , i = t + "Call";
                                let o, r = {}, a = function(e, i) {
                                    let o = {};
                                    o[t + "Return"] = {
                                        returnValue: e,
                                        success: i,
                                        callId: r.callId
                                    };
                                    try {
                                        n.source.postMessage(s ? JSON.stringify(o) : o, "*")
                                    } catch (e) {
                                        J("error", "Failed to post reply: ", e)
                                    }
                                };
                                try {
                                    o = s ? JSON.parse(n.data) : n.data
                                } catch (e) {
                                    o = {}
                                }
                                "object" == typeof o && null !== o && o[i] && (r = o[i],
                                "__gpp" === t ? e.__gpp(r.command, a, r.parameter, r.version) : e[t](r.command, r.version, a, r.parameter))
                            };
                            if (null === (Y = Ne("__uspapiLocator")) ? (ye("__uspapiLocator"),
                            e.__uspapi = function(t, n, s) {
                                if ("function" == typeof s) {
                                    if (n = 0 === n ? 1 : n,
                                    "getUSPData" === t && 1 === n) {
                                        try {
                                            s({
                                                version: 1,
                                                uspString: e.WBD.UserConsent.getUspAPIstring()
                                            }, !0)
                                        } catch (e) {
                                            return J("error", 'Callback function failure in "getUSPData": ', e),
                                            !1
                                        }
                                        return !0
                                    }
                                    if ("ping" === t) {
                                        try {
                                            s({
                                                version: 1,
                                                uspapiLoaded: !0
                                            }, !0)
                                        } catch (e) {
                                            return J("error", 'Callback function failure in USP "ping": ', e),
                                            !1
                                        }
                                        return !0
                                    }
                                    try {
                                        s(null, !1)
                                    } catch (e) {
                                        J("error", "Callback function failure in USP with bad command: ", e)
                                    }
                                }
                                return !1
                            }
                            ,
                            e.__uspapi.msgHandler = r.bind(e, "__uspapi"),
                            Ae(e.__uspapi.msgHandler),
                            Ee() ? J("error", "Unable to locate USP messaging frame from iframe!  Consent logic may not work correctly!") : f && J("debug", "IAB for CCPA ready.")) : (e.__uspapi = function(e, t, n, s) {
                                const r = i++
                                  , a = {
                                    __uspapiCall: {
                                        command: e,
                                        parameter: s,
                                        version: t || 1,
                                        callId: r
                                    }
                                };
                                o[r] = n,
                                Y.postMessage(a, "*")
                            }
                            ,
                            e.__uspapi.postHandler = s.bind(e, "__uspapi"),
                            Ae(e.__uspapi.postHandler),
                            f && J("debug", "IAB for CCPA ready (via frame).")),
                            H && (t = "__tcfapi",
                            n = "2.0",
                            null === (G = Ne(t + "Locator")) && "function" != typeof e[t] ? (ye(t + "Locator"),
                            e[t] = function() {
                                let s = arguments;
                                if (e[t].a = e[t].a || [],
                                s.length > 0)
                                    if ("ping" === s[0]) {
                                        if ("function" == typeof s[2])
                                            try {
                                                s[2]({
                                                    apiVersion: n,
                                                    gdprApplies: !0,
                                                    gdprAppliesGlobally: !1,
                                                    cmpLoaded: !1,
                                                    cmpStatus: "stub",
                                                    displayStatus: "hidden"
                                                }, !0)
                                            } catch (e) {
                                                J("error", t + ' "ping" callback function error: ', e)
                                            }
                                    } else
                                        "setGdprApplies" === s[0] && s.length > 3 && "boolean" == typeof s[3] ? (H = s[3]) && W && (W = !1) : e[t].a.push([].slice.apply(s));
                                return e[t].a
                            }
                            ,
                            e[t].msgHandler = r.bind(e, t),
                            Ae(e[t].msgHandler),
                            Ee() ? J("error", "Unable to locate TCF messaging frame from iframe!  Consent logic may not work correctly!") : f && J("debug", "IAB (v" + n + ") for GDPR ready."),
                            e[t]("addEventListener", 2, (function(n, s) {
                                s && n && (f && J("debug", t + ' event caught, eventStatus = "' + n.eventStatus + '"'),
                                !e.OneTrust || "function" != typeof e.OneTrust.GetDomainData || "tcloaded" !== n.eventStatus && "cmpuishown" !== n.eventStatus || e.OptanonWrapper(),
                                void 0 === typeof n.listenerId || "error" !== n.cmpStatus && "loaded" !== n.cmpStatus || e[t]("removeEventListener", 2, (function(e) {}
                                ), n.listenerId))
                            }
                            ))) : G && (e.__tcfapi = function(e, t, n, s) {
                                const r = i++
                                  , a = {
                                    __tcfapiCall: {
                                        command: e,
                                        parameter: s,
                                        version: t || 2,
                                        callId: r
                                    }
                                };
                                o[r] = n,
                                G.postMessage(a, "*"),
                                "removeEventListener" === e && "number" == typeof s && void 0 !== E[s] && o[E[s]] && (delete o[E[s]],
                                delete E[s])
                            }
                            ,
                            e.__tcfapi.postHandler = s.bind(e, "__tcfapi"),
                            Ae(e.__tcfapi.postHandler),
                            f && J("debug", "IAB (v" + n + ") for GDPR ready (via frame)."))),
                            j)
                                if (t = "__gpp",
                                n = "1.1",
                                null !== (z = Ne("__gppLocator")) || e.__gpp)
                                    null !== z && (e.__gpp = function(e, t, s, r) {
                                        const a = i++
                                          , c = {
                                            __gppCall: {
                                                command: e,
                                                parameter: s,
                                                version: r || n,
                                                callId: a
                                            }
                                        };
                                        o[a] = t,
                                        z.postMessage(c, "*"),
                                        "removeEventListener" === e && "number" == typeof s && void 0 !== E[s] && o[E[s]] && (delete o[E[s]],
                                        delete E[s])
                                    }
                                    ,
                                    e.__gpp.postHandler = s.bind(e, "__gpp"),
                                    Ae(e.__gpp.postHandler),
                                    f && J("debug", "IAB for GPP ready (via frame)."));
                                else {
                                    let t, n = [];
                                    ye("__gppLocator"),
                                    e.__gpp = function() {
                                        return null
                                    }
                                    ,
                                    (b = b || new We(1,1)).setCmpStatus("loading"),
                                    t = Object.keys(_);
                                    for (let e = 0; e < t.length; e++)
                                        n.push(_[t[e]].toString(10) + ":" + t[e]);
                                    b.setSupportedAPIs(n),
                                    A = e.__gpp,
                                    e.__gpp.msgHandler = r.bind(e, "__gpp"),
                                    Ae(e.__gpp.msgHandler),
                                    Ee() ? J("error", "Unable to locate GPP messaging frame from iframe!  Consent logic may not work correctly!") : f && J("debug", "IAB for GPP ready.")
                                }
                        }(),
                        Ce()) {
                            let t;
                            if (S = function() {
                                const e = X(r.controlCookie)
                                  , t = {
                                    consentInteractions: d,
                                    consentTime: null,
                                    consentVersion: "",
                                    countryCode: "",
                                    region: "",
                                    stateCode: "",
                                    userConsentVersion: ""
                                };
                                if ("string" == typeof e && 0 !== e.length) {
                                    const n = e.split("&");
                                    for (let s = 0; s < n.length; s++) {
                                        let i = n[s].split("=");
                                        if ("string" == typeof i[0] && 0 !== i[0].length && "string" == typeof i[1])
                                            switch (i[0]) {
                                            case "ccc":
                                                t.countryCode = i[1].toLowerCase();
                                                break;
                                            case "csc":
                                                t.stateCode = i[1].toLowerCase();
                                                break;
                                            case "cic":
                                                t.consentInteractions = parseInt(i[1], 10),
                                                (isNaN(t.consentInteractions) || t.consentInteractions < d) && (t.consentInteractions = d);
                                                break;
                                            case "otvers":
                                                t.consentVersion = i[1].toLowerCase();
                                                break;
                                            case "pctm":
                                                let n;
                                                try {
                                                    n = "0" === i[1] ? null : new Date(decodeURIComponent(i[1]))
                                                } catch (t) {
                                                    n = null
                                                }
                                                t.consentTime = null === n || isNaN(n.valueOf()) ? null : n;
                                                break;
                                            case "reg":
                                                t.region = i[1].toLowerCase();
                                                break;
                                            case "ustcs":
                                                try {
                                                    t.ccpaTCS = decodeURIComponent(i[1]).toUpperCase()
                                                } catch (e) {
                                                    t.ccpaTCS = ""
                                                }
                                                break;
                                            case "vers":
                                                t.userConsentVersion = i[1].toLowerCase()
                                            }
                                    }
                                }
                                return t
                            }(),
                            d = S.consentInteractions,
                            r.useExternalConsent)
                                try {
                                    p = new Date(e.OTExternalConsent.consentedDate),
                                    B = !1,
                                    f && J("debug", "Consent time read from external consent data: ", p)
                                } catch (e) {
                                    J("error", "Consent Date from external consent data is invalid."),
                                    p = null
                                }
                            else
                                p = Pe(),
                                null !== S.consentTime && (null === p || S.consentTime > p) ? (p = S.consentTime,
                                f && J("debug", 'Consent time read from "' + r.controlCookie + '": ', p)) : null !== p && f && J("debug", 'Consent time read from "' + r.confirmCookie + '": ', p);
                            if (t = f && B ? " [GPC override]" : "",
                            null !== p ? (a = !0,
                            g = Se(),
                            a ? (null !== S.consentTime && S.consentTime < p && (S.region = ""),
                            f && (J("debug", "Consent state read from " + u + " (" + h + ")" + t + ": ", g),
                            F && J("debug", "Consent state using compatibility config."))) : (p = null,
                            S.region = "",
                            f && J("debug", "Consent state expired or removed, reset from defaults" + t + ": ", g))) : (g = ce(r.consentDefaults),
                            B && (g = le(g, r.consentGpcDefaults)),
                            f && J("debug", "Consent state from defaults" + t + ": ", g)),
                            j && !y && he("", g),
                            f)
                                try {
                                    c.push({
                                        ts: new Date,
                                        act: "SET",
                                        desc: JSON.stringify(g),
                                        res: null !== p,
                                        note: r.regId
                                    })
                                } catch (e) {
                                    J("error", "Failed to track setting initial consent: ", e)
                                }
                        }
                        if (e.WBD.UserConsent_initted)
                            return void J("error", "ERROR:  Second instance of UserConsent initialized!");
                        if (e.WBD.UserConsent_initted = !0,
                        _e(),
                        Ce() && (r.useExternalConsent ? we() : S.region && S.region !== r.regId && (Z = S.region,
                        $ = r.regId,
                        f && J("debug", 'User-Consent detected region change from "' + Z + '" to "' + $ + '".'),
                        "function" == typeof r.regionChangeAction && r.regionChangeAction(Z, $, r.consentLinkAction)),
                        null === v))
                            if (ye("_usrConWBD")) {
                                f && J("debug", "Setup UserConsent IPC frame.");
                                try {
                                    e.sessionStorage.setItem("_ucWBDConf", JSON.stringify({
                                        cookieDomain: r.cookieDomain,
                                        cookieSameSite: r.cookieSameSite,
                                        cookieSecure: r.cookieSecure,
                                        countryCode: m,
                                        domId: r.domId,
                                        enableDebug: f,
                                        langFromBrowser: r.languageFromBrowser,
                                        parentReload: r.reloadOnConsentChange,
                                        regId: r.regId,
                                        src: r.src,
                                        stateCode: I
                                    })),
                                    e.sessionStorage.setItem("_ucWBDCons", JSON.stringify({
                                        consentState: g,
                                        consentTime: p,
                                        consentVersion: h,
                                        consentConfirmed: a,
                                        gppString: y,
                                        tcString: L,
                                        acString: s
                                    }))
                                } catch (e) {
                                    ee.uclog("error", "Failed to set UserConsent frame data!")
                                }
                            } else
                                J("error", "Failed to setup UserConsent IPC frame!");
                        var Z, $;
                        const ee = {
                            isTop: Ce,
                            uclog: J
                        }
                          , te = {
                            acString: s,
                            config: r,
                            consentState: g,
                            consentTime: p,
                            consentVersion: h,
                            consentConfirmed: a,
                            dbg: f,
                            forceLang: U,
                            geoCountry: m,
                            geoState: I,
                            gppString: y,
                            pageLang: V,
                            tcString: L,
                            ucFrame: v,
                            usingGpc: B
                        }
                          , ne = function(e, t, n, s, i) {
                            if ((!i || i && "interactive" === t.readyState) && (s.config.setPageClass && !t.documentElement.className.toString().includes("userconsent-cntry-") && (t.documentElement.className = (t.documentElement.className && " " !== t.documentElement.className ? t.documentElement.className + " userconsent-cntry-" : "userconsent-cntry-") + s.geoCountry.toLowerCase() + " userconsent-state-" + s.geoState.toLowerCase() + " userconsent-reg-" + s.config.regId.toLowerCase() + (s.usingGpc ? " userconsent-gpc" : "")),
                            be(),
                            n.isTop())) {
                                const i = t.createElement("script");
                                e.WBD.UserConsent_wait = setTimeout(e.OptanonWrapper.bind(e, !0), s.config.oneTrustLoadTimeout),
                                s.consentConfirmed && (i.async = !0),
                                i.charset = "utf-8",
                                s.config.languageFromBrowser && !s.forceLang || (i.dataset.documentLanguage = "true",
                                s.forceLang && (i.dataset.language = s.pageLang)),
                                i.dataset.domainScript = s.config.domId,
                                i.type = "text/javascript",
                                i.onerror = function(e) {
                                    D = !0,
                                    de(1)
                                }
                                ,
                                i.onload = function(e) {
                                    R = !0,
                                    f && J("debug", "OneTrust Stub loaded.")
                                }
                                ,
                                s.dbg && n.uclog("debug", "Loading OneTrust."),
                                i.src = s.config.src,
                                t.head ? t.head.appendChild(i) : t.body.appendChild(i)
                            }
                        };
                        "interactive" !== t.readyState ? t.addEventListener ? t.addEventListener("readystatechange", ne.bind(this, e, t, ee, te), !1) : t.attachEvent("readystatechange", ne.bind(this, e, t, ee, te)) : setTimeout(ne.bind(this, e, t, ee, te), 1),
                        f && j && e.__gpp && e.__gpp("addEventListener", (function(e, t) {
                            J("debug", "GPP event: ", e)
                        }
                        )),
                        f && J("debug", "Dispatching UserConsentReady event."),
                        t.dispatchEvent(new CustomEvent("userConsentReady",{
                            bubbles: !1,
                            cancelable: !1,
                            detail: {
                                region: r.regId,
                                time: new Date,
                                consentConfirmed: a
                            }
                        }))
                    }
                    return e.WBD.UserConsent_loaded ? J("error", "ERROR:  Second instance of UserConsent loaded!") : (e.WBD.UserConsent_loaded = !0,
                    e.WBD.UserConsent_optLoaded = !1,
                    e.WBD.UserConsent_wrapproc = 0,
                    e.WBD.UserConsent_wait = -1,
                    e.OptanonWrapper = function(n) {
                        if (!P && !D) {
                            e.WBD.UserConsent_optLoaded = !0;
                            let s = function() {
                                P && (l = "function" == typeof e.OneTrust.getDataSubjectId && e.OneTrust.getDataSubjectId() || l,
                                f && J("debug", "Dispatching oneTrustLoaded event."),
                                t.dispatchEvent(new CustomEvent("oneTrustLoaded",{
                                    bubbles: !1,
                                    cancelable: !1,
                                    detail: {
                                        region: r.regId,
                                        time: new Date,
                                        consentConfirmed: a,
                                        otId: l,
                                        otVers: h
                                    }
                                })),
                                t.dispatchEvent(new CustomEvent("optanonLoaded",{
                                    bubbles: !1,
                                    cancelable: !1,
                                    detail: {
                                        region: r.regId,
                                        time: new Date,
                                        consentConfirmed: a,
                                        otId: l,
                                        otVers: h
                                    }
                                })),
                                r.useExternalConsent && !e.OneTrust.IsAlertBoxClosed() && e.Optanon.Close()),
                                e.OptanonWrapper = function() {}
                            };
                            if (e.WBD.UserConsent_wait >= 0 && (clearTimeout(e.WBD.UserConsent_wait),
                            e.WBD.UserConsent_wait = -1),
                            !e.OneTrust || "function" != typeof e.OneTrust.GetDomainData) {
                                const t = R ? e.OneTrustStub && e.OneTrustStub.otSdkStub ? n ? 3 : 4 : 2 : 1;
                                return P = !1,
                                de(t),
                                void (e.OptanonWrapper = function() {}
                                )
                            }
                            P = !0,
                            r.geoPassedToOneTrust && ue(),
                            j ? ("function" != typeof e.__gpp && (e.__gpp = A),
                            e.__gpp("ping", (function(t) {
                                if (!t || t.cmpId <= 0)
                                    j = !1,
                                    b && (b.setCmpStatus("error"),
                                    b.fireErrorEvent("CMP did not initialize GPP for this region.")),
                                    f && J("debug", "OneTrust GPP for this region is broken.  Disabling use of GPP.");
                                else if (1 === t.cmpId)
                                    q = !1,
                                    b ? (f && J("debug", "OneTrust did NOT initialize GPP for this region.  Using GPP from UserConsent."),
                                    b.setCmpStatus("loaded"),
                                    b.fireEvent("cmpStatus", "loaded"),
                                    b.setSignalStatus("ready"),
                                    b.fireEvent("signalStatus", "ready")) : (j = !1,
                                    f && J("debug", "OneTrust did NOT initialize GPP for this region.  UserConsent GPP failed to initialize.  Disabling use of GPP."));
                                else {
                                    const n = t.cmpStatus;
                                    O = t.cmpId,
                                    q = !0,
                                    t.gppVersion && "1.0" === t.gppVersion && (t = e.__gpp("getGPPData")),
                                    t && t.gppString && (N = t.gppVersion,
                                    he(t.gppString, null)),
                                    f && J("debug", 'OneTrust GPP initialized (status "' + n + '").')
                                }
                                s()
                            }
                            ))) : s()
                        }
                    }
                    ,
                    "object" == typeof e.WBD.UserConsentConfig && null !== e.WBD.UserConsentConfig ? De(e.WBD.UserConsentConfig) : "object" == typeof e.WM.UserConsentConfig && null !== e.WM.UserConsentConfig && De(e.WM.UserConsentConfig)),
                    {
                        addScript: function(e, n, s, i) {
                            if (e && (e.src || e.text)) {
                                const o = {
                                    cact: "ADD",
                                    name: e.name || e.src || e.id || "unnamed inline"
                                }
                                  , r = s || t.head
                                  , a = i || ["*"];
                                if (!oe(a))
                                    return f && (c.push({
                                        ts: new Date,
                                        act: "ADD",
                                        desc: o.name,
                                        res: !1,
                                        note: "Not in script region"
                                    }),
                                    J("debug", "Check for region [" + (a.join(",") || "empty") + '] REJECTS "' + o.name + '", script NOT added')),
                                    !1;
                                if (Te(n, o)) {
                                    const n = t.createElement("script")
                                      , s = Object.keys(e);
                                    for (let t = 0; t < s.length; t++)
                                        n[s[t]] = e[s[t]];
                                    return r.appendChild(n),
                                    !0
                                }
                            } else
                                J("error", "Invalid or missing options to addScript.");
                            return !1
                        },
                        addScriptElement: function(e, n, s, i) {
                            if (e) {
                                const o = {
                                    cact: "ADD",
                                    name: e.name || e.src || e.id || "unnamed inline"
                                }
                                  , r = s || t.head
                                  , a = i || ["*"];
                                if (!oe(a))
                                    return f && (c.push({
                                        ts: new Date,
                                        act: "ADD",
                                        desc: o.name,
                                        res: !1,
                                        note: "Not in script region"
                                    }),
                                    J("debug", "Check for region [" + (a.join(",") || "empty") + '] REJECTS "' + o.name + '", script NOT added')),
                                    !1;
                                if (Te(n, o))
                                    return r.appendChild(e),
                                    !0
                            } else
                                J("error", "Invalid or missing options to addScriptElement.");
                            return !1
                        },
                        forceReconsent: function() {
                            Ce() && (t.cookie = r.consentCookie + "=; Domain=" + r.cookieDomain + "; Path=/; Expires=Thu, 01 Jan 2000 00:00:01 GMT;",
                            t.cookie = r.confirmCookie + "=; Domain=" + r.cookieDomain + "; Path=/; Expires=Thu, 01 Jan 2000 00:00:01 GMT;",
                            we({
                                ccpaTCS: "",
                                consentInteractions: d,
                                consentTime: null,
                                consentVersion: h,
                                countryCode: m,
                                region: r.regId,
                                stateCode: I,
                                userConsentVersion: x
                            }),
                            setTimeout(Oe, 100))
                        },
                        getAdChoicesLinkAction: function() {
                            return "function" == typeof r.adChoicesLinkAction ? r.adChoicesLinkAction : "string" == typeof r.adChoicesLinkAction && -1 !== r.adChoicesLinkAction.search(/^http/) ? function() {
                                e.open(r.adChoicesLinkAction, "_blank")
                            }
                            : null
                        },
                        getAdChoicesLinkTitle: function() {
                            return r.adChoicesLinkTitle
                        },
                        getAffiliatesLinkAction: function() {
                            return "function" == typeof r.affiliatesLinkAction ? r.affiliatesLinkAction : "string" == typeof r.affiliatesLinkAction && -1 !== r.affiliatesLinkAction.search(/^http/) ? function() {
                                e.open(r.affiliatesLinkAction, "_blank")
                            }
                            : null
                        },
                        getAffiliatesLinkTitle: function() {
                            return r.affiliatesLinkTitle
                        },
                        getCmpString: function(t, n) {
                            let i, o, a, c = "";
                            if ("function" == typeof t)
                                if (n = n || this.getRegion(),
                                r.useIAB) {
                                    if (j) {
                                        if ("string" == typeof y && 0 !== y.length) {
                                            f && J("debug", "getCmpString returning GPP CMP string");
                                            try {
                                                t(n, 1, y, "", null)
                                            } catch (e) {
                                                J("error", "Callback error in call to getCmpString (GPP): ", e)
                                            }
                                            return
                                        }
                                        i = e.__gpp,
                                        o = "ping",
                                        a = 1,
                                        c = "GPP"
                                    } else if (H) {
                                        if ("string" == typeof L && 0 !== L.length) {
                                            f && J("debug", "getCmpString returning GDPR v2 CMP string");
                                            try {
                                                t(n, 2, L, s, null)
                                            } catch (e) {
                                                J("error", "Callback error in call to getCmpString (TCF): ", e)
                                            }
                                            return
                                        }
                                        i = e.__tcfapi,
                                        o = "getTCData",
                                        a = 2,
                                        c = "TCF"
                                    }
                                    if (o)
                                        try {
                                            let e = function(e, t, n, s, i, o) {
                                                o ? (f && J("debug", "getCmpString returning " + n + " v" + s + " CMP string"),
                                                e(t, s, "GPP" === n ? i.pingData.gppString : i.tcString, i.addtlConsent ? i.addtlConsent : "", null)) : (f && J("debug", "getCmpString returning " + n + " v" + s + " error"),
                                                e(t, s, "", "", new Error(n + " CMP request failure")))
                                            }
                                            .bind(this, t, n, c, a);
                                            "GPP" === c ? i(o, e) : i(o, a, e)
                                        } catch (e) {
                                            J("error", "Error in CMP call for getCmpString (" + iab + "): ", e)
                                        }
                                    else {
                                        f && J("debug", "getCmpString returning CCPA v1 CMP string");
                                        try {
                                            t(n, 1, K, "", 0 !== K.length ? null : new Error("CMP request failure"))
                                        } catch (e) {
                                            J("error", "Callback error in call to getCmpString (USP): ", e)
                                        }
                                    }
                                } else {
                                    f && J("debug", "getCmpString called with IAB disabled");
                                    try {
                                        t(n, 0, "", "", new Error("IAB disabled"))
                                    } catch (e) {
                                        J("error", "Callback error in call to getCmpString (no IAB): ", e)
                                    }
                                }
                            else
                                J("error", "getCmpString called without callback")
                        },
                        getConsentConfirmed: function() {
                            return a
                        },
                        getConsentHistory: function() {
                            return c
                        },
                        getConsentState: fe,
                        getConsentTime: function() {
                            return p
                        },
                        getConsentVersion: function() {
                            return h
                        },
                        getGeoCountry: function() {
                            return m
                        },
                        getGeoState: function() {
                            return I
                        },
                        getGppAPIstring: function() {
                            return y
                        },
                        getGppSection: function() {
                            return j && "" !== r.gppSection ? r.gppSection : "none"
                        },
                        getIABInterface: function() {
                            return j ? "__gpp" : W ? "__uspapi" : H ? "__tcfapi" : "none"
                        },
                        getIABRegion: function() {
                            return "" !== r.iabRegion ? r.iabRegion : "none"
                        },
                        getIABVersion: function() {
                            return j ? "1.1" : W ? "1.0" : H ? "2.2" : "none"
                        },
                        getLinkAction: function() {
                            return r.consentLinkAction || e.OneTrust && e.OneTrust.ToggleInfoDisplay || function() {
                                e.OneTrust && e.OneTrust.ToggleInfoDisplay && e.Optanon.ToggleInfoDisplay()
                            }
                        },
                        getLinkTitle: function() {
                            return r.consentLinkTitle
                        },
                        getPrivacyCenterLinkAction: function() {
                            return "function" == typeof r.privacyCenterLinkAction ? r.privacyCenterLinkAction : "string" == typeof r.privacyCenterLinkAction && -1 !== r.privacyCenterLinkAction.search(/^http/) ? function() {
                                e.open(r.privacyCenterLinkAction, "_blank")
                            }
                            : null
                        },
                        getPrivacyCenterLinkTitle: function() {
                            return r.privacyCenterLinkTitle
                        },
                        getRegion: function() {
                            return r.regId
                        },
                        getReloadOnChange: function() {
                            return r.reloadOnConsentChange
                        },
                        getReloadOnConsentReduction: function() {
                            return r.reloadOnConsentReduction
                        },
                        getRightsRequestLinkAction: function() {
                            return "function" == typeof r.rightsRequestLinkAction ? r.rightsRequestLinkAction : "string" == typeof r.rightsRequestLinkAction && -1 !== r.rightsRequestLinkAction.search(/^http/) ? function() {
                                e.open(r.rightsRequestLinkAction, "_blank")
                            }
                            : null
                        },
                        getRightsRequestLinkTitle: function() {
                            return r.rightsRequestLinkTitle
                        },
                        getSimpleConsentState: function() {
                            let e = {};
                            for (let t in g)
                                "boolean" == typeof g[t] && (e[t] = g[t]);
                            return e
                        },
                        getTcfAPIaddtlString: function() {
                            return s
                        },
                        getTcfAPIstring: function() {
                            return L
                        },
                        getUserConsentAdvertisingState: function(e) {
                            const t = {
                                name: "Ads Check",
                                checkIAB: "string" == typeof e ? e : ""
                            };
                            return Te(r.adCategories, t)
                        },
                        getUspAPIstring: function() {
                            return K
                        },
                        getVersion: function() {
                            return x
                        },
                        init: De,
                        inUserConsentState: Te,
                        isChild: Ee,
                        isTop: Ce,
                        isEnabled: function() {
                            return !0
                        },
                        isGpcInUse: function() {
                            return B
                        },
                        isGpcSet: function() {
                            return !!navigator.globalPrivacyControl
                        },
                        isInCcpaRegion: function() {
                            return oe(r.ccpaGeos)
                        },
                        isInGdprRegion: function() {
                            return H
                        },
                        isInGppRegion: function() {
                            return j
                        },
                        isInIabRegion: function(e) {
                            return e = "string" == typeof e ? e : "",
                            r.iabRegion === e
                        },
                        isInRegion: function(e) {
                            return r.regId === e
                        },
                        isOneTrustBlocked: function() {
                            return v
                        },
                        isOneTrustFailing: function() {
                            return D
                        },
                        isOneTrustLoaded: me,
                        isOptanonLoaded: me,
                        isReady: Ie,
                        isSiteIABCompliant: function() {
                            return r.strictIabCompliance
                        },
                        usingCompatConsent: function() {
                            return F
                        },
                        usingExternalConsent: function() {
                            return r.useExternalConsent
                        },
                        usingGPP: function() {
                            return j
                        },
                        usingIAB: function() {
                            return r.useIAB && (j || W || H)
                        },
                        usingPSM: function() {
                            return !1
                        }
                    }
                }(e, t),
                e.WM.UserConsent = e.WBD.UserConsent
            }()
        }(window, document);

        //snippet: tag-manager
        (function() {
            function init() {
                addScript({
                    src: window.env.ADOBE_LAUNCH_SRC,
                    async: true,
                    defer: false,
                    name: 'tag-manager'
                });
            }
            if (window.WBD.UserConsent) {
                init();
            } else {
                window.addEventListener('user-consent.loaded', init);
            }
        }
        )();

        //snippet: nativo
        if (window.WM.UserConsent.inUserConsentState(['iab', 'data-store', 'ads-contextual', 'ads-person-prof', 'ads-person', 'measure-ads'])) {
            (function() {
                /* serve nativo only on domestic pages */
                if (!window.CNN.helpers.isEditionPage() && window.env.NATIVO_SRC) {
                    const nativoScriptObj = {
                        name: 'nativo',
                        src: window.env.NATIVO_SRC,
                        defer: true
                    }
                    addScript(nativoScriptObj);
                }
            }
            )();

        }

        //snippet: zion
        (function() {
            addScript({
                src: window.env.ZION_SRC,
                async: true,
                defer: false,
                name: 'zion',
                ucStates: ['data-store']
            });
            window.addEventListener('zion.loaded', () => {
                if (window.CNN.Zion.environmentType && window.CNN.Zion.sourceId && window.ZION_SDK) {
                    const environment = window.ZION_SDK.EnvironmentType[window.CNN.Zion.environmentType];
                    const enableLogging = environment !== window.ZION_SDK.EnvironmentType.Prod;

                    if (window.zion_analytics) {
                        window.addEventListener('zionReady', (evt) => {
                            window.zion_analytics.track(new window.ZION_SDK.Pageview({
                                canonicalUrl: window.CNN.contentModel.canonicalUrl,
                                traits: {
                                    event_source: window.CNN.contentModel.techStack || 'stellar',
                                    page_variant: window.CNN.contentModel.templateType || '',
                                    raw_url: window.location.href,
                                    cms_id: CNN.contentModel.cmsId || '',
                                    page_type: CNN.contentModel.pageType || '',
                                    edition: window.CNN.helpers.isEditionPage(),
                                    section: CNN.contentModel.section || '',
                                    subsection: CNN.contentModel.subsection || '',
                                    section_level_3: CNN.contentModel.subsubsection || '',
                                    experience_type: 'cnn_core'
                                },
                                sourceId: window.CNN.contentModel.sourceId || ''
                            }), new ZION_SDK.ConsentContext({
                                consent_state: window.WBD.UserConsent.getSimpleConsentState() || {}
                            }));
                        }
                        , {
                            once: true
                        });

                        window.zion_analytics.configure({
                            bridgeEnabled: true,
                            bufferSize: 20,
                            enableLogging,
                            customFeatureManagerPath: 'https://z.cdp-dev.cnn.com/zfm/zfh-3.js',
                            environment: window.CNN.Zion.environmentType,
                            isSecure: true,
                            telemetryEndpoint: window.env.ZION_TELEMETRY_ENDPOINT,
                            trackAdvertising: false,
                            trackBluetooth: false,
                            trackDeeplink: false,
                            trackLifecycle: false,
                            trackLocation: false,
                            trackNotifications: false,
                            trackPurchases: false,
                            trackScreens: false,
                            trackUxMetrics: true,
                            uxMetricsPercentage: 15
                        });
                    } else {
                        console.error('zion: "zion_analytics" failed to load properly.');
                    }
                } else {
                    throw new Error('zion: missing either "apiKey", "environmentType" or "sourceId"');
                }
            }
            );
        }
        )();

        //script: sovrn
        addScript({
            async: false,
            defer: true,
            name: 'sovrn',
            src: 'https://get.s-onetag.com/c15ddde9-ec7d-4a49-b8ca-7a21bc4b943b/tag.min.js',
            loadEventName: 'sovrn',
            ucStates: ['iab', 'data-share', 'data-sell', 'data-store', 'ads-contextual', 'ads-person-prof', 'ads-person', 'content-person-prof', 'content-person', 'measure-ads', 'measure-content', 'measure-market', 'product-develop']
        });

        //script: fave
        addScript({
            async: false,
            defer: true,
            name: 'fave',
            src: 'https://registry.api.cnn.io/bundles/fave/latest-4.x/js',
            loadEventName: 'fave'
        });

    }())