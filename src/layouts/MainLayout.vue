<template>
  <q-layout>
    <q-header elevated class="bg-white">
      <q-toolbar class="constrain bg-white text-grey-10" bordered>
        <q-btn flat round class="large-screen-only q-mr-sm" icon="eva-camera-outline" size="md" dense to="/camera"/>
        <q-separator spaced vertical class="large-screen-only"/>
        <q-toolbar-title class="text-grand-hotel text-bold">
          Quasargram
        </q-toolbar-title>
        <q-btn flat round class="large-screen-only" icon="eva-home-outline" size="md" dense to="/"/>
      </q-toolbar>
    </q-header>
    <q-footer class="bg-white small-screen-only" bordered>
        <q-tabs class="text-grey-10" active-color="primary" indicator-color="transparent">
          <q-route-tab to="/" icon="eva-home-outline"/>
          <q-route-tab to="/camera" icon="eva-camera-outline"/>
        </q-tabs>
      </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',

  data () {
    return {

    }
  }
}
</script>

<style lang="sass">
  .q-toolbar
    @media(min-width: $breakpoint-xs-max)
      height: 77px
  .q-footer
    .q-tab__icon
      font-size: 30px
    
  .q-toolbar__title
    @media(max-width: $breakpoint-xs-max)
      text-align: center
    font-size: 30px
</style>
