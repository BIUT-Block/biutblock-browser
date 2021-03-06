/* global $ */
$(document).ready(() => {
  $.get('https://api.github.com/repositories/158717489/releases', (res) => {
    console.log(res[0].published_at)
    if (res) {
      if (res[0].assets[0].name.substring(res[0].assets[0].name.length - 3, res[0].assets[0].name.length) === 'exe') {
        $('#filename-win').text(res[0].assets[0].name)
        $('#updated-win').text(new Date(res[0].assets[0].updated_at).toLocaleString())
        $('#download-win').attr('href', res[0].assets[0].browser_download_url)
        $('#filename-mac').text(res[0].assets[1].name)
        $('#updated-mac').text(new Date(res[0].assets[1].updated_at).toLocaleString())
        $('#download-mac').attr('href', res[0].assets[1].browser_download_url)
        $('#wallet-name').text(res[0].assets[0].name)
        $('#wallet-time').text(new Date(res[0].published_at).toLocaleString())
      } else {
        $('#filename-win').text(res[0].assets[1].name)
        $('#wallet-name').text(res[0].assets[1].name)
        $('#wallet-time').text(new Date(res[0].published_at).toLocaleString())
        $('#updated-win').text(new Date(res[0].assets[1].updated_at).toLocaleString())
        $('#download-win').attr('href', res[0].assets[1].browser_download_url)
        $('#filename-mac').text(res[0].assets[0].name)
        $('#updated-mac').text(new Date(res[0].assets[0].updated_at).toLocaleString())
        $('#download-mac').attr('href', res[0].assets[0].browser_download_url)
      }
    }
  })
})
