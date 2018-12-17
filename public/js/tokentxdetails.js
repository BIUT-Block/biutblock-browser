/* global $ */
$(function () {
  tradingList()
})

// 交易详情列表数据展示
function tradingList () {
  $('#hashValues').html('368b6e159db7ca2ec3849a2dfcc0bac1dcea723589c083f6f8c71608cd9f5a67')
  $('#state').html('Successd')
  $('#heightBlock').html('1226')
  $('#time').html('2018-11-14 10:37 UTC')
  $('#sender').html('0x471268beda3a110e4f9a30ad998badfdeab027d2')
  $('#receiving').html('0x471268beda3a110e4f9a30ad998badfdeab027d2')
  $('#valueOf').html('0.0005 SEC')
  $('#gasUsed').html('8116')
  $('#gasLimit').html('84400')
  $('#price').html('Test Token cases')
  $('#version').html('0.1.3')
  $('#txFee').html('0.711')
  $('#inputData').html('Test Token Transaction')
}
