/* global $ io TimeDiff */
$(document).ready(() => {
 
  const socket = io.connect(window.location.protocol + '//' + window.location.host + '/home')
  let currenttpsBuffer = []
  let transactionsBuffer = []
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
        blockList(token)
      }
    })

    transactions.forEach((_trans, index) => {
      let trans = _trans
      if (typeof _trans !== 'object') {
        trans = JSON.parse(_trans)
      }
      if (index < 50) {
        tradingList(trans)
      }
    })
    indexList({
      onlineNode: data.Nodes.length,
      currentHeight: data.BlockSum - 1,
      accountNumber: data.TransactionsSum,
      current: data.TPS,
      peak: 318,
      price: '0.056 SEC'
    })

    if (currenttpsBuffer.length < 11) {
      currenttpsBuffer.push(parseInt(data.TPS))
    } else {
      currenttpsBuffer.shift()
      currenttpsBuffer.push(parseInt(data.TPS))
    }
    tpssparkline(currenttpsBuffer)

    transactionsBuffer = TokenBlockchain.slice(0, 20).map(block => {
      if (typeof block !== 'object') {
        block = JSON.parse(block)
      }
      return block.Transactions.length
    })
    transactionssparkline(transactionsBuffer)
  })
})


// 节点列表数据
function indexList (data) {
  $('#onlineNode').html(data.onlineNode)
  $('#currentHeight').html(data.currentHeight)
  $('#accountNumber').html(data.accountNumber)
  $('#current').html(data.current)
  $('#peak').html(data.peak)
  $('#price').html(data.price)
}

// 区块列表 table
function blockList (token) {
  let timeDiff = TimeDiff(new Date(token.TimeStamp), new Date())
  $('#token-block-chain-list').append(`
  <ul class="inbox-item">
      <li class="itemList" style="margin-top:13px;padding-bottom: 13px;">
        <div class="inbox-item-text inboxFlex">
          <div class="inboxTit">
            Height: <a href="/tokenblockdetailsbynumber?number=${token.Number}">${token.Number}</a>
          </div>
          <span class="inboxTxtB inboxTxt">
            Rewards：${token.Transactions[0] ? token.Transactions[0].Value : 0} SEC
          </span>
        </div>
        <div class="inbox-item-text m-t-5 inboxFlex">
          <div class="inboxTit">
            Transactions: <span class="inboxTxt">${token.Transactions.length}</span>
          </div>
          <span class="inboxTit">
            Time: ${timeDiff}
          </span>
        </div>
        <div class="inbox-item-text m-t-5 inboxTit">
          Beneficiary: <a href="/accountdetails?address=${token.Beneficiary}">0x${token.Beneficiary}</a>
        </div>
      </li>
    </ul>
  `)
}

// 交易列表 table
function tradingList (trans) {
  $('#token-trans-list').append(`
  <ul class="inbox-item">
    <li class="itemList" style="margin-top:13px;padding-bottom: 13px;">
      <div class="inbox-item-text inboxFlex">
        <div class="inboxTit">
          TxHash: <a href="/tokentxdetails?hash=${trans.TxHash}" class="inboxTxtB">0x${trans.TxHash.substring(0, 16)}...</a>
        </div>
        <span style="font-weight: bold;">
          Value: <span class="inboxTxt">${trans.Value} SEC</span>
        </span>
      </div>
      <div class="inbox-item-text m-t-5 inboxFlex">
        <div  class="inboxTit">
          From: <a href="/accountdetails?address=${trans.TxFrom}">0x${trans.TxFrom.substring(0, 16)}...</a>
        </div>
        <span class="inboxTit">
          Status: <span class="inboxTxt">${trans.TxReceiptStatus}</span>
        </span>
      </div>
      <div class="inbox-item-text m-t-5 inboxTit">
        To: <a href="/accountdetails?address=${trans.TxTo}">0x${trans.TxTo}</a>
      </div>
    </li>
  </ul>
  `)
}

function tpssparkline (currenttpsBuffer) {
  $('#currenttps-sparkline').sparkline(currenttpsBuffer, {
    type: 'line',
    width: '100%',
    height: '300',
    chartRangeMax: 40,
    lineColor: '#00b19d',
    fillColor: 'rgba(0, 177, 157, 0.3)',
    highlightLineColor: 'rgba(0,0,0,.1)',
    highlightSpotColor: 'rgba(0,0,0,.2)'
  })
}

function transactionssparkline (transactionsBuffer) {
  $('#transactions-sparkline').sparkline(transactionsBuffer, {
    type: 'line',
    width: '100%',
    height: '300',
    chartRangeMax: 50,
    lineColor: '#3bafda',
    fillColor: 'rgba(59,175,218,0.3)',
    highlightLineColor: 'rgba(0,0,0,.1)',
    highlightSpotColor: 'rgba(0,0,0,.2)'
  })
}
