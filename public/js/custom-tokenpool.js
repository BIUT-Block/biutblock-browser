/* global $, io */
$(document).ready((e) => {
  const socket = io.connect(window.location.protocol + '//' + window.location.host + '/tokenpool')

  socket.on('TokenPool', (data) => {
    $('#token-pool-list').html('')
    data.Transactions.forEach(_trans => {
      let trans = _trans
      if (typeof _trans !== 'object') {
        trans = JSON.parse(_trans)
      }
      $('#token-pool-list').append(`
      <tr>
        <td class="f-500" style="font-weight: normal !important;"><p style="color: #8BC34A">TxHash: 0x${trans.TxHash}</p><p>From: 0x${trans.TxFrom}</p><p>To: 0x${trans.TxTo}</p></td>
        <td>${trans.Value} SEC</td>
        <td style="text-transform:capitalize;">${trans.TxReceiptStatus}</td>
        <td class="f-500"><a href="/tokenpooltx?hash=${trans.TxHash}"><i class="zmdi zmdi-zoom-in"></i></a></td>
      </tr>
      `)
    })
    $('#token-poll-hash-list').html('')
    data.HashArray.forEach(hash => {
      $('#token-poll-hash-list').append(`
      <tr>
        <td class="f-500" style="font-weight: normal !important;"><p style="color: #8BC34A">TxHash: 0x${hash}</p></td>
      </tr>
      `)
    })
  })
})
