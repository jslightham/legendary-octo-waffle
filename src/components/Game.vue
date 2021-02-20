<template>
  <div>
    <button v-on:click="sendMessage()">Send Message</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      connection: null,
      message: {},
    };
  },
  created() {
    console.log("Starting connection to websocet server");
    console.log(this.$route.params.id);
    this.connection = new WebSocket(
      "ws://192.168.1.244:4000/" + this.$route.params.id
    );

    this.connection.onopen = function (event) {
      console.log(event);
      console.log("Successfully connected to the echo WebSocket Server");
    };

    this.connection.onmessage = function (event) {
      console.log(event); // When we recieve a message
    };
  },
  mounted() {},
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
  },
};
</script>

<style>
</style>