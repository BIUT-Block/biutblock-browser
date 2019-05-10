
/* global $ totalNumber TimeDiff */
$('#pagination').pagination({
  dataSource: '/sen/tokenblockchain-pagination',
  locator: 'items',
  totalNumber: totalNumber,
  pageSize: 25,
  callback: function (blockchain) {
    $('#blockchain-table').html('')
    blockchain.forEach((block) => {
      $('#blockchain-table').append(`
        <tr>
          <td><a href="/sen/tokenblockdetails?hash=${block.Hash}">${block.Number}</a></td>
          <td>${TimeDiff(new Date(block.TimeStamp), new Date())}</a></td>
          <td>${block.Transactions.filter(tx => { return tx.TxFrom.substring(0, 4) !== '0000' && tx.TxTo.substring(0, 4) !== '0000' }).length}</td>
          <td><a href="/sen/accountdetails?address=${block.Beneficiary}">0x${block.Beneficiary}</a></td>
          <td>${JSON.stringify(block).length}</td>
        </tr>
      `)
    })
  }
})
