const BASE_URL = 'https://glowhub-api.herokuapp.com'

// GlowHub base
// ===================================================
class glowHub {
  constructor() {
    this.baseURL = BASE_URL
    this.clientID = undefined
    this.services = {
      cookies: undefined,
      analytics: undefined,
      feedback: undefined
    }
  }

  init(clientID) {
    this.clientID = clientID
    this.getInfo()
  }

  getInfo() {
    fetch(`${this.baseURL}/accounts/getinfo/${this.clientID}`)
      .then(res => res.json())
      .then(data => {
        this.services.cookies = data.cookies
        this.services.analytics = data.analytics

        this.start()
      })
      .catch(e => console.log(e))
  }

  start() {
    if (this.services.cookies) this.initCookies()
    if (!this.services.cookies && this.services.analytics) this.initAnalytics()
    if (this.services.feedback) this.initFeedback()
  }

  initCookies() {
    console.log('Iniciamos cookies')
    const glowCookies = new GlowCookies()

    glowCookies.start(this.services.cookies.lang, {
      style: this.services.cookies.style,
      analytics: 'G-FH87DE17XF',
      policyLink: 'https://link-to-your-policy.com'
    })
  }

  initAnalytics() {
    if (this.services.analytics) {
      console.log('Iniciamos analytics')
      const GAnalytics = new glowAnalytics(this.clientID, this.services.analytics.privacy)
    }
  }

  initFeedback() {
    console.log('Iniciamos initFeedback')
  }
}
const glowHubScript = new glowHub()

// Glow Cookies
// ===================================================
class LanguagesGC {
  constructor(code) {
    this.init()
    let lang = this.arrLang[code] || this.arrLang['en']
    this.bannerHeading = lang['bannerHeading']
    this.bannerDescription = lang['bannerDescription']
    this.bannerLinkText = lang['bannerLinkText']
    this.acceptBtnText = lang['acceptBtnText']
    this.rejectBtnText = lang['rejectBtnText']
    this.manageText = lang['manageText']
  }

  init() {
    this.arrLang = {
      en: {
        'bannerHeading': 'We use cookies',
        'bannerDescription': 'We use our own and third-party cookies to personalize content and to analyze web traffic.',
        'bannerLinkText': 'Read more about cookies',
        'acceptBtnText': 'Accept cookies',
        'rejectBtnText': 'Reject',
        'manageText': 'Manage cookies'
      },
      es: {
        'bannerHeading': 'Uso de cookies',
        'bannerDescription': 'Utilizamos cookies propias y de terceros para personalizar el contenido y para analizar el tráfico de la web.',
        'bannerLinkText': 'Ver más sobre las cookies',
        'acceptBtnText': 'Aceptar cookies',
        'rejectBtnText': 'Rechazar',
        'manageText': 'Cookies'
      },
      de: {
        'bannerHeading': 'Verwendung von Cookies',
        'bannerDescription': 'Wir nutzen Eigene und Cookies Dritter um Inhalte zu personalisieren und Surfverhalten zu analysieren.',
        'bannerLinkText': 'Mehr über Cookies',
        'acceptBtnText': 'Cookies akzeptieren',
        'rejectBtnText': 'Ablehnen',
        'manageText': 'Cookies verwalten'
      },
      fr: {
        'bannerHeading': 'Nous utilisons des cookies',
        'bannerDescription': 'Nous utilisons nos propres cookies et ceux de tiers pour adapter le contenu et analyser le trafic web.',
        'bannerLinkText': 'En savoir plus sur les cookies',
        'acceptBtnText': 'Accepter les cookies',
        'rejectBtnText': 'Refuser',
        'manageText': 'Paramétrez les cookies'
      },
      th: {
        'bannerHeading': 'Cookies',
        'bannerDescription': 'พวกเราใช้คุกกี้บุคคลที่สาม เพื่อปรับแต่งเนื้อหาและวิเคราะห์การเข้าชมเว็บ',
        'bannerLinkText': 'อ่านเพิ่มเติมเกี่ยวกับคุกกี้',
        'acceptBtnText': 'ยอมรับคุกกี้',
        'rejectBtnText': 'ปฏิเสธคุกกี้',
        'manageText': 'Cookies'
      },
      sk: {
        'bannerHeading': 'Používame cookies',
        'bannerDescription': 'Na prispôsobenie obsahu a analýzu webovej stránky používame vlastné cookies a cookies tretích strán.',
        'bannerLinkText': 'Čo sú cookies?',
        'acceptBtnText': 'Povoliť cookies',
        'rejectBtnText': 'Nepovoliť',
        'manageText': 'Spravovať cookies'
      }
    }
  }

}

