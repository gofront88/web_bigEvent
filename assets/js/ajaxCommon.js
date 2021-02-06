$.ajaxPrefilter(function(options) {
    //拼接url的网址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})