## trace-story

Visualize your trip with geo-location and gps track. Let photos and trace speak.

### Usage 1 - Inject map to your blog

Here are what you need.

- A DOM container
- Photos
  - Make sure they are with geo information in their EXIFs
  - Meta data as properties on `<img>` tag

Then require `story.build-in.min.js` in your website. Watch magic happens.

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

Original photographs are usually big which affects your website performance. But most softwares will delete EXIF information part while compressing images. If you want image compressing with EXIF, you may need [this](https://shenlvmeng.github.io/lab/exif.html).

### Usage 2 - A whole pageview

Visit [here](https://shenlvmeng.cn/track-story/generate/).

1. Follow instructions to generate a whole page.
2. Download generated resources
3. Put them to your website

### Limitation

Geo location may be inaccurate when images or tracks are overseas.
