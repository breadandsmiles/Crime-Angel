# Crime bot
A v10 Discord.JS music bot in 100 lines or less

## Installation (Windows)

Phần này để chạy bot cục bộ trên Windows. Nếu bạn đang dùng Mac thì nó cũng tương tự. Tôi sẽ cho rằng người dùng Linux có thể tìm ra nó.

### Download Node.js

Node.js là những gì sẽ được sử dụng để chạy bot.
Tải xuống [Node.js 6.X từ trang web] (https://nodejs.org/en/).

### Install Node.js

Mở Cài đặt Node.js.
Trong các tùy chọn, đảm bảo `Node.js runtime`` npm manager manager` và` Add to PATH` được bật. Sau đó cài đặt Node.js.

### Install Windows-Build-Tools

Mở một cửa sổ powershell và chạy `npm i -g windows-build-tools`. Điều này sẽ mất một lúc vì nó sẽ tải xuống và cài đặt cả hai công cụ xây dựng python 2.7 và c ++, vì vậy bạn có thể chạy các bản dựng nút-gyp.

### Download Git

Và cài đặt nó. Trang web này là http://git-scm.com và đảm bảo bạn chọn "cho dấu nhắc lệnh".

### Download FFMPEG

Tải xuống FFMPEG từ [trang web này] (https://ffmpeg.zeranoe.com/builds/). Đảm bảo tìm ** Bản dựng tĩnh ** hiện tại cho Kiến trúc hệ điều hành của bạn (32 bit / 64 bit).

### Install & Configure FFMPEG

Trích xuất các tập tin vào thư mục gốc của ổ cứng của bạn và đổi tên thư mục thành `ffmpeg`. 

**Then add FFMPEG to your Path variable:**

1. `windows key + x`
2. go to system
3. on the left Advanced system settings
4. Environment Variables
5. under System variables find the variable **Path** hit edit
  * Depending on your version of windows you may have a list of entries or a semicolon sperated field of entries. 

**If Windows 10:**

1. Hit the new button on the right
2. add `c:\ffmpeg\bin`

**If older versions of Windows:**

1. add `;c:\ffmpeg\bin` to the end of the field.

### Download and Install OhGodMusicBot

Next you'll need to download the bot and configure it.
Download the master branch and put the unzipped files in a new folder on your computer.
Next rename .json.example to .json and enter the correct information. *Note: You will have to remove any and all comments from the .json.example file, as they are not supported in json. They are there to guide you as you decide how you want to configure your bot*

For obtaining a Discord Bot token, please see [this page.](https://discordapp.com/developers/docs/intro)

Before running the bot you need to install the dependencies.
In the folder you put the files in, Shift+Right click and select open command window here.
In the command prompt type `npm install`.

The bot should now be ready!
Open a command prompt like above and type `npm start` to start the bot and see if it works.

### Install dependencies

**Windows**

Shift-RightClick in the folder that you downloaded and select Open command window here. Then type `npm install` and hit Enter.

**Linux**

cd to where you cloned the GitHub repo and type `npm install`. This will take a while.
