<template>
  <div>
    <!-- Reward Elements -->
    <div id="confetti-elem"></div>
    <div id="balloons-elem"></div>
    <div id="emoji-elem"></div>
    <div id="full-page"></div>
  </div>
</template>

<script>
import { useReward } from "vue-rewards";

export default {
  setup() {
    const confettiReward = useReward("confetti-elem", "confetti").reward;
    const balloonsReward = useReward("balloons-elem", "balloons").reward;
    const emojiReward = useReward("emoji-elem", "emoji").reward;
    const fullPageReward = useReward("full-page", "confetti", {
      startVelocity: 10,
      spread: 180,
      elementCount: 100,
    }).reward;

    return {
      confettiReward,
      balloonsReward,
      emojiReward,
      fullPageReward,
    };
  },
};
</script>

<style scoped>
#full-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
  align-items: center;
}
</style>
