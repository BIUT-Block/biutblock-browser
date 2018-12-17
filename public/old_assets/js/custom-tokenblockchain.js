/* global $, io */
$(document).ready((e) => {
  const socket = io.connect(window.location.protocol + '//' + window.location.host + '/tokenblockchain')
  socket.on('TokenBlockchain', (data) => {
    let TokenBlockchain = data.blockchain
    $('#token-block-chain-list').html('')
    $('#token-trans-list').html('')
    let transactions = []
    TokenBlockchain.forEach((_token, index) => {
      let token = _token
      if (typeof _token !== 'object') {
        token = JSON.parse(_token)
      }
      transactions = transactions.concat(token.Transactions)
      if (index < 20) {
        $('#token-block-chain-list').append(`
          <tr>
            <td class="f-500">${token.Number}</td>
            <td><p style="color: #03A9F4">Block Hash: 0x${token.Hash}</p><p>Beneficiary: 0x${token.Beneficiary}</p></td>
            <td class="f-500">${token.Transactions.length}</td>
            <td class="f-500"><a href="/tokenblock?hash=${token.Hash}"><i class="zmdi zmdi-zoom-in"></i></a></td>
          </tr>
        `)
      }
    })
    $('#token-block-number').text(data.BlockSum)
    $('#token-transactions-number').text(data.TransactionsSum)

    transactions.forEach((_trans, index) => {
      let trans = _trans
      if (typeof _trans !== 'object') {
        trans = JSON.parse(_trans)
      }
      if (index < 100) {
        $('#token-trans-list').append(`
        <tr>
          <td class="f-500" style="font-weight: normal !important;"><p style="color: #8BC34A">TxHash: 0x${trans.TxHash}</p><p>From: 0x${trans.TxFrom}</p><p>To: 0x${trans.TxTo}</p></td>
          <td>${trans.Value} SEC</td>
          <td style="text-transform:capitalize;">${trans.TxReceiptStatus}</td>
          <td class="f-500"><a href="/tokentx?hash=${trans.TxHash}"><i class="zmdi zmdi-zoom-in"></i></a></td>
        </tr>
        `)
      }
    })
  })
})
