<!-- ToggleButton.vue -->
<template>
  <div>
    <h3>{{ title }}</h3>
    <div class="columns">
      <div class="column">
        <i v-if="isOpen" class="fas fa-lock-open"></i>
        <i v-else class="fas fa-lock"></i>
      </div>
      <div class="column">
        <label class="switch">
          <input type="checkbox" v-model="isOpen" @change="toggleChange" />
          <span class="slider round"></span>
        </label>
      </div>
      <div class="column"></div>
      <div class="column"></div>
      <div class="column"></div>
      <div class="column"></div>
      <div class="column"></div>
      <div class="column"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: this.isChecked,
    };
  },
  methods: {
    toggleChange() {
      this.$emit("toggle-change", this.isOpen);
    },
  },
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
