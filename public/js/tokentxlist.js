/* global $ totalNumber */
$('#pagination').pagination({
  dataSource: '/tokentxlist-pagination',
  locator: 'items',
  totalNumber: totalNumber,
  pageSize: 50,
  callback: function (Transactions) {
    $('#tx-table').html('')
    Transactions.forEach(tx => {
      $('#tx-table').append(`
      <tr>
        <td><a href="/tokentxdetails?hash=${tx.TxHash}">0x${tx.TxHash}</a></td>
        <td><a href="/tokenblockdetailsbynumber?number=${tx.BlockNumber}">${tx.BlockNumber}</a></td>
        <td><a href="/accountdetails?address=${tx.TxFrom}">0x${tx.TxFrom}</a></td>
        <td><a href="/accountdetails?address=${tx.TxTo}">0x${tx.TxTo}</a></td>
        <td>${tx.Value} SEC</td>
        <td>${tx.TimeStamp}</td>
        <td>${tx.TxReceiptStatus}</td>
      </tr>
      `)
    })
  }
})
