module.exports = function (self) {
	self.addEventListener('message',function (ev) {
		var url = ev.data;
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = function () {
			self.postMessage('success');
			self.close();
		};
		xhr.onerror = function () {
			self.postMessage('error');
			self.close();
		};
		xhr.open('GET', url, true);
		xhr.send();
	});
};