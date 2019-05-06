/* global $ io TimeDiff */
let secTxSum = 0
let senTxSum = 0
$(document).ready(() => {
  const socket = io.connect(window.location.protocol + '//' + window.location.host + '/home')
  let currenttpsBuffer = []
  let transactionsBuffer = []
  socket.on('TokenBlockchain', (data) => {
    secTxSum = data.TransactionsSum
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
      if (index < 50 && trans.TxFrom.substring(0, 4) !== '0000') {
        tradingList(trans)
      }
    })
    indexList({
      onlineNode: data.Nodes.length,
      currentHeight: data.BlockSum - 1,
      accountNumber: data.accountNumber,
      current: data.TPS,
      peak: 318,
      price: data.price + ' ETH'
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
  socket.on('SEN_TokenBlockchain', (data) => {
    senTxSum = data.TransactionsSum
    let TokenBlockchain = data.blockchain
    $('#sen-token-block-chain-list').html('')
    $('#sen-token-trans-list').html('')
    let transactions = []
    TokenBlockchain.forEach((_token, index) => {
      let token = _token
      if (typeof _token !== 'object') {
        token = JSON.parse(_token)
      }
      transactions = transactions.concat(token.Transactions)
      if (index < 20) {
        senBlockList(token)
      }
    })

    transactions.forEach((_trans, index) => {
      let trans = _trans
      if (typeof _trans !== 'object') {
        trans = JSON.parse(_trans)
      }
      if (index < 50 && trans.TxFrom.substring(0, 4) !== '0000') {
        senTradingList(trans)
      }
    })
  })
})

// 节点列表数据
function indexList (data) {
  $('#onlineNode').html(data.onlineNode)
  $('#currentHeight').html(data.currentHeight)
  $('#accountNumber').html(data.accountNumber)
  $('#totalTransactions').html(`${secTxSum} | ${senTxSum} `)
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
            <span class="inboxTit" style="margin-left:50px;">
              Transactions: <span class="inboxTxt">${token.Transactions.length}</span>
            </span>
          </div>
          <span class="inboxTit">
            Time: ${timeDiff}
          </span>
        </div>
        <div class="inbox-item-text m-t-5">
          Mined by: <a href="/accountdetails?address=${token.Beneficiary}">0x${token.Beneficiary}</a>
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
        <span>
          <span class="inboxTxt">${trans.TxReceiptStatus}</span>
        </span>
      </div>
      <div class="inbox-item-text m-t-5 inboxFlex">
        <div  class="inboxTit">
          From: <a href="/accountdetails?address=${trans.TxFrom}">0x${trans.TxFrom.substring(0, 16)}...</a>
          <span style="margin-left: 30px;">
            To: <a href="/accountdetails?address=${trans.TxTo}">0x${trans.TxTo.substring(0, 16)}...</a>
          </span>
        </div>
      </div>
      <div class="inbox-item-text m-t-5 inboxTit">
        <span class="inboxTxt"> ${ this.getPointNum(trans.Value, 8)} BIUT</span>
      </div>
    </li>
  </ul>
  `)
}

// 区块列表 table
function senBlockList (token) {
  let timeDiff = TimeDiff(new Date(token.TimeStamp), new Date())
  $('#sen-token-block-chain-list').append(`
  <ul class="inbox-item">
      <li class="itemList" style="margin-top:13px;padding-bottom: 13px;">
        <div class="inbox-item-text inboxFlex">
          <div class="inboxTit">
            Height: <a href="/sen/tokenblockdetailsbynumber?number=${token.Number}">${token.Number}</a>
            <span class="inboxTit" style="margin-left:50px;">
              Transactions: <span class="inboxTxt">${token.Transactions.length}</span>
            </span>
          </div>
          <span class="inboxTit">
            Time: ${timeDiff}
          </span>
        </div>
        <div class="inbox-item-text m-t-5">
          Mined by: <a href="/sen/accountdetails?address=${token.Beneficiary}">0x${token.Beneficiary}</a>
        </div>
        <div class="inbox-item-text m-t-5 inboxTit">
          <span class="inboxTxt">
            Block Reward: ${token.Transactions[0] ? this.getPointNum(token.Transactions[0].Value, 8) : 0} SEN
          </span>
        </div>
      </li>
    </ul>
  `)
}

// 交易列表 table
function senTradingList (trans) {
  $('#sen-token-trans-list').append(`
  <ul class="inbox-item">
    <li class="itemList" style="margin-top:13px;padding-bottom: 13px;">
      <div class="inbox-item-text inboxFlex">
        <div class="inboxTit">
          TxHash: <a href="/sen/tokentxdetails?hash=${trans.TxHash}" class="inboxTxtB">0x${trans.TxHash.substring(0, 16)}...</a>
        </div>
        <span>
          <span class="inboxTxt">${trans.TxReceiptStatus}</span>
        </span>
      </div>
      <div class="inbox-item-text m-t-5 inboxFlex">
        <div  class="inboxTit">
          From: <a href="/sen/accountdetails?address=${trans.TxFrom}">0x${trans.TxFrom.substring(0, 16)}...</a>
          <span style="margin-left: 30px;">
            To: <a href="/sen/accountdetails?address=${trans.TxTo}">0x${trans.TxTo.substring(0, 16)}...</a>
          </span>
        </div>
      </div>
      <div class="inbox-item-text m-t-5 inboxTit">
        <span class="inboxTxt">${ this.getPointNum(trans.Value, 8) } SEN</span>
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

function getPointNum(num,n){  
  let str = String(num);
  let index = str.indexOf(".");
  let str1 = str.substring(0,index+n+1);
  str1 = Number(str1);
  return str1;
}