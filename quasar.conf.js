// Configuration for your app

module.exports = function (ctx) {
  return {
    plugins: [
      'apollo',
      'eventBus',
      'head',
      'store'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      //'material-icons',
      // 'ionicons',
      // 'mdi',
      'fontawesome'
    ],
    supportIE: false,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      path: '/',
      gzip: true,
      analyze: {analyzerMode: 'server', analyzerHost: '0.0.0.0', analyzerPort: '8080' },
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
        cfg.module.rules.push({
          test: /\.txt$/,
          loader: 'raw-loader'
        })
      }
    },
    devServer: {
      //https: true,
      host: process.env.IP,
      port: process.env.PORT,
      hot: true,
      open: false, // opens browser window automatically,
      public: 'http://site-lbf-2018-nico-l.c9users.io'
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      i18n: 'fr',
      iconSet: 'fontawesome',
      components: [
        'QDatetimePicker',
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QPageSticky',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QCard',
        'QCardTitle',
        'QCardMain',
        'QCardMedia',
        'QCardSeparator',
        'QCardActions',
        'QTable',
        'QTd',
        'QToggle',
        'QSpinnerGears',
        'QModal',
        'QPopover',
        'QInput',
        'QTabs',
        'QTab',
        'QTabPane',
        'QTooltip',
        'QField',
        'QChip',
        'QDatetime',
        'QRange',
        'QCheckbox',
        'QRadio',
        'QSelect',
        'QRouteTab',
        'QEditor',
        'QAutocomplete',
        'QBtnDropdown',
        'QOptionGroup',
        'QItemSeparator',
        'QBtnGroup',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QFab',
        'QFabAction',
        'QWindowResizeObservable',
        'QSearch'
      ],
      directives: [
        'Ripple'
      ],
      plugins: [
        'Notify',
        'LocalStorage',
        'Loading',
        'Dialog',
        'Cookies'
      ],
      directives: ['CloseOverlay']
    },
    // animations: 'all' --- includes all animations
    animations: [
    ],
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0-beta.4'
  }
}
