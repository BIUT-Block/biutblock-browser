/* global $ */
$(document).ready(() => {
  $.get('https://api.github.com/repositories/158717489/releases', (res) => {
    if (res) {
      $('#filename-win').text(res[0].assets[0].name)
      $('#updated-win').text(new Date(res[0].assets[0].updated_at).toLocaleString())
      $('#download-win').attr('href', res[0].assets[0].browser_download_url)
      $('#filename-mac').text(res[0].assets[1].name)
      $('#updated-mac').text(new Date(res[0].assets[1].updated_at).toLocaleString())
      $('#download-mac').attr('href', res[0].assets[1].browser_download_url)
    }
  })
})
