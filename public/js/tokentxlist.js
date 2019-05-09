/* global $ totalNumber TimeDiff */
$('#pagination').pagination({
  dataSource: '/tokentxlist-pagination',
  locator: 'items',
  totalNumber: totalNumber,
  pageSize: 25,
  callback: function (Transactions) {
    $('#tx-table').html('')
    Transactions.forEach(tx => {
      if (tx.TxFrom.substring(0, 4) !== '0000') {
        $('#tx-table').append(`
        <tr>
          <td><a href="/tokentxdetails?hash=${tx.TxHash}">0x${tx.TxHash.substring(0, 16)}...</a></td>
          <td><a href="/tokenblockdetailsbynumber?number=${tx.BlockNumber}">${tx.BlockNumber}</a></td>
          <td><a href="/accountdetails?address=${tx.TxFrom}">0x${tx.TxFrom.substring(0, 16)}...</a></td>
          <td><a href="/accountdetails?address=${tx.TxTo}">0x${tx.TxTo.substring(0, 16)}...</a></td>
          <td>${getPointNum(tx.Value, 8)} BIUT</td>
          <td>${TimeDiff(new Date(tx.TimeStamp), new Date())}</td>
          <td>${tx.TxReceiptStatus}</td>
        </tr>
        `)
      }
    })
  }
})

function getPointNum (num, n) {
  let str = String(num)
  let index = str.indexOf('.')
  let str1 = str.substring(0, index + n + 1)
  str1 = Number(str1)
  return str1
}
