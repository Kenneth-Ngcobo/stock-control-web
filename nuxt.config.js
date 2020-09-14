
export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
 env: {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },

  head: {
    title: 'Figment Stock and Jobs Sytem',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [{ src: "~plugins/vue-tables-2.js", ssr: false }],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth'
    //'vue-xlsx'
  ],

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login', method: 'post', propertyName: false },
          logout: { url: '/login' },
          user: { url: '/auth/user', method: 'get', propertyName: 'user' },
          home: 'boms'
        },
        tokenRequired: false,
        // tokenType: 'bearer',
        // globalToken: true,
        // autoFetchUser: true
      }
    }
  },

  axios: {
    
    baseURL: process.env.BASE_URL || 'http://localhost:1234', // Used as fallback if no runtime config is provided
  },
  
 


  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    vendor: ['vue-tables-2']
  }
}


