\#dn Dr. NaminG
---------------

[![Circle CI](https://circleci.com/gh/mfnewwind/newwind/tree/master.svg?style=svg)](https://circleci.com/gh/mfnewwind/newwind/tree/master)

これは、とても素晴らしいサービスになる予定です (たぶん)


## 開発環境

 - [Node.js](https://nodejs.org/) v0.12.x
    - Mac, *nix 環境では [nodebrew](https://github.com/hokaccha/nodebrew) や [nvm](https://github.com/creationix/nvm), [ndenv](https://github.com/riywo/ndenv) を使うと便利です。
    - Windows 環境では [nvmw](https://github.com/hakobera/nvmw) を使うか、[公式のインストーラー](https://nodejs.org/download/) を使ってください。
 - [gulp](http://gulpjs.com/)
    - フロントエンド & サーバーサイドの JS 製ビルドツール (Grunt の親戚)
    - インストールは `npm install -g gulp`



## 依存ライブラリ

 - [Vue.js](http://vuejs.org/)
    - JS フロントエンド MVVM フレームワーク
    - シンプル・軽量
    - 参考サイト
       - [Vue.js 公式リファレンス (英語)](http://vuejs.org/api/)
       - [ライオンでも分かるVuejs](http://www.slideshare.net/lion-man/vuejs)
       - [Vue.js資料まとめ](https://gist.github.com/hashrock/f575928d0e109ace9ad0)

- [Less](http://lesscss.org/)
  - CSSプリプロセッサ
    - コンパイルするとCSSになる、便利な文法が増えたCSS
    - 今回はLessの機能は入れ子と変数程度しか使いません


## インストール

```sh
$ git clone git@github.com:mfnewwind/newwind.git
```


## 起動
以下は、プロジェクトのディレクトリに移動して作業してください。

```sh
$ npm install
$ npm start
```

## 更新
`$ git pull` した際にうまく動作しない場合は、依存ライブラリを更新すると直る場合があります。

```sh
$ npm install
```

## 開発
プロジェクトのディレクトリに移動して

```sh
$ npm install # 初回のみ
$ npm run dev
```

これで`localhost:3000`から見れるようになります。
JSとCSSは`src`内のファイルを変更すれば自動でコンパイルされます。

### フロントエンドのファイル置き場

- Image : `public/images/`
- Javascript : `src/javascripts/`
- Stylesheet : `src/stylesheets/`
- HTML(jade) : `views/`
