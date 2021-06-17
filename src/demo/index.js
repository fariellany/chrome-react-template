
// ? https://blog.csdn.net/weixin_33836874/article/details/86262165

// 可以修改请求
// chrome.webRequest.onBeforeRequest.addListener(

//   function (details) {
//     var url = details.url;
//     console.log(url, 'url=======>');
//     console.log(details, 'details=======>');
//     //通过匹配测试一个请求
//     // if (url.indexOf("min-player") != -1) {
//     //   return { redirectUrl: "localhost/player.js" }; //我试了本机服务器下的一个文件。
//     //   //1. 记得要返回rediretUrl. 之前我用url,是无效的。     
//     // }
//     return true;
//   },
//   { urls: ["<all_urls>"] },  //监听所有的url,你也可以通过*来匹配。
//   ["blocking"]
// )


//  监听Header
// chrome.webRequest.onSendHeaders.addListener(

//   function (details) {
//     console.log(details, 'details=======>onSendHeaders');
//     //通过匹配测试一个请求
//     // if (url.indexOf("min-player") != -1) {
//     //   return { redirectUrl: "localhost/player.js" }; //我试了本机服务器下的一个文件。
//     //   //1. 记得要返回rediretUrl. 之前我用url,是无效的。     
//     // }
//     return true;
//   },
//   { urls: ["<all_urls>"] },  //监听所有的url,你也可以通过*来匹配。
//   ["requestHeaders"]
// )

// 提前cookie
chrome.webRequest.onSendHeaders.addListener(function (details) {
  // console.log(window, 'window');
  // console.log(window.localStorage, 'window.localStorage');
  // console.log(details, 'details');
  // 远程
  details.requestHeaders.some(function (header) {
    if (header.name === 'Cookie' && details.initiator === 'https://developer.wgine.com') {
      window.localStorage.setItem('cookie', header.value)
      console.log("New Cookie value:" + header.value);
      return true;
    }
    return false;
  });
}, { urls: ["<all_urls>"] }, ['requestHeaders', 'extraHeaders']);


chrome.webRequest.onSendHeaders.addListener(

  function (details) {
    // 本地
    if (details.initiator === 'http://localhost:3000') {
      const obj = details.requestHeaders && details.requestHeaders.find(k => k.name === 'Cookie')
      if (!obj) {
        const str = "fast-sid=6Bl91w7Qt1NYHL_Boz9Qa8i8MzAMZt-x; tz=8; _tpmGuid=TY-b37b0c66e86a73b7; notice_preferences=2:; notice_gdpr_prefs=0,1,2:; _ga=GA1.2.1550462329.1623117105; _pykey_=42973d16-7c74-55d6-ae24-953a048a0372; e255ad9b8262a02d28bca48235a96357=111116298; 7ce0ff06556c05363a176b03dfdd5680=4462; a608ea7c4cbd1919ce039822a2e5d753=04462; cd1f6c4c522c03e21ad83ee2d7b0c515=%E8%8B%8F%E8%BD%BC%EF%BC%88%E7%86%8A%E6%A2%A6%E6%B6%9B%EF%BC%89; stat_guide_flag=1; Hm_lvt_84e9ca2e92f205eb136485f2bfefcd5e=1623118264,1623405738; region=AY; COOKICE_USER_TOKEN_PC=ss_YKdN0O0uMdYudJ1j8qniIWS6hk2AVIeElejV7pY1q6tJaRB6HejZYjPv-ETWOyffUTfe4PG2tvLliCoB2N4nDjqFD08u-_BRdpSfNEJEltLxJ97-DARxwYHYKuf-yL1UPb9odw; _gid=GA1.2.753030371.1623738659; _tpmSid=c34ef97c228824bc7eade683723e449adc800a5c7da03ab7a8ee8e1c9600511a; gTyPlatLang=zh; gTyPlatLang=zh; locale=zh; SSO_USER_TOKEN=ss_7ZECgtikq2jNaaXLO7rJjKEuC13SRflKgjn1eNfTXm6zMC4v7FGcbXCdwlPf0DPpYish84vaw4CjvVyXNjfYcuyqSkSAWnyOWJXQCGUOJpzgq83Jwx4OjjCNT4TN7Q; s-sid=s:fed4ce5c-6587-4cfd-ba91-e9b45e10f87f.gm175LJ3K4P/gK3HHoigLtyHyYrcRC2qxJqKUWAWvHo; _tpmSeqId=seq_id_c81e0e0f1dcda48b"
        const arr = str.split(';')
        console.log(document.cookie, '= cookie ======>');
        arr.forEach(k => {
          // console.log(k, 'k');
          document.cookie = k.trim()
        })
        return true
      }
      return true
    }
    return true;
  },
  { urls: ["<all_urls>"] },  //监听所有的url,你也可以通过*来匹配。
  ["requestHeaders", 'extraHeaders']
)