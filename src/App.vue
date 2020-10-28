<template>
  <v-app>
    <v-app-bar
      app
      color="#000000"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Logo Stara"
          class="shrink mr-2"
          contain
          src="/logo/STR-02.png"
          transition="scale-transition"
          width="100"
        />    
      </div>
      <template>
        <v-tabs v-model="tab">
          <v-tabs-slider color="#eb258e"></v-tabs-slider>
          <v-tab href="#survey">Encuesta</v-tab>
          <!-- <v-tab href="#report">Reporte</v-tab> -->
        </v-tabs>
      </template>
      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <div v-if="tab == 'survey'">
        <Survey/>
      </div>
      <!-- <div v-if="tab == 'report'">
        <Report/>
      </div> -->
    </v-main>
  </v-app>
</template>

<script>
import Survey from './components/Survey';

export default {
  name: 'App',

  components: {
    Survey
  },

  data: () => ({
    tab: null
  }),
};
</script>

<style lang="css">
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave {}

.fade-leave-active {
  transition: opacity 0.3s ease;
  opacity: 0;
}
</style>