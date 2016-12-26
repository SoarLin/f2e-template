# Frontend Template with Gulp
============================

## Environment

建立此專案當下的環境

* node v4.2.2
* npm 3.9.2
* bower 1.8.0

## Installation

預設已經安裝好 node.js 與 npm 兩項工具了

1. `npm install -g bower gulp` 安裝 bower 與 gulp 到全域環境下
2. `npm install` 安裝此專案所需要套件
3. `bower install` 安裝此專案所需要前端第三方套件

## Folder Architecture

目錄結構
.
├── .bowerrc
├── .eslintrc.json
├── .gitignore
├── README.md
├── assets/
│　　├── css/
│　　├── images/
│　　├── js/
│　　└── sass/
│　　　　├── main.scss
│　　　　├── modules/
│　　　　└── partials/
├── bower.json
├── bundle-vendor.config.js
├── gulpfile.js
├── package.json
├── public/
│　　├── bower/
│　　└── img/
├── templates/
│   ├── index.ejs
│   └── partials/
└── views/

### 概念

* CSS 前端處理器使用 Sass
* HTML 樣板使用 EJS
* 自動化流程使用 Gulp
* 基本 stylesheet, javascript, images 檔案先放在 assets 下，編譯後放到 public 目錄下
* html檔案先以 ejs 格式存放在 templates 下，編譯後放到 views 目錄下
* 前端套件使用 bower 進行管理, 預設目錄放在 public/bower 下

#### assets 目錄

* sass : scss 樣式檔依據模組 or 區塊再分成兩個資料夾放，透過 main.scss 將所有檔案載入一起編譯
* css : sass編譯後產生的 css 暫存檔存放區
* js : 頁面內的 javascript 抽離至這裡撰寫, 最後編譯成單一檔案
* images : 理想中圖片都先丟到這個目錄, 壓縮後才放到 public 目錄下

#### templates 目錄

* index.ejs : 基本html檔範例, 注意上方變數 title 用來命名每個頁面標題
* partials : HTML檔部分區塊存放處

#### views 目錄

* views : ejs 產生的 html 檔存放處

#### public 目錄

* js : assets/js 編譯串接後的檔案存放處
* css : assets/sass 編譯後檔案存放處
* img : assets/image 下圖片壓縮後存放處

#### 單一檔案說明

* .bowerrc : bower 設定檔, 指定下載的套件存放目錄
* .eslintrc.json : esline 設定檔, 用來檢查 js 語法
* .gitignore : git 要忽略的檔案設定
* bower.json : bower 安裝套件與版本
* bundle-vendor.config.js : 指定第三方套件 js 檔編譯成單一檔案，用來減少 request 數量
* gulpfile.js : gulp 指令檔案
* package.json : npm 安裝套件與版本

## Command

### gulp 


指令       |   用途
--------- | -------------
gulp clean | 清除文件, 包含js,css,html檔
gulp html  |  建立html檔, 將ejs檔轉換成html檔案輸出
gulp styles | 建立CSS檔, 將Sass檔案轉換為單一CSS檔
gulp scripts | 建立JS檔, 將多個js檔案合併成單一JS檔案
gulp images  | 處理圖片檔, 將圖片檔進行壓縮輸出
gulp bundle-vendor | 將前端所用 3rd 套件 JS 整合成單一檔案
gulp watch | 自動偵測 scss, js, ejs 檔案變化, 執行對應動作
gulp (default) | 預設執行動作, clean -> images, bundle-vendor, styles, scripts, html
gulp **--env=production** | 輸出壓縮過的css與js檔



