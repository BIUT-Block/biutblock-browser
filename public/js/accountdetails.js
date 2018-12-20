/* global $ */
$(function () {
  $('#copyBtn').on('click', function () {
    
    let text = document.getElementById('address')
    if (document.body.createTextRange) {
      let range = document.body.createTextRange()
      range.moveToElementText(text)
      range.select()
    } else if (window.getSelection) {
      let selection = window.getSelection()
      let range = document.createRange()
      range.selectNodeContents(text)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    $('#copyBtn').html("Copied").addClass('copyActive');
  })
})
