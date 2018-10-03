## 轨迹故事

使用图片定位和轨迹显示可视化你的游记。让照片和轨迹带来更直观的体验。

### 使用方法1 - 便捷的内嵌式

只需添加下面的`<script>`标签到你博客的Markdown或HTML文档中。

```HTML
<script src="https://cdn.jsdelivr.net/gh/shenlvmeng/trace-story@0.1.0/src/builtIn.min.js" defer></script>

<!-- 或忽略版本号 -->

<script src="https://cdn.jsdelivr.net/gh/shenlvmeng/trace-story/src/builtIn.min.js" defer></script>
```

当然，你还需要下面的准备：

- 放置地图的DOM容器，一个简单的`<div>`即可，你可以自定义修饰它的样式
  - *（必选）*`id`需要是`trace-story`
  - *（可选）*`data-zoom`属性，表示地图的缩放级别，3-18之间，值越大缩放的越细，默认12。你可以手动调整到一个最合适的数。
- 照片
  - **请确保照片中带有地理位置的EXIF消息**，通常是照片原图
  - meta信息，目前单指`data-desc`，即照片描述

刷新页面，看看效果？

**一个例子**

```HTML
<div id="trace-story"></div>
...
<img src="/Effiel-Tower" data-desc="我参观了埃菲尔铁塔。超Skr!" />
...
<img src="/Arc-de-Triomphe" data-desc="凯旋门也超skr!" />
```

**提示**

带有地理位置EXIF信息的照片原图通常很大（数M），会严重拖慢你的网站加载时间。然而，目前绝大多数的照片压缩工具（PhotoShop除外）在压缩图片时，为了最大程度减少图片体积，都会删除EXIF信息（至少会删除EXIF地理位置信息）。如果你想要完整保留EXIF信息的JPG文件压缩，你可能需要[这个链接](https://shenlvmeng.github.io/lab/exif.html)（🚧施工中🚧）

### 使用方法2 - 游记页面

一个展示游记的完整页面。可以访问[这里](https://shenlvmeng.cn/track-story/generate/)生成。

跟着步骤一步步填写信息，生成后下载资源，放在你的博客里就可以让别人访问了。

### 可能的限制

图片定位和轨迹绘制都是基于百度地图JavaScript SDK实现。图片和轨迹在国外时，可能会出现定位不准的情况。

---

## trace-story

Visualize your trip with geo-location and gps track. Let photos and trace speak.

### Usage 1 - Inject map to your blog

Just add following `<script>` in your Markdown or HTML.

```HTML
<script src="https://cdn.jsdelivr.net/gh/shenlvmeng/trace-story@0.0.1/src/builtIn.min.js" defer></script>

<!-- or omit the version -->

<script src="https://cdn.jsdelivr.net/gh/shenlvmeng/trace-story/src/builtIn.min.js" defer></script>
```

Besides, here are what you need.

- A DOM container with following dataset property
  - *(neccessary)* `id` should be `trace-story`
  - *(optional)*`data-zoom` zoom level of the inserted map
- Photos
  - Make sure they are with geo information in their EXIFs
  - Meta data as properties on `<img>` tag, aka, `data-desc` for now

Load your blog again. Watch magic happens.

**Example**

```HTML
<div id="trace-story"></div>
...
<img src="/Effiel-Tower" data-desc="I just visited Effiel Tower. Skr!" />
...
<img src="/Arc-de-Triomphe" data-desc="Arc de Triomphe is also real skr!" />
```

You will have a Baidu Map in the prepared placeholder with photos at real geo-locations on it.

**Notice**

Original photographs are usually big which affects your website performance. But most softwares will delete EXIF information part while compressing images. If you want image compressed with EXIF, you may need [this](https://shenlvmeng.github.io/lab/exif.html).

### Usage 2 - A whole pageview

Visit [here](https://shenlvmeng.cn/track-story/generate/).

1. Follow instructions to generate a whole page.
2. Download generated resources
3. Put them to your website

### Limitation

Geo location may be inaccurate when images or tracks are out of China.
