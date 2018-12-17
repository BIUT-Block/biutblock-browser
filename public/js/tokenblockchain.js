
/* global $ totalNumber */
$('#pagination').pagination({
  dataSource: '/tokenblockchain-pagination',
  locator: 'items',
  totalNumber: totalNumber,
  pageSize: 50,
  callback: function (blockchain) {
    $('#blockchain-table').html('')
    blockchain.forEach((block) => {
      $('#blockchain-table').append(`
        <tr>
          <td><a href="/tokenblockdetails?hash=${block.Hash}">${block.Number + 1}</a></td>
          <td><a href="/tokenblockdetails?hash=${block.Hash}">0x${block.Hash}</a></td>
          <td>${block.Transactions.length}</td>
          <td>0x${block.Beneficiary}</td>
          <td>${new Date(block.TimeStamp).toLocaleString()}</td>
        </tr>
      `)
    })
  }
})
