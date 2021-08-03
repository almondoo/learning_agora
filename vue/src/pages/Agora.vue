<template>
  <div>
    <h1>Agora学習</h1>
    <p v-if="this.isLogin">ログインしてるよ</p>
    <button class="btn login-btn" v-on:click="login">ログイン</button>
    <button class="btn logout-btn" v-on:click="logout">ログアウト</button>
    <div class="display">
      <div class="video-wrap">
        <h4>Local video</h4>
        <div id="me" ref="me"></div>
      </div>
      <div class="video-wrap">
        <h4>Remote video</h4>
        <div id="remote-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import AgoraRTC from 'agora-rtc-sdk'

export default {
  name: 'Agora',

  data() {
    return {
      client: null, // agora client
      localStream: null, // agora localStream 自分自身
      isLogin: false, // true ログイン中 false ログインしていない
      isCreatingClient: false,
      // agoraに必要なデータ
      options: {
        appId: process.env.AGORA_ID,
        token: process.env.AGORA_TOKEN,
        channel: process.env.AGORA_CHANNEL
      }
    }
  },

  methods: {
    login: function () {
      // ログインしているか確認
      if (!this.isLogin && !this.isCreatingClient) {
        this.isCreatingClient = true
        console.log('loginするで')

        // VueInstance格納
        const vueInstance = this

        // client作成
        const client = AgoraRTC.createClient({
          mode: 'rtc',
          codec: 'vp8'
        })
        vueInstance.client = client

        // 初期設定
        vueInstance.client.init(
          vueInstance.options.appId,
          function () {
            console.log('クライアント 初期設定')
          },
          vueInstance.handleError
        )

        // 参加
        vueInstance.client.join(
          vueInstance.options.token,
          vueInstance.options.channel,
          null,
          () => {
            // ローカルクライアント作成
            const localStream = AgoraRTC.createStream({
              audio: true,
              video: true
            })
            vueInstance.localStream = localStream

            // 自分のストリームを公開する
            vueInstance.localStream.init(() => {
              vueInstance.localStream.play('me')
              vueInstance.client.publish(
                vueInstance.localStream,
                vueInstance.handleError
              )
              // client生成終了 + ログイン
              vueInstance.isCreatingClient = false
              vueInstance.isLogin = true
            }, vueInstance.handleError)

            vueInstance.streamAdd()
            vueInstance.streamSubscribed()
            vueInstance.streamRemoved()
            vueInstance.peerLeave()
          },
          vueInstance.handleError
        )
      } else {
        console.log('loginしてるで')
      }
    },

    logout: function () {
      // ログインしているか確認
      if (this.isLogin) {
        console.log('logoutやで')

        // ローカルストリームを止める
        this.localStream.close()

        // 画面削除
        const me = document.getElementById('me')
        me.removeChild(me.firstChild)
        // 退室
        this.client.leave()

        // 初期化
        this.isLogin = false
      } else {
        console.log('loginしてないからlogoutできへんで')
      }
    },

    handleError: function (err) {
      console.log('Error:', err)
    },

    // streamを追加
    addVideoStream: function (elementId) {
      const streamDiv = document.createElement('div')
      streamDiv.id = elementId
      streamDiv.style.transform = 'rotateY(180deg)'
      streamDiv.style.width = '400px'
      streamDiv.style.height = '300px'
      document.getElementById('remote-container').appendChild(streamDiv)
    },

    // stream削除
    removeVideoStream: function (elementId) {
      const remoteDiv = document.getElementById(elementId)
      if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv)
    },

    // 公開時に自分以外のストリームをサブスクライブする
    streamAdd: function () {
      const vueInstance = this
      return vueInstance.client.on('stream-added', function (evt) {
        vueInstance.client.subscribe(evt.stream, vueInstance.handleError)
      })
    },

    // 追加時に自分以外のストリームを再生する
    streamSubscribed: function () {
      const vueInstance = this
      return vueInstance.client.on('stream-subscribed', function (evt) {
        let stream = evt.stream
        let streamId = String(stream.getId())
        vueInstance.addVideoStream(streamId)
        stream.play(streamId)
      })
    },

    // 自分以外のユーザーが非公開になったら、対応するビューを削除します
    streamRemoved: function () {
      const vueInstance = this
      return vueInstance.client.on('stream-removed', function (evt) {
        let stream = evt.stream
        let streamId = String(stream.getId())
        stream.close()
        vueInstance.removeVideoStream(streamId)
      })
    },

    peerLeave: function () {
      const vueInstance = this
      // 自分以外のユーザーがチャネルを離れるときに、対応するビューを削除します。
      return vueInstance.client.on('peer-leave', function (evt) {
        let stream = evt.stream
        let streamId = String(stream.getId())
        stream.close()
        vueInstance.removeVideoStream(streamId)
      })
    }
  }
}
</script>

<style>
* {
  font-family: sans-serif;
}
h1,
h4 {
  text-align: center;
}
#me {
  margin: 0 auto;
}
#me video {
  position: relative !important;
}
#remote-container {
  display: flex;
}
#remote-container video {
  position: relative !important;
}
.btn {
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
}
.login-btn {
  background-color: #1e90ff;
}
.logout-btn {
  background-color: grey;
}
.display {
  display: flex;
  justify-content: center;
}
.video-wrap {
  width: 400px;
}
</style>

711382933
