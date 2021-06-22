
chrome.webRequest.onBeforeRequest.addListener(

  function (details) {
    chrome.storage.sync.get(['key'], function (result) {

      if (Array.isArray(result.key) && result.key.length > 0) {
        result.key.forEach((item) => {
          if (item.enabled && details.initiator === item.src_ip) {
            chrome.cookies.getAll({ url: item.src_ip }, function (cookies) {
              cookies.forEach(function (cookie) {
                chrome.cookies.set({
                  url: item.dest_ip,
                  name: cookie.name,
                  value: cookie.value
                })
              })
            })
          }
        })
      }
    });
  },
  { urls: ["<all_urls>"] },  //监听所有的url,你也可以通过*来匹配。
  ["blocking"]
)
