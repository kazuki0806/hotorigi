# 山の湯宿 ほとり木（架空の宿のデザイン作例）

Webデザインの作例として作った、温泉旅館の公式サイトのトップページと予約ページです。**この宿は実在しません。** 宿名・社名・人名・数字・料金・住所・電話番号・メールアドレス・許可番号は、すべて作りものです。予約フォームは形だけで、入力した内容は送信も保存もされません。

公開ページ: https://kazuki0806.github.io/hotorigi/
予約ページ: https://kazuki0806.github.io/hotorigi/reserve/

## 宿の設定

長野県の山あい、標高約1,000mにある全9室の温泉旅館という設定です。1932年に湯治宿として創業し、2021年に部屋を14から9に減らして全面改装。自家源泉のかけ流しを全室の風呂に引き、夕食は囲炉裏で焼く山の料理を出します。公式サイトからの直接予約を増やすことを、サイトの目的にしています。

## デザインの方針

紙のような白（#F4F4F2）に焦げ茶（#2D2519）のインクで文字と線を置き、余白と細い線で見せる組み方にしました。書体は欧文が STIX Two Text、和文が Shippori Mincho B1、数字とラベルが Azeret Mono（すべて Google Fonts）。土色（#734129）はフッターの面だけに使っています。

見せ場は4つです。掛け軸のように縦長に切り抜いた写真がスクロールで横いっぱいに開くファーストビュー、縦書きのコピー、どこにいても押せる予約ボタン、2種類の客室の見比べ。

動きは GSAP と ScrollTrigger で、読み込み時のフェードと少し上への移動、セクション到達時の順次表示、写真の切り抜きが開く動きを付けています。OSの「視差効果を減らす」設定（prefers-reduced-motion）では、すべて止めて最終状態を表示します。

## 中身

- `index.html` … トップページ本体
- `reserve/index.html` … 空室の確認・ご予約のフォーム（形だけ）
- `404.html` … 見つからないページ
- `assets/style.css` … 色・書体・余白のトークンと、全セクションのスタイル
- `assets/reserve.css`, `assets/reserve.js` … 予約フォームの見た目と、入力チェック・料金の目安・完了画面
- `assets/guard.js` … フォントを表示を止めずに読み込み、動きの準備ができなかったときは2.5秒で全部を表示する
- `assets/main.js` … GSAP の初期化、メニューの開閉、写真の切り抜き、#章付きURLへの移動
- `assets/gsap.min.js`, `assets/ScrollTrigger.min.js` … GSAP 3.13.0（cdnjs から取得）
- `images/` … 仮の写真11枚（WebP）と、シェア用の画像 `ogp.jpg`
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, ファビコン一式

## 予約フォームについて

チェックイン日と泊数、客室（離れ「沢」か本館「杜」）、人数、お名前とご連絡先、チェックインの予定時刻、送迎、ご要望を入力し、キャンセル料に同意して送る形です。右側の「ご予約内容」に、選んだ日程と客室、宿泊料金の目安がその場で出ます。

入力チェックは宿の決まりに合わせています。客室ごとの定員（沢は2〜4名、杜は1〜2名）、フリガナはカタカナ、電話番号は10〜11桁、送迎は前日までの予約、12月〜3月の日付を選ぶと冬タイヤの案内が出ます。料金の目安は、宿の資料にある料金（沢は2名1室で1名52,800円〜、杜は2名1室で1名38,500円〜、1名1室で49,500円〜）から計算できる組み合わせだけ出し、それ以外は「ご予約のあとにご案内」としています。

送信はしません。送信ボタンは JavaScript が動くまで押せず、押しても送信を止めて完了画面を出すだけです。名前やメールアドレスなど個人の情報を入れる欄には name 属性を付けていないので、万一フォームが送られても中身は含まれません。

## リリース前チェックリストの結果

社内のチェックリスト48項目で確認し、追加素材なしで直せるものは直しました。

対応済みの項目は、meta title と description、canonical、robots.txt、sitemap.xml、html lang、JSON-LD（Organization と BreadcrumbList）、OGP一式と Twitter カード、1200×630のシェア画像、ファビコン（ico・32・16・180・192・512）、theme-color、site.webmanifest、画像のWebP化、Googleフォントをページで使う文字だけに絞る（6ファイル）、ファーストビュー外の遅延読込、imgのwidth/height明示、375pxと1440pxでの表示確認、alt、コントラスト比、見出し階層（h1は1つ、飛ばしなし）、CSSとJSの外部ファイル化、セマンティックHTML（フォームは label・fieldset・legend で組み、エラーは各欄の下に出して読み上げにもつなげています）、SSLとHTTPSの強制、内部リンクのチェック、ダミーテキストなし、コピーライトの年号、404ページ、環境変数（APIキーなし）です。

未対応の項目と、その理由は次のとおりです。

| 項目 | 理由 |
| --- | --- |
| noindex | 架空の宿なので、検索結果に出さないよう意図的に noindex にしています（チェックリストの index とは逆） |
| GA4・Search Console・コンバージョン計測 | 本番の測定IDと所有権確認が必要。テスト用IDを入れるのはチェックリスト自身が禁じているため入れていません |
| フォームの送信先・到達確認 | 予約フォームは形だけで、意図的にどこへも送信しません |
| プライバシーポリシー・宿泊約款・キャンセルについて | 下層ページを作っていないため、フッターのリンクは飛び先なしです |
| 特商法・Cookie同意 | 販売行為と計測がないため対象外です |
| Lighthouse・Core Web Vitals | 手元に計測ツールがなく、数値を確認していません |
| シェア表示の確認 | X・Facebook のデバッガーはログインが必要なため未確認です |

なお `robots.txt` は、GitHub Pages のプロジェクトページではドメイン直下のものだけが読まれるため、この場所では効きません。検索避けは各ページの noindex で行っています。

## 写真について

本番用の写真はまだないので、Unsplash のフリー写真を仮に置いています。実在の宿・人物・看板が写っていないものを選びました。

| ファイル | 撮影者 | 元ページ |
| --- | --- | --- |
| hero | Valentin | https://unsplash.com/photos/ufjI0V-mtoc |
| about | Andy Arbeit | https://unsplash.com/photos/EaEjg1dd1xU |
| room-sawa | Yosuke Ota | https://unsplash.com/photos/TeNtfZuCWe8 |
| room-mori | Anton Sobotyak | https://unsplash.com/photos/VPFi-s-xyXU |
| dining | Adam Mills | https://unsplash.com/photos/SHFQI_DGgAU |
| onsen | Kris Tian | https://unsplash.com/photos/yyDKLnY2M6s |
| biz-retreat | Yosuke Ota | https://unsplash.com/photos/OYR2mPD3yRY |
| biz-workation | EFFYDESK | https://unsplash.com/photos/UhzeAgXvGSs |
| biz-shooting | Ingmar | https://unsplash.com/photos/R9tPheZuGnA |
| stream | Brice Cooper | https://unsplash.com/photos/KeZT-1Inl8U |
| hallway | 5010 | https://unsplash.com/photos/M9Y8SeVpH1E |

## 見るには

そのままブラウザで `index.html` を開けます。手元で確認するときは、このフォルダで次を実行して http://localhost:8798 を開いてください。

```bash
python3 -m http.server 8798
```
