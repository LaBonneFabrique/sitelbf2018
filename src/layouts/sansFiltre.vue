<template>

    <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
    :header-class="{'no-shadow': true}"
  >
  <q-layout-header class="no-shadow">
      <q-toolbar color="amber-8" inverted class="no-shadow">
        <img
          src="~assets/logoLBFpetit.png"
          style="margin-rigt: 10px;"
        />
    <q-toolbar-title>
    </q-toolbar-title>
<menuNavigation></menuNavigation>
  </q-toolbar>
  </q-layout-header>
<q-page-container>
  <q-page>
      <router-view :key="$route.fullPath" />
  </q-page>
</q-page-container>

<q-modal v-model="modalConnexion" :content-css="{padding: '20px'}" minimized @show="$refs.password.focus()">
  <h5 style="margin: 0px">Votre mot de passe</h5>
  <p></p>
  <q-input ref="password" type="password" float-label = "mot de passe" v-model="password" @keydown="keyDown($event)"/>
  <div><q-btn flat inverted size="sm" label="Mot de passe oublié ?" class="float-right" @click="oublieMDP()"></q-btn></div>
  <div class="float-right"><q-btn flat inverted color="amber-8" @click="modalConnexion = false">Annuler</q-btn>
  <q-btn flat inverted color="light-green-8" @click="connexion()">Connexion</q-btn></div>
</q-modal>
<q-modal v-model="modalInscription" :content-css="{padding: '20px'}" minimized @show="$refs.nom.focus()">
  <h5 style="margin: 0px">Formulaire d'inscription</h5>
  <p>Bienvenue sur le site de la Bonne Fabrique</p>
    <q-input @keydown="keyDown($event)" ref="nom" float-label="Nom" v-model="nom" @input="$v.nom.$touch" :error="$v.nom.error" />
    <span v-if="!$v.nom.required">Votre nom est requis.</span>
    <q-input @keydown="keyDown($event)" float-label="Prénom" v-model="prenom" @input="$v.prenom.$touch" :error="$v.prenom.error" />
    <span v-if="!$v.prenom.required">Votre prénom est requis.</span>
    <q-input @keydown="keyDown($event)" type="password" float-label = "mot de passe" v-model="password" @input="$v.password.$touch" :error="$v.password.$error"/>
    <span v-if="!$v.password.required">Le mot de passe est requis</span>
    <span v-if="!$v.password.minLength">Minimum 6 caractères de long</span>
    <q-input @keydown="keyDown($event)" type="password" float-label = "confirmer le mode passe" v-model="repeatPassword" @input="$v.repeatPassword.$touch" :error="$v.repeatPassword.$error"/>
    <span v-if="!$v.repeatPassword.sameAsPassword">Les mots de passe ne correspondent pas.</span><br />
    <q-btn flat inverted color="amber-8" @click="modalInscription = false">Annuler</q-btn>
    <q-btn flat inverted color="light-green-8" @click="inscription()" :disable="$v.nom.$error || $v.prenom.$error || $v.email.$error || $v.password.$error || $v.password.$error || $v.repeatPassword.$error">S'enregistrer</q-btn>
</q-modal>

<q-modal
  v-model="menuFiltre"
  position="left"
  :content-css="{height: '460px'}"
  >
  <q-btn
  flat inverted
  class="float-right"
  icon="fas fa-times"
  @click="menuFiltre=false"
  />
            <div class="menuCategories">
        <div class="menuTitreCategories">Catégories</div>
        <q-checkbox v-model="listeTypes" keep-color color="primary" label="Ateliers" val="Ateliers" class="menuItemCategorie" @input="emitListeType"/>
        <q-checkbox v-model="listeTypes" keep-color color="secondary" label="Infos" val="Infos" class="menuItemCategorie" @input="emitListeType"/>
        <q-checkbox v-model="listeTypes" keep-color color="tertiary" label="Petites Annonces" val="PetitesAnnonces" class="menuItemCategorie" @input="emitListeType"/>
      </div>
      <div class="menuFiltreTitre">Filtrer par section</div>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuCowork', {'coworkActive': testFiltre('LespaceCoworking')}]" >
        <a @click="toggleFiltres('LespaceCoworking')">
      <use xlink:href="/statics/iconsLBF/coworking.svg#LespaceCoworking"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuLBF', {'lbfActive': testFiltre('LaBonneFabrique')}]" >
        <a @click="toggleFiltres('LaBonneFabrique')">
      <use xlink:href="/statics/iconsLBF/bonnefabrique.svg#LaBonneFabrique"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuBrasserie', {'brasserieActive': testFiltre('LaBrasserie')}]" >
        <a @click="toggleFiltres('LaBrasserie')">
      <use xlink:href="/statics/iconsLBF/brasserie.svg#LaBrasserie"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuJardin', {'jardinActive': testFiltre('JardinPartage')}]" >
        <a @click="toggleFiltres('JardinPartage')">
      <use xlink:href="/statics/iconsLBF/jardin.svg#JardinPartage"/>
        </a>
      </svg>
      <svg viewBox="0 0 350 350" width="100" height="100" :class="['menuAtelier', {'atelierActive': testFiltre('Latelier')}]" >
        <a @click="toggleFiltres('Latelier')">
      <use xlink:href="/statics/iconsLBF/atelier.svg#Latelier"/>
        </a>
      </svg>
