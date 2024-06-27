<template>
  <div id="pptxViewer"></div>
</template>

<script>
export default {
  props: {
    fileUrl: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    // Dynamically load the CSS files
    this.loadCSS("/pptxjs/css/pptxjs.css");
    this.loadCSS("/pptxjs/css/nv.d3.min.css");

    // Dynamically load the JS files
    await this.loadScript("/pptxjs/js/jquery-1.11.3.min.js");
    await this.loadScript("/pptxjs/js/jszip.min.js");
    await this.loadScript("/pptxjs/js/filereader.js");
    await this.loadScript("/pptxjs/js/d3.min.js");
    await this.loadScript("/pptxjs/js/nv.d3.min.js");
    await this.loadScript("/pptxjs/js/pptxjs.js");
    await this.loadScript("/pptxjs/js/divs2slides.js");

    // Initialize the PPTX viewer
    this.initPptxViewer();
  },
  methods: {
    loadCSS(href) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    },
    loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    },
    initPptxViewer() {
      const pptxConfig = {
        pptxFileUrl: this.fileUrl,
        slidesScale: "",
        slideMode: false,
        keyBoardShortCut: false,
        mediaProcess: true,
        slideModeConfig: {
          first: 1,
          nav: false,
          navTxtColor: "white",
          showPlayPauseBtn: false,
          keyBoardShortCut: false,
          showSlideNum: false,
          showTotalSlideNum: false,
          autoSlide: false,
          randomAutoSlide: false,
          loop: false,
          background: "black",
          transition: "default",
          transitionTime: 1,
        },
      };

      $("#pptxViewer").pptxToHtml(pptxConfig);
    },
  },
};
</script>

<style>
/* Add any custom styles here */
</style>
