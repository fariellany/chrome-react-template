(function () {
  var main = {
    init() {
      this.bind()
    },
    bind() {
      var btn = document.getElementById('btn')
      if (!btn) return
      btn.addEventListener('click', function () {
        var url = document.getElementById('url')
        if (!url.value) {
          chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'images/icon.png',
            title: '错误',
            message: '请输入完整地址'
          })
          return
        }
        chrome.tabs.getSelected(null, function (tab) {
          console.log(tab, 'tab');
          chrome.cookies.getAll({ url: tab.url }, function (cookies) {
            console.log(cookies, 'cookies');
            cookies.forEach(function (cookie) {
              chrome.cookies.set({
                url: url.value,
                name: cookie.name,
                value: cookie.value
              })
            })
            // chrome.tabs.create({ url: url.value });
          })
        })
      })
    }
  }
  main.init()
})()

