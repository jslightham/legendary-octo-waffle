<template>
  <div class="hello">
    Create Room: <button v-on:click="createRoom" style="border: solid">Create Room</button>
    <br>
    Join Room: <input type="text" v-model="room.id" style="border: solid"> <button v-on:click="joinRoom" style="border: solid">Join Room</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      room: {},
    };
  },
  methods: {
    createRoom() {
      this.axios.get("http://50.100.180.37:4000/rooms/add").then((res) => {
        let id = res.data._id;
        let playerId = res.data.playerId;
        this.setCookie("playerId", playerId, 1);
        this.$router.push({path: `game/${id}`});
      });
    },
    joinRoom() {
      console.log(this.room);
      this.axios.post("http://50.100.180.37:4000/rooms/join", this.room).then((res) => {
        let playerId = res.data._id;
        this.setCookie("playerId", playerId, 1);
        this.$router.push({path: `game/${this.room.id}`});
      });
    },
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
  },
};
</script>

<style scoped>
</style>
