/* global $, io */
$(document).ready((e) => {
  const socket = io.connect(window.location.protocol + '//' + window.location.host + '/transactionpool')
  let ID = '1897984547'
  socket.emit('Request', ID)
  setInterval(() => {
    socket.emit('Request', ID)
  }, 5000)
  socket.on('TransactionPool', (data) => {
    console.log(data)
    $('#transaction-pool-list').html('')
    data.Transactions.forEach(_trans => {
      let trans = _trans
      if (typeof _trans !== 'object') {
        trans = JSON.parse(_trans)
      }
      $('#transaction-pool-list').append(`
        <tr>
          <td class="f-500" style="font-weight: normal !important;"><p style="color: #8BC34A">TxHash: 0x${trans.TxHash}</p><p>Seller Address: 0x${trans.SellerAddress}</p><p>Buyer Address: 0x${trans.BuyerAddress}</p></td>
          <td>${trans.ProductInfo.Name}</td>
          <td style="text-transform:capitalize;">${trans.TxReceiptStatus}</td>
          <td class="f-500"><a href="/transactionpooltx?id=${ID}&hash=${trans.TxHash}"><i class="zmdi zmdi-zoom-in"></i></a></td>
        </tr>
        `)
    })
    $('#transaction-poll-hash-list').html('')
    data.HashArray.forEach(hash => {
      $('#transaction-poll-hash-list').append(`
        <tr>
          <td class="f-500" style="font-weight: normal !important;"><p style="color: #8BC34A">TxHash: 0x${hash}</p></td>
        </tr>
        `)
    })
  })
})
