# 山の湯宿 ほとり木（架空の宿のデザイン作例）

Webデザインの作例として作った、温泉旅館の公式サイトのトップページです。**この宿は実在しません。** 宿名・社名・人名・数字・料金・住所・電話番号・メールアドレス・許可番号は、すべて作りものです。予約ボタンとリンクは動きません。

公開ページ: https://kazuki0806.github.io/hotorigi/

## 宿の設定

長野県の山あい、標高約1,000mにある全9室の温泉旅館という設定です。1932年に湯治宿として創業し、2021年に部屋を14から9に減らして全面改装。自家源泉のかけ流しを全室の風呂に引き、夕食は囲炉裏で焼く山の料理を出します。公式サイトからの直接予約を増やすことを、サイトの目的にしています。

## デザインの方針

紙のような白（#F4F4F2）に焦げ茶（#2D2519）のインクで文字と線を置き、余白と細い線で見せる組み方にしました。書体は欧文が STIX Two Text、和文が Shippori Mincho B1、数字とラベルが Azeret Mono（すべて Google Fonts）。土色（#734129）はフッターの面だけに使っています。

見せ場は4つです。掛け軸のように縦長に切り抜いた写真がスクロールで横いっぱいに開くファーストビュー、縦書きのコピー、どこにいても押せる予約ボタン、2種類の客室の見比べ。

動きは GSAP と ScrollTrigger で、読み込み時のフェードと少し上への移動、セクション到達時の順次表示、写真の切り抜きが開く動きを付けています。OSの「視差効果を減らす」設定（prefers-reduced-motion）では、すべて止めて最終状態を表示します。

## 中身

- `index.html` … トップページ本体
- `assets/style.css` … 色・書体・余白のトークンと、全セクションのスタイル
- `assets/main.js` … GSAP の初期化、メニューの開閉、写真の切り抜き
- `assets/gsap.min.js`, `assets/ScrollTrigger.min.js` … GSAP 3.13.0（cdnjs から取得）
- `images/` … 仮の写真11枚

## 写真について

本番用の写真はまだないので、Unsplash のフリー写真を仮に置いています。実在の宿・人物・看板が写っていないものを選びました。

| ファイル | 撮影者 | 元ページ |
| --- | --- | --- |
| hero.jpg | Valentin | https://unsplash.com/photos/ufjI0V-mtoc |
| about.jpg | Andy Arbeit | https://unsplash.com/photos/EaEjg1dd1xU |
| room-sawa.jpg | Yosuke Ota | https://unsplash.com/photos/TeNtfZuCWe8 |
| room-mori.jpg | Anton Sobotyak | https://unsplash.com/photos/VPFi-s-xyXU |
| dining.jpg | Adam Mills | https://unsplash.com/photos/SHFQI_DGgAU |
| onsen.jpg | Kris Tian | https://unsplash.com/photos/yyDKLnY2M6s |
| biz-retreat.jpg | Yosuke Ota | https://unsplash.com/photos/OYR2mPD3yRY |
| biz-workation.jpg | EFFYDESK | https://unsplash.com/photos/UhzeAgXvGSs |
| biz-shooting.jpg | Ingmar | https://unsplash.com/photos/R9tPheZuGnA |
| stream.jpg | Brice Cooper | https://unsplash.com/photos/KeZT-1Inl8U |
| hallway.jpg | 5010 | https://unsplash.com/photos/M9Y8SeVpH1E |

## 見るには

そのままブラウザで `index.html` を開けます。手元で確認するときは、このフォルダで次を実行して http://localhost:8798 を開いてください。

```bash
python3 -m http.server 8798
```
