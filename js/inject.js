
function checkViewer() {
	/** 
	setTimeout(function () {
		let script = document.createElement('script');
		script.type = 'text/javascript';
		script.innerHTML = 'document.body.setAttribute("_viewer",l)';
		document.head.appendChild(script);
		document.head.removeChild(script);
		window.__viewer = eval(document.body.getAttribute('_viewer').toString());
		console.log(JSON.stringify(document.body.getAttribute('_viewer')));
	}, 8000);
	**/
	window.postMessage({ "test": '你好！' }, '*');

}

// 通过postMessage调用content-script
function invokeContentScript(code) {
	window.postMessage({
		cmd: 'invoke',
		code: code
	}, '*');
}
// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(data) {
	window.postMessage({
		cmd: 'message',
		data: data
	}, '*');
}

function filterItem(e) {
	let val = document.getElementById('search').value;
	//alert((val.value));
	let lis = document.querySelectorAll('#container_of_li li');
	let len = lis.length;

	for (let i = 0; i < len; i++) {
		if (lis[i].innerText.indexOf(val) == -1) {
			lis[i].style.display = "none";
		} else {
			lis[i].style.display = "block";
			lis[i].style.cursor = "pointer";
		}
	}

}

// 通过DOM事件发送消息给content-script
(function () {
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('myCustomEvent', true, true);
	// 通过事件发送消息给content-script
	function sendMessageToContentScriptByEvent(data) {
		data = data || '你好，我是injected-script!';
		var hiddenDiv = document.getElementById('main');
		hiddenDiv.innerText = data
		hiddenDiv.dispatchEvent(customEvent);
	}
	window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;
	// 检测当前页面是否支持Bimface
	let counter = 1;
	let support = false;
	let sid = setInterval(() => {
		if (support || counter > 20) {
			clearInterval(sid);
			return;
		}
		if (window.Glodon) {
			support = true;
			window.viewer = viewer;
			console.log("support!");
			console.log(viewer.getDomElement());

			//console.info(viewer);
			//let obj = { a: 1, b: 3 };
			//window.obj = obj;
			// 此方法不能传递viewer，报错，不允许Clone
			//window.postMessage({ "viewer": viewer }, '*');
		} else {
			console.error("Not support!");
		}
		counter++;
	}, 500);

	checkViewer();

})();