class GlowCookies {
  constructor() {
    // Cookies banner
    this.banner = undefined
    // Config
    this.config = undefined
    this.tracking = undefined
    // DOM ELEMENTS
    this.PreBanner = undefined
    this.Cookies = undefined
    this.DOMbanner = undefined
  }

  render() {
    this.addCss()
    this.createDOMElements()
    this.checkStatus()
  }

  addCss() {
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `https://cdn.jsdelivr.net/gh/manucaralmo/GlowCookies@3.1.1/src/glowCookies.min.css`);
    document.head.appendChild(stylesheet);
  }

  createDOMElements() {
    // COOKIES BUTTON
    this.PreBanner = document.createElement("div");
    this.PreBanner.innerHTML = `<button type="button" id="prebannerBtn" class="prebanner prebanner__border__${this.config.bannerStyle} glowCookies__${this.config.position} glowCookies__${this.config.border} animation" style="color: ${this.banner.manageCookies.color}; background-color: ${this.banner.manageCookies.background};">
                                  <svg fill="currentColor" style="margin-right: 7px; margin-top: 2px; vertical-align: text-top;" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                      <path d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0 0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77 54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0 0 57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"/>
                                  </svg>${this.banner.manageCookies.text}</button>`;
    this.PreBanner.style.display = "none";
    document.body.appendChild(this.PreBanner);

    // COOKIES BANNER
    this.Cookies = document.createElement("div");
    this.Cookies.innerHTML = `<div 
                                  id="glowCookies-banner" 
                                  class="glowCookies__banner glowCookies__banner__${this.config.bannerStyle} glowCookies__${this.config.border} glowCookies__${this.config.position}"
                                  style="background-color: ${this.banner.background};"
                              >
                                  <h3 style="color: ${this.banner.color};">${this.banner.heading}</h3>
                                  <p style="color: ${this.banner.color};">
                                      ${this.banner.description} 
                                      <a 
                                          href="${this.banner.link}"
                                          target="_blank" 
                                          class="read__more"
                                          style="color: ${this.banner.color};"
                                      >
                                          ${this.banner.linkText}
                                      </a>
                                  </p>
                                  <div class="btn__section">
                                      <button type="button" id="acceptCookies" class="btn__accept accept__btn__styles" style="color: ${this.banner.acceptBtn.color}; background-color: ${this.banner.acceptBtn.background};">
                                          ${this.banner.acceptBtn.text}
                                      </button>
                                      <button type="button" id="rejectCookies" class="btn__settings settings__btn__styles" style="color: ${this.banner.rejectBtn.color}; background-color: ${this.banner.rejectBtn.background};">
                                          ${this.banner.rejectBtn.text}
                                      </button>
                                  </div>
                              </div>
                          `;
    document.body.appendChild(this.Cookies);
    this.DOMbanner = document.getElementById('glowCookies-banner')


    // SET EVENT LISTENERS
    document.getElementById('prebannerBtn').addEventListener('click', () => this.openSelector())
    document.getElementById('acceptCookies').addEventListener('click', () => this.acceptCookies())
    document.getElementById('rejectCookies').addEventListener('click', () => this.rejectCookies())
  }

  checkStatus() {
    switch (localStorage.getItem("GlowCookies")) {
      case "1":
        this.openManageCookies();
        this.activateTracking();
        this.addCustomScript();
        break;
      case "0":
        this.openManageCookies();
        break;
      default:
        this.openSelector();
    }
  }

  openManageCookies() {
    this.PreBanner.style.display = this.config.hideAfterClick ? "none" : "block"
    this.DOMbanner.classList.remove('glowCookies__show')
  }

  openSelector() {
    this.PreBanner.style.display = "none";
    this.DOMbanner.classList.add('glowCookies__show')
  }

  acceptCookies() {
    localStorage.setItem("GlowCookies", "1")
    this.openManageCookies()
    this.activateTracking()
    this.addCustomScript()
  }

  rejectCookies() {
    localStorage.setItem("GlowCookies", "0");
    this.openManageCookies();
    this.disableTracking();
  }

  activateTracking() {
    // GLOW ANALYTICS
    if (glowHubScript) {
      glowHubScript.initAnalytics()
    }
    // ===================
    // Google Analytics Tracking
    if (this.tracking.AnalyticsCode) {
      let Analytics = document.createElement('script');
      Analytics.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${this.tracking.AnalyticsCode}`);
      document.head.appendChild(Analytics);
      let AnalyticsData = document.createElement('script');
      AnalyticsData.text = `window.dataLayer = window.dataLayer || [];
                              function gtag(){dataLayer.push(arguments);}
                              gtag('js', new Date());
                              gtag('config', '${this.tracking.AnalyticsCode}');`;
      document.head.appendChild(AnalyticsData);
    }

    // Facebook pixel tracking code
    if (this.tracking.FacebookPixelCode) {
      let FacebookPixelData = document.createElement('script');
      FacebookPixelData.text = `
                                  !function(f,b,e,v,n,t,s)
                                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                  n.queue=[];t=b.createElement(e);t.async=!0;
                                  t.src=v;s=b.getElementsByTagName(e)[0];
                                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                                  'https://connect.facebook.net/en_US/fbevents.js');
                                  fbq('init', '${this.tracking.FacebookPixelCode}');
                                  fbq('track', 'PageView');
                              `;
      document.head.appendChild(FacebookPixelData);
      let FacebookPixel = document.createElement('noscript');
      FacebookPixel.setAttribute('height', `1`);
      FacebookPixel.setAttribute('width', `1`);
      FacebookPixel.setAttribute('style', `display:none`);
      FacebookPixel.setAttribute('src', `https://www.facebook.com/tr?id=${this.tracking.FacebookPixelCode}&ev=PageView&noscript=1`);
      document.head.appendChild(FacebookPixel);
    }

    // Hotjar Tracking
    if (this.tracking.HotjarTrackingCode) {
      let hotjarTrackingData = document.createElement('script');
      hotjarTrackingData.text = `
                              (function(h,o,t,j,a,r){
                                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                                  h._hjSettings={hjid:${this.tracking.HotjarTrackingCode},hjsv:6};
                                  a=o.getElementsByTagName('head')[0];
                                  r=o.createElement('script');r.async=1;
                                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                                  a.appendChild(r);
                              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                              `;
      document.head.appendChild(hotjarTrackingData);
    }
  }

  disableTracking() {
    // Google Analytics Tracking ('client_storage': 'none')
    if (this.tracking.AnalyticsCode) {
      let Analytics = document.createElement('script');
      Analytics.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${this.tracking.AnalyticsCode}`);
      document.head.appendChild(Analytics);
      let AnalyticsData = document.createElement('script');
      AnalyticsData.text = `window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${this.tracking.AnalyticsCode}' , {
                          'client_storage': 'none',
                          'anonymize_ip': true
                      });`;
      document.head.appendChild(AnalyticsData);
    }

    // Clear cookies - not working 100%
    this.clearCookies()
  }

  clearCookies() {
    let cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c++) {
      let d = window.location.hostname.split(".");
      while (d.length > 0) {
        let cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
        let p = location.pathname.split('/');
        document.cookie = cookieBase + '/';
        while (p.length > 0) {
          document.cookie = cookieBase + p.join('/');
          p.pop();
        };
        d.shift();
      }
    }
  }

  addCustomScript() {
    if (this.tracking.customScript !== undefined) {
      let customScriptTag

      this.tracking.customScript.forEach(script => {
        if (script.type === 'src') {
          customScriptTag = document.createElement('script');
          customScriptTag.setAttribute('src', script.content);
        } else if (script.type === 'custom') {
          customScriptTag = document.createElement('script');
          customScriptTag.text = script.content;
        }

        if (script.position === 'head') {
          document.head.appendChild(customScriptTag);
        } else {
          document.body.appendChild(customScriptTag);
        }
      })
    }
  }

  start(languaje, obj) {
    if (!obj) obj = {}
    const lang = new LanguagesGC(languaje)

    this.config = {
      border: obj.border || 'border',
      position: obj.position || 'left',
      hideAfterClick: obj.hideAfterClick || false,
      bannerStyle: obj.style || 2
    }

    this.tracking = {
      AnalyticsCode: obj.analytics || undefined,
      FacebookPixelCode: obj.facebookPixel || undefined,
      HotjarTrackingCode: obj.hotjar || undefined,
      customScript: obj.customScript || undefined
    }

    this.banner = {
      description: obj.bannerDescription || lang.bannerDescription,
      linkText: obj.bannerLinkText || lang.bannerLinkText,
      link: obj.policyLink || '#link',
      background: obj.bannerBackground || '#fff',
      color: obj.bannerColor || '#1d2e38',
      heading: obj.bannerHeading !== 'none' ? obj.bannerHeading || lang.bannerHeading : '',
      acceptBtn: {
        text: obj.acceptBtnText || lang.acceptBtnText,
        background: obj.acceptBtnBackground || '#253b48',
        color: obj.acceptBtnColor || '#fff'
      },
      rejectBtn: {
        text: obj.rejectBtnText || lang.rejectBtnText,
        background: obj.rejectBtnBackground || '#E8E8E8',
        color: obj.rejectBtnColor || '#636363'
      },
      manageCookies: {
        color: obj.manageColor || '#1d2e38',
        background: obj.manageBackground || '#fff',
        text: obj.manageText || lang.manageText,
      }
    }

    // Draw banner
    this.render()
  }
}

// Glow Analytics
// ===================================================
class glowAnalytics {
  constructor(clientID, privacy, event = 'pageView') {
    this.baseURL = `${BASE_URL}/analytics/new/view`
    this.cookieName = this.getGACookie('gh_id') || undefined
    this.privacy = privacy

    this.beaconsData = {
      clientID: clientID,
      user_id: this.cookieName || null,
      viewTempID: Math.random().toString(36).substring(2),
      webEvent: event,
      title: document.title,
      referrer: document.referrer,
      location: window.location,
      domain: document.domain,
      cookiesEnabled: navigator.cookieEnabled,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      loadedDate: new Date().getTime(),
      sendDate: undefined,
      performance: performance,
    }

    this.start()
  }

  start() {
    if (!this.cookieName) { this.setCookie() }
    if (this.beaconsData.clientID) {
      this.sendTempData()
      this.addListener()
    }
  }

  sendTempData() {
    this.beaconsData.sendDate = this.beaconsData.loadedDate
    navigator.sendBeacon(`${this.baseURL}?temp=true`, JSON.stringify(this.beaconsData));
  }

  sendData() {
    this.beaconsData.sendDate = new Date().getTime()
    navigator.sendBeacon(this.baseURL, JSON.stringify(this.beaconsData));
  }

  setCookie() {
    if (!this.privacy) {
      let expires = (new Date(Date.now() + 86400 * 500000)).toUTCString();
      let randomUser = Math.random().toString(36).substring(2);
      document.cookie = `gh_id=ga_${randomUser}; expires=${expires};`;
    }
  }

  getGACookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }

    return undefined;

    //return document.cookie.match('(^|;)\\s*' + 'gh_id' + '\\s*=\\s*([^;]+)')?.pop() || undefined
  }

  addListener() {
    const sendDataVisibilityHide = () => {
      if (document.visibilityState === 'hidden') { this.sendData() }
    }

    const sendDataPageHide = () => {
      this.sendData()
    }

    const sendTempDataVisible = () => {
      if (document.visibilityState === 'visible') { this.sendTempData() }
    }

    document.addEventListener('visibilitychange', sendDataVisibilityHide)
    document.addEventListener('visibilitychange', sendTempDataVisible)
    window.addEventListener('pagehide', sendDataPageHide)
    window.addEventListener('beforeunload', sendDataPageHide)
  }
}
