# 設定方法
1, LINEの開発者用サイトに[ログイン](https://developers.line.biz/en/?status=success)する

2, "Log in with LINE account"を選択してログイン

3, 「新規プロバイダー作成」、「新規チャンネル作成(messaging api)」をする

4, 設定画面から"Channel Secret"と"Access Token"を取得する

5, 取得したクレデンシャル情報を `.env` に書く ( `.env_sample` 参照)

# 説明
Google Translation APIを使って英訳Botを作ろうと思ったのですが、有料だったので断念。

代わりに[こちら](https://qiita.com/tanabee/items/c79c5c28ba0537112922)を使います。

[@tanabeeさん](https://qiita.com/tanabee)ありがとうございます。

発言の内容をURIエンコードし、そのままパラメータとしてセットしてGETしているというシンプルな構成です。
