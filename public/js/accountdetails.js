/* global $ */
$(function () {
  $("#copyBtn").click(function() {
    var ssrsss = $("#address").text();//获取文本
    var flag = copyText(ssrsss); //传递文本 
    $("#address").offset().top //自动滚回顶部
    if (flag) {
      $('#copyBtn').html('Copy success').addClass('copyActive')
      setTimeout(() => {
        $('#copyBtn').html('Copy Address').removeClass('copyActive')
      }, 3000)
    } else {
      $('#copyBtn').html('Copy failure').addClass('copyActive')
      setTimeout(() => {
        $('#copyBtn').html('Copy Address').removeClass('copyActive')
      }, 3000)
    }
  })
})

function copyText (text) {
  let textarea = document.createElement('input') // 创建input对象
  let currentFocus = document.activeElement // 当前获得焦点的元素
  document.body.appendChild(textarea) // 添加元素
  textarea.value = text
  textarea.focus()
  if (textarea.setSelectionRange) {
    textarea.setSelectionRange(0, textarea.value.length) // 获取光标起始位置到结束位置
  } else {
    textarea.select()
  }
  let flag
  try {
    flag = document.execCommand('copy') // 执行复制
  } catch (eo) {
    flag = false
  }
  document.body.removeChild(textarea) // 删除元素
  currentFocus.focus()
  return flag
}
