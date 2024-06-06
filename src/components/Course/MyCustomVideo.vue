<template>
  <div class="video-container">
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from "video.js";

export default {
  name: "MyCustomVideo",
  props: {
    videoUrl: {
      type: String,
      required: true,
    },
    videoType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      player: null,
    };
  },
  mounted() {
    const options = {
      autoplay: true,
      controls: true,
      sources: [
        {
          src: this.videoUrl,
          type: `video/${this.videoType}`,
        },
      ],
    };
    this.player = videojs(this.$refs.videoPlayer, options, () => {
      this.player.log("onPlayerReady", this);
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

<style scoped>
.video-container {
  width: 100%;
}

.video-js {
  width: 100%;
}
</style>
