/* global $ totalNumber TimeDiff */
$('#pagination').pagination({
  dataSource: '/tokentxlist-pagination',
  locator: 'items',
  totalNumber: totalNumber,
  pageSize: 50,
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
          <td>${tx.Value} SEC</td>
          <td>${TimeDiff(new Date(tx.TimeStamp), new Date())}</td>
          <td>${tx.TxReceiptStatus}</td>
        </tr>
        `)
      }
    })
  }
})