</q-modal>

  </q-layout>
</template>

<script>
/* import {
  date
} from 'quasar' */
// const { addToDate } = date
import layoutStore from '../constants/layoutStore'
import { authMixins } from '../utils/auth'
import { validationMixin } from 'vuelidate'
import { email, required, sameAs, minLength } from 'vuelidate/lib/validators'
import {FIND_USER_BY_EMAIL} from '../graphQL/userAuth'
import { mailMixins } from '../utils/envoiMail'
import menuNavigation from '../components/menuNavigation'

async function isUnique () {
  let retour = true
  console.log(this.email)
  await this.$apollo.query({
    query: FIND_USER_BY_EMAIL,
    fetchPolicy: 'network-only',
    variables: {
      email: this.email
    }
  }).then((data) => {
    console.log(data)
    if (data.data.allUsers.length > 0) retour = false
  })
  return retour
}

export default {
  mixins: [authMixins, validationMixin, mailMixins],
  components: {
    menuNavigation
  },
  created () {
    // this.$eventBus.$on('logginState', this.updateEstIdentifie)
  },
  beforeDestroy () {
    // this.$eventBus.$off('logginState', this.updateEstIdentifie)
  },
  data () {
    return {
      layoutStore,
      estIdentifie: this.$q.localStorage.has('token'),
      email: '',
      emailInscription: '',
      password: '',
      repeatPassword: '',
      nom: '',
      prenom: '',
      menuGauche: false,
      menuInscription: false,
      menuIdentification: false,
      modalInscription: false,
      modalConnexion: false,
      menuInscriptionAtelier: false,
      prenomRecoverMDP: '',
      menuLayout: true,
      listeFiltres: [],
      listeTypes: ['Ateliers', 'Infos', 'PetitesAnnonces'],
      menuFiltre: false
    }
  },
  validations: {
    nom: {
      required
    },
    prenom: {
      required
    },
    email: {
      required,
      email
    },
    emailUnique: {
      isUnique
    },
    password: {
      required,
      minLength: minLength(6)
    },
    repeatPassword: {
      sameAsPassword: sameAs('password')
    }
  },
  mounted () {
    this.estIdentifie = this.$q.localStorage.has('token')
  },
  methods: {
    emitListeType () {
      console.log('pof, emit')
      if (this.listeTypes.length === 0) {
        this.listeTypes = ['Ateliers', 'Infos', 'PetitesAnnonces']
      }
      this.$eventBus.$emit('filtreTypes', this.listeTypes)
    },
    testFiltre (filtre) {
      return (this.listeFiltres.indexOf(filtre) >= 0 || this.listeFiltres.length === 0)
    },
    toggleFiltres (filtre) {
      let index = this.listeFiltres.indexOf(filtre)
      if (index < 0) {
        this.listeFiltres.push(filtre)
      } else {
        this.listeFiltres.splice(index, 1)
      }
      this.$eventBus.$emit('filtreMenu', this.listeFiltres)
    },
    /* inscription: async function () {
      let nomCap = this.nom.charAt(0).toUpperCase() + this.nom.slice(1)
      let prenomCap = this.prenom.charAt(0).toUpperCase() + this.prenom.slice(1)
      this.modalInscription = false
      this.$q.loading.show({
        spinner: QSpinnerCircles,
        message: 'Enregistrement dans la base en cours...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      await this.signup(this.email, this.password, nomCap, prenomCap)
      this.$q.loading.hide()
      this.estIdentifie = this.$q.localStorage.has('token')
      this.email = ''
      this.password = ''
      this.repeatPassword = ''
      this.$router.push({name: 'Tableau de bord', params: { userId: this.loggedInUser() }})
    },
    async connexion () {
      this.modalConnexion = false
      this.$q.loading.show({
        spinner: QSpinnerCircles,
        message: 'vérification des données utilisateur...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      await this.login(this.email, this.password).then((data) => {
        this.userRoles().then(async (result) => {
          await this.$q.localStorage.set('roles', result.data.allUsers[0].role)
          this.$q.loading.hide()
          this.estIdentifie = this.$q.localStorage.has('token')
          this.$eventBus.$emit('logginState')
          this.$q.notify({
            type: 'positive',
            timeout: 2500,
            message: 'Vous êtes maintenant connecté.'
          })
        }).catch((error) => {
          console.log(error)
        })
      }).catch((error) => {
        this.$q.loading.hide()
        if (error.message.search('password') > 0) {
          this.$q.notify({
            type: 'negative',
            timeout: 2500,
            message: 'Ce n\'est pas le bon mot de passe'
          })
        }
        if (error.message.search('mail') > 0) {
          this.$q.notify({
            type: 'negative',
            timeout: 2500,
            message: 'Cette adresse mail n\'a pas été trouvée dans la base'
          })
        }
      })
    },
    deconnexion: function () {
      this.$q.localStorage.clear()
      // console.log(this.$q.localStorage.has('token'), this.$q.localStorage.has('idUser'))
      this.estIdentifie = this.$q.localStorage.has('token')
      this.menuGauche = false
      this.menuInscription = false
      this.menuIdentification = false
      this.$eventBus.$emit('logginState')
      this.$router.push({name: 'accueil'})
    },
    updateEstIdentifie: function () {
      this.$set(this, 'estIdentifie', this.$q.localStorage.has('token'))
    },
    verifMailInscription () {
      this.menuInscriptionAtelier = false
      this.$eventBus.$emit('verifInscription', this.emailInscription)
    },
    verifMail: async function () {
      this.menuIdentification = false
      let inscription = true
      await this.$apollo.query({
        query: FIND_USER_BY_EMAIL,
        fetchPolicy: 'network-only',
        variables: {
          email: this.email
        }
      }).then((data) => {
        if (data.data.allUsers.length > 0) {
          inscription = false
          this.prenomRecoverMDP = data.data.allUsers[0].profil[0].prenom
        }
      })
      if (inscription) {
        this.modalInscription = true
      } else {
        this.modalConnexion = true
      }
    },
    async oublieMDP () {
      this.modalConnexion = false
      this.$q.loading.show({
        spinner: QSpinnerCircles,
        message: 'Envoie d\'un mail de récupération de mot de passe en cours...',
        messageColor: 'white',
        spinnerSize: 250, // in pixels
        spinnerColor: 'white',
        customClass: 'bg-test'
      })
      let uId = ''
      await this.$apollo.query({
        query: FIND_USER_BY_EMAIL,
        variables: {
          email: this.email
        }
      }).then((result) => {
        uId = result.data.allUsers[0].id
      }).catch((error) => {
        console.log(error)
        this.$q.notify({
          type: 'negative',
          timeout: 2500,
          message: 'Il y a eu un problème. Veuillez essayer à nouveau.'
        })
      })
      if (uId !== '') {
        console.log(uId)
        let validity = addToDate(new Date(), { minutes: 20 })
        let idToken = ''
        await this.$apollo.mutate({
          mutation: RESET_MDP_TOKEN,
          variables: {
            userId: uId,
            validity: validity
          }
        }).then((result) => {
          console.log(result.data.createResetMDP)
          idToken = result.data.createResetMDP.id
        })
        if (idToken !== '') {
          console.log(idToken)
          this.envoiMailMDP(this.email, this.prenomRecoverMDP, uId, idToken).then((result) => {
            this.$q.loading.hide()
            if (result.data.sendMailgunEmail.success) {
              this.$q.notify({
                type: 'positive',
                timeout: 2500,
                message: 'Les instructions pour modifier votre mot de passe vous ont été envoyées.'
              })
            }
          }).catch((error) => {
            console.log(error)
            this.$q.loading.hide()
            this.$q.notify({
              type: 'negative',
              timeout: 2500,
              message: 'Il y a eu un problème. Veuillez essayer à nouveau.'
            })
          })
        } else {
          this.$q.loading.hide()
          this.$q.notify({
            type: 'negative',
            timeout: 2500,
            message: 'Il y a eu un problème. Veuillez essayer à nouveau un peu plus tard'
          })
        }
      }
    }, */
    openMenuIdentification () {
      this.menuIdentification = true
      this.$refs.initialEmail.focus()
    },
    keyDown (event) {
      if (event.keyCode === 13) {
        if (this.menuIdentification) {
          if (!this.$v.email.$error) this.verifMail()
        }
        if (this.modalConnexion) {
          this.connexion()
        }
        if (this.modalInscription) {
          if (!this.$v.nom.$error && !this.$v.prenom.$error && !this.$v.email.$error && !this.$v.password.$error && !this.$v.password.$error && !this.$v.repeatPassword.$error) this.inscription()
        }
      }
    },
    changeMenuFiltre () {
      this.menuFiltre = !this.menuFiltre
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.text-atelier
  color: $atelier

.text-rencontre
  color: $rencontre

.text-coworking
  color: $coworking

.bg-test
  background-color: rgba(75, 188, 196, 0.5)

.menuCadre
  float: left
  width: 150px
  height: 460px
  padding: 0px
  margin: 0px

.menuCategories
  position: relative
  width: 140px
  height: 80px
  left: 0px !important
  top: 3px

.menuTitreCategories
  position: relative
  width: 140px
  height: 15px
  top: 3px
  font-family: Roboto
  font-weight: 900
  font-size: 14px
  text-align: center
  font-variant: small-caps
  color: #5C5C5C
  margin-bottom: 6px

.menuListCategorie
  margin: 0px
  padding: 0px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal
  font-size: 13px
  text-align: center !important
  text-transform: capitalize

.menuItemCategorie
  position: relative
  width: 140px
  height: 15px
  left: 10px
  font-family: Roboto
  font-style: normal
  font-weight: normal
  line-height: normal
  font-size: 13px
  text-align: center !important
  text-transform: capitalize
  margin: 0px
  margin-bottom: 5px

.menuFiltreTitre
  position: absolute
  width: 130px
  height: 15px
  left: 5px
  top: 90px
  font-family: Roboto
  font-style: normal
  font-weight: 900
  line-height: normal
  font-size: 14px
  text-align: center
  font-variant: small-caps
  color: #5C5C5C

.menuCowork
  position: absolute
  width: 80px
  height: 80px
  left: 10px
  top: 109px
.menuCowork a
  fill: rgba(75, 188, 196, 0.4)
.menuCowork a:hover
  fill: rgba(75, 188, 196, 0.6)
  cursor: pointer
.coworkActive a
  fill: rgba(75, 188, 196, 1)

.menuLBF
  position: absolute
  width: 80px
  height: 80px
  left: 50px
  top: 171px
.menuLBF a
  fill: rgba(227, 46, 57, 0.4)
.menuLBF a:hover
  fill: rgba(227, 46, 57, 0.6)
  cursor: pointer
.lbfActive a
  fill: rgba(227, 46, 57, 1)

.menuBrasserie
  position: absolute
  width: 80px
  height: 80px
  left: 10px
  top: 233px
.menuBrasserie a
  fill: rgba(252, 198, 45, 0.4)
.menuBrasserie a:hover
  fill: rgba(252, 198, 45, 0.6)
  cursor: pointer
.brasserieActive a
  fill: rgba(252, 198, 45, 1)

.menuJardin
  position: absolute
  width: 80px
  height: 80px
  left: 50px
  top: 295px
.menuJardin a
  fill: rgba(147, 192, 33, 0.4)
.menuJardin a:hover
  fill: rgba(147, 192, 33, 0.6)
  cursor: pointer
.jardinActive a
  fill: rgba(147, 192, 33, 1)

.menuAtelier
  position: absolute
  width: 80px
  height: 80px
  left: 10px
  top: 357px
.menuAtelier a
  fill: rgba(238, 115, 46, 0.4)
.menuAtelier a:hover
  fill: rgba(238, 115, 46, 0.6)
  cursor: pointer
.atelierActive a
  fill: rgba(238, 115, 46, 1)
  cursor: pointer

.typeAtelier:hover
  background-color: $coworking

</style>
