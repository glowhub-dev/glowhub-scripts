class glowAnalytics {
  constructor(clientID, event = 'pageView') {
    this.baseURL = 'http://localhost:3001/analytics/new/view'
    this.cookieName = this.getGACookie('gh_id') || undefined

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
    let expires = (new Date(Date.now() + 86400 * 500000)).toUTCString();
    let randomUser = Math.random().toString(36).substring(2);
    document.cookie = `gh_id=ga_${randomUser}; expires=${expires};`;
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