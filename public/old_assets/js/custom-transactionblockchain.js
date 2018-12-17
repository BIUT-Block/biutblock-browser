/* global $, io */
$(document).ready((e) => {
  const socket = io.connect(window.location.protocol + '//' + window.location.host + '/transactionblockchain')
  let ID = '1897984547'
  socket.emit('Request', ID)
  setInterval(() => {
    socket.emit('Request', ID)
  }, 5000)
  socket.on('TransactionBlockchain', (data) => {
    let TransactionBlockchain = data.blockchain
    $('#transaction-block-chain-list').html('')
    $('#transaction-trans-list').html('')
    let transactions = []
    console.log(data.blockchain)
    TransactionBlockchain.forEach((_transaction, index) => {
      let transaction = _transaction
      if (typeof _transaction !== 'object') {
        transaction = JSON.parse(_transaction)
      }
      transactions = transactions.concat(transaction.Transactions)
      if (index < 20) {
        $('#transaction-block-chain-list').append(`
            <tr>
              <td class="f-500">${transaction.Number}</td>
              <td><p style="color: #03A9F4">Block Hash: 0x${transaction.Hash}</p><p>Beneficiary: 0x${transaction.Beneficiary}</p></td>
              <td class="f-500">${transaction.Transactions.length}</td>
              <td class="f-500"><a href="/transactionblock?id=${ID}&hash=${transaction.Hash}"><i class="zmdi zmdi-zoom-in"></i></a></td>
            </tr>
          `)
      }
    })
    $('#transaction-block-number').text(data.BlockSum)
    $('#transaction-transactions-number').text(data.TransactionsSum)

    transactions.forEach((_trans, index) => {
      let trans = _trans
      if (typeof _trans !== 'object') {
        trans = JSON.parse(_trans)
      }
      if (index < 100) {
        $('#transaction-trans-list').append(`
          <tr>
            <td class="f-500" style="font-weight: normal !important;"><p style="color: #8BC34A">TxHash: 0x${trans.TxHash}</p><p>Seller Address: 0x${trans.SellerAddress}</p><p>Buyer Address: 0x${trans.BuyerAddress}</p></td>
            <td>${trans.ProductInfo.Name}</td>
            <td style="text-transform:capitalize;">${trans.TxReceiptStatus}</td>
            <td class="f-500"><a href="/transactiontx?id=${ID}&hash=${trans.TxHash}"><i class="zmdi zmdi-zoom-in"></i></a></td>
          </tr>
          `)
      }
    })
  })
})
