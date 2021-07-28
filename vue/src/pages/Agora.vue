<template>
  <div>
    <h1>Agora学習</h1>
    <h4>Local video</h4>
    <div id="me"></div>
    <h4>Remote video</h4>
    <div id="remote-container"></div>
  </div>
</template>

<script>
import AgoraRTC from 'agora-rtc-sdk'

const options = {
  appId: process.env.AGORA_ID,
  token: process.env.AGORA_TOKEN,
  channel: process.env.AGORA_CHANNEL
}
export default {
  name: 'Agora',

  created() {
    const handleError = function (err) {
      console.log('Error:', err)
    }

    // streamを追加
    function addVideoStream(elementId) {
      const streamDiv = document.createElement('div')
      streamDiv.id = elementId
      streamDiv.style.transform = 'rotateY(180deg)'
      streamDiv.style.width = '500px'
      streamDiv.style.height = '500px'
      document.getElementById('remote-container').appendChild(streamDiv)
    }

    // stream削除
    function removeVideoStream(elementId) {
      const remoteDiv = document.getElementById(elementId)
      if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv)
    }

    // リモートクライアント作成
    const client = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8'
    })

    client.init(
      options.appId,
      function () {
        console.log('クライアント 初期設定')
      },
      function (err) {
        console.log('クライアント初期設定に失敗 ', err)
      }
    )
    client.join(
      options.token,
      options.channel,
      null,
      (uid) => {
        // ローカルクライアント作成
        const localStream = AgoraRTC.createStream({
          audio: true,
          video: true
        })

        localStream.init(() => {
          localStream.play('me')
          client.publish(localStream, handleError)
        }, handleError)

        // 公開時にリモートストリームをサブスクライブする
        client.on('stream-added', function (evt) {
          client.subscribe(evt.stream, handleError)
        })
        // 購読時にリモートストリームを再生する
        client.on('stream-subscribed', function (evt) {
          let stream = evt.stream
          let streamId = String(stream.getId())
          console.log('streamId: ', streamId)
          addVideoStream(streamId)
          stream.play(streamId)
          console.log('stream-subscribed')
        })
        // リモートユーザーが非公開になったら、対応するビューを削除します
        client.on('stream-removed', function (evt) {
          let stream = evt.stream
          let streamId = String(stream.getId())
          console.log('remove streamId: ', streamId)
          stream.close()
          removeVideoStream(streamId)
        })
        // リモートユーザーがチャネルを離れるときに、対応するビューを削除します。
        client.on('peer-leave', function (evt) {
          let stream = evt.stream
          let streamId = String(stream.getId())
          stream.close()
          removeVideoStream(streamId)
        })
      },
      handleError
    )
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
  width: 400px;
  height: 400px;
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
</style>
