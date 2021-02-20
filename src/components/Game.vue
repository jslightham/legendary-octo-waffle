<template>
  <div>
    <button v-on:click="sendMessage()">Send Message</button>
    <video ref="video" autoplay></video>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import * as posenet from "@tensorflow-models/posenet";
import * as utils from "../utils";

export default {
  data() {
    return {
      connection: null,
      message: {},
    };
  },
  created() {
    console.log("Starting connection to websocket server");
    console.log(this.$route.params.id);
    this.connection = new WebSocket(
      "ws://50.100.180.37:4000/" + this.$route.params.id
    );

    this.connection.onopen = function (event) {
      console.log(event);
      console.log("Successfully connected to the echo WebSocket Server");
    };

    this.connection.onmessage = function (event) {
      console.log(event); // When we recieve a message
    };
  },
  async mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
    this.net = await posenet.load();
    this.streamPromise = await this.initWebcamStream();
    this.detectPose();
  },
  methods: {
    sendMessage() {
      console.log(this.connection);
      this.message.playerId = this.getCookie("playerId");
      this.message.gameId = this.$route.params.id;
      console.log(this.message);
      let str = JSON.stringify(this.message);
      this.connection.send(str);
    },
    getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    initWebcamStream() {
      // if the browser supports mediaDevices.getUserMedia API
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices
          .getUserMedia({
            audio: false, // don't capture audio
            video: { facingMode: "environment" }, // use the rear camera if there is
          })
          .then((stream) => {
            // set <video> source as the webcam input
            let video = this.$refs.video;
            try {
              video.srcObject = stream;
            } catch (error) {
              // support older browsers
              video.src = URL.createObjectURL(stream);
            }
            return new Promise((resolve) => {
              // when video is loaded
              video.onloadedmetadata = () => {
                // calculate the video ratio
                this.videoRatio = video.offsetHeight / video.offsetWidth;
                // add event listener on resize to reset the <video> and <canvas> sizes
                window.addEventListener("resize", this.setResultSize);
                // set the initial size
                this.setResultSize();
                resolve();
              };
            });
          })
          .catch((error) => {
            console.log("failed to initialize webcam stream", error);
            throw error;
          });
      } else {
        return Promise.reject(
          new Error(
            "Your browser does not support mediaDevices.getUserMedia API"
          )
        );
      }
    },
    setResultSize () {
      // get the current browser window size
      let clientWidth = document.documentElement.clientWidth
      // set max width as 600
      this.resultWidth = Math.min(600, clientWidth)
      // set the height according to the video ratio
      this.resultHeight = this.resultWidth * this.videoRatio
      // set <video> width and height
      /*
        Doesn't use vue binding :width and :height,
          because the initial value of resultWidth and resultHeight
          will affect the ratio got from the initWebcamStream()
      */
      let video = this.$refs.video
      video.width = this.resultWidth
      video.height = this.resultHeight
    },
    timeout(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    async detectPose() {
        const imageScaleFactor = 0.5;
        const flipHorizontal = false;
        const outputStride = 16;
        this.pose = await this.net.estimateSinglePose(this.$refs.video, imageScaleFactor, flipHorizontal, outputStride) 
        console.log(this.pose);
        utils.drawSkeleton(this.pose.keypoints, 0.3, this.ctx);
        //this.renderPose();
        // await this.timeout(1000/20);
        // return this.detectPose();
        requestAnimationFrame(() => {
            this.detectPose();
        })
    }
  },
};
</script>

<style>
</style>