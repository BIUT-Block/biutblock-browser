/* global $ */
$(function () {
  const btn = document.querySelector('#copyBtn');
	btn.addEventListener('click', () => {
	    const input = document.querySelector('#address');
	    input.select();
	    if (document.execCommand('copy')) {
	        document.execCommand('copy');
					$("#copyBtn").text('Copied').addClass("copyActive")
	    }
	})
})
