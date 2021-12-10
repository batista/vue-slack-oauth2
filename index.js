
var slackAuth = (function () {

  function installClient() {
    var apiUrl = 'https://apis.google.com/js/api.js' // TODO: Find replacement
    
    return new Promise((resolve) => {
      var script = document.createElement('script')
      script.src = apiUrl
      script.onreadystatechange = script.onload = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
          setTimeout(function () {
            resolve()
          }, 500)
        }
      }
      document.getElementsByTagName('head')[0].appendChild(script)
    })
  }

  function initClient(config) {
    return new Promise((resolve, reject) => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init(config)
          .then(() => {
            resolve(window.gapi)
          }).catch((error) => {
            reject(error)
          })
      })
    })

  }

  function Auth() {
    if (!(this instanceof Auth))
      return new Auth()
    this.SlackAuth = null /* window.gapi.auth2.getAuthInstance() */
    this.isAuthorized = false
    this.isInit = false
    this.prompt = null
    this.isLoaded = function () {
      /* eslint-disable */
      console.warn('isLoaded() will be deprecated. You can use "this.$slackAuth.isInit"')
      return !!this.SlackAuth
    };

    this.load = (config, prompt) => {
      installClient()
        .then(() => {
          return initClient(config)
        })
        .then((gapi) => {
          this.SlackAuth = gapi.auth2.getAuthInstance()
          this.isInit = true
          this.prompt = prompt
          this.isAuthorized = this.SlackAuth.isSignedIn.get()
        }).catch((error) => {
          console.error(error)
        })
    };

    this.signIn = (successCallback, errorCallback) => {
      return new Promise((resolve, reject) => {
        if (!this.SlackAuth) {
          if (typeof errorCallback === 'function') errorCallback(false)
          reject(false)
          return
        }
        this.SlackAuth.signIn()
          .then(slackUser => {
            if (typeof successCallback === 'function') successCallback(slackUser)
            this.isAuthorized = this.SlackAuth.isSignedIn.get()
            resolve(slackUser)
          })
          .catch(error => {
            if (typeof errorCallback === 'function') errorCallback(error)
            reject(error)
          })
      })
    };

    this.getAuthCode = (successCallback, errorCallback) => {
      return new Promise((resolve, reject) => {
        if (!this.SlackAuth) {
          if (typeof errorCallback === 'function') errorCallback(false)
          reject(false)
          return
        }
        this.SlackAuth.grantOfflineAccess({ prompt: this.prompt })
          .then(function (resp) {
            if (typeof successCallback === 'function') successCallback(resp.code)
            resolve(resp.code)
          })
          .catch(function (error) {
            if (typeof errorCallback === 'function') errorCallback(error)
            reject(error)
          })
      })
    };

    this.signOut = (successCallback, errorCallback) => {
      return new Promise((resolve, reject) => {
        if (!this.SlackAuth) {
          if (typeof errorCallback === 'function') errorCallback(false)
          reject(false)
          return
        }
        this.SlackAuth.signOut()
          .then(() => {
            if (typeof successCallback === 'function') successCallback()
            this.isAuthorized = false
            resolve(true)
          })
          .catch(error => {
            if (typeof errorCallback === 'function') errorCallback(error)
            reject(error)
          })
      })
    };
  }

  return new Auth()
})();




function installSlackAuthPlugin(Vue, options) {
  /* eslint-disable */
  //set config
  let SlackAuthConfig = null
  let SlackAuthDefaultConfig = { scope: 'profile email' }
  let prompt = 'select_account'
  if (typeof options === 'object') {
    SlackAuthConfig = Object.assign(SlackAuthDefaultConfig, options)
    if (options.scope) SlackAuthConfig.scope = options.scope
    if (options.prompt) prompt = options.prompt
    if (!options.clientId) {
      console.warn('clientId is required')
    }
  } else {
    console.warn('invalid option type. Object type accepted only')
  }

  //Install Vue plugin
  Vue.slackAuth = slackAuth
  Object.defineProperties(Vue.prototype, {
    $slackAuth: {
      get: function () {
        return Vue.slackAuth
      }
    }
  })
  Vue.slackAuth.load(SlackAuthConfig, prompt)
}

export default installSlackAuthPlugin
