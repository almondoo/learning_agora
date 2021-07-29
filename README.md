# learning_agora  
agora学習リポジトリ  
スタック  
vue: 2.5.2  
agora-rtc-sdk: 3.6.2  

## 開発環境設定  
1. コマンド make start-up  
docker-compose build  
dokcer-compose up -d  
を行う  

2. コマンド make bash  
nodeコンテナに入る  

3. vue/config/dev.env.example.jsをdev.example.jsにファイル名を変更して中身を書き換える。  
AGORA_ID, AGORA_TOKEN, AGORA_CHANNELのenvでAgoraの情報を入力する。  

4. npm run dev  
ビルド+サーバーを立てる。  

注意  
※jestが入っているが今は使用されていない  
