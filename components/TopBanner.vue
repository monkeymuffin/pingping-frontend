<template>
  <div class="top-banner">
    <div class="bg-section contianer-fluid row">
      <div class="col-7"></div>
      <div class="col-5 round-column">
        <div class="round-bg"></div>
      </div>
    </div>
    <div class="container row mt-10 m-auto">
      <div class="col-7 main-column">
        <div class="h1 mb-3">{{ title }}</div>

        <p>{{ subtitle }}</p>

        <StoreLogos class="text-left" />

        <div class="accordion">
        </div>
      </div>
      <div class="col-5 frame-column text-center">
        <PhoneFrame />
      </div>
    </div>
  </div>
</template>

<script>
import StoreLogos from './StoreLogos'
import PhoneFrame from './PhoneFrame'
import VueTypes from 'vue-types'

export default {
  name: 'TopBanne',

  components: {
    StoreLogos,
    PhoneFrame
  },

  props: {
    title: VueTypes.string,
    subtitle: VueTypes.string
  }
}
</script>

<style lang="scss">
@import "bootstrap/scss/_functions.scss";
@import "bootstrap/scss/_variables.scss";
@import "bootstrap/scss/_mixins.scss";

.top-banner {
  position: relative;
  overflow: hidden;
  margin-top: -100px;

  .bg-section {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    z-index: -1;
  }

  .round-bg {
    border-radius: 50%;
    background-color: rgba(192, 234, 239, 0.5);
    width: 70rem;
    height: 70rem;
    margin-top: -25rem;
    margin-right: -10rem;
  }

  .main-column {
    z-index: 10;
  }

  .container-xl {
    margin: auto;
  }

  .frame-column {
    display: flex;
    align-items: end;
  }

  @include media-breakpoint-down(sm) {
    .main-column,
    .frame-column {
      @include make-col(12);
    }
  }
}
</style>
