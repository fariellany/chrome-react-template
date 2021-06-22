
var label, url;

document.addEventListener('DOMContentLoaded', function () {
  addLabel()
  // addContent()
});

document.addEventListener('click', function () {
  console.log('onclick');
  if (location.href === "https://libra.tuya-inc.top:7799/prod") {
    console.log('2222222');
    addContent()
  } else {
    clearContent()
  }
});

window.addEventListener('replaceState', function (e) {
  console.log('THEY DID IT AGAIN! replaceState');
});
window.addEventListener('pushState', function (e) {
  console.log('THEY DID IT AGAIN! pushState');
});

function addLabel() {
  chrome.storage.sync.get(['key'], function (result) {

    if (Array.isArray(result.key) && result.key.length > 0) {
      result.key.forEach((item) => {
        if (item.enabled && item.dest_ip.includes('localhost')) {
          label = item.remark
          url = item.dest_ip
          return
        }
      })
    }
    url.includes(location.host) && insertLabel(label);
    dragFunc("chrome-plugin-label");
  })
}

function addContent() {
  insertContent()
}

function insertContent() {
  const panel = document.createElement('div');
  panel.className = 'chrome-plugin-content';
  panel.innerHTML = `
    <h1>线上环境，谨慎操作!!!!!</h1>
	`;
  document.body.appendChild(panel)
}

function clearContent() {
  let dom = document.getElementsByClassName('chrome-plugin-content')[0]
  document.body.removeChild(dom)
}


function insertLabel(label) {
  const panel = document.createElement('div');
  panel.className = 'chrome-plugin-label';
  panel.innerHTML = `
  	<p>本地调试：${label}</p>
	`;
  document.body.appendChild(panel);
}

// 可拖动样式
function dragFunc(id) {
  var Drag = document.getElementsByClassName(id)[0];
  Drag.onmousedown = function (event) {
    var ev = event || window.event;
    event.stopPropagation();
    var disX = ev.clientX - Drag.offsetLeft;
    var disY = ev.clientY - Drag.offsetTop;
    document.onmousemove = function (event) {
      var ev = event || window.event;
      Drag.style.left = ev.clientX - disX + "px";
      Drag.style.top = ev.clientY - disY + "px";
      Drag.style.cursor = "move";
    };
  };
  Drag.onmouseup = function () {
    document.onmousemove = null;
    this.style.cursor = "default";
  };
};

