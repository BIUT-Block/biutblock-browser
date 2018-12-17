$(function() {
  contractList ()
  contractTable ()
})

// 合约列表数据展示
function contractList () {
 $("#address").html("TVgtfHh8ZgQYd9tZuPQwq9E5BkvYM7pz4m");
 $("#balance").html("99");
 $("#tradingNumber").html("1999");
 $("#creator").html("admin");
 $("#tradingNo").html("bb245e759a9e86223bca164f4487ecc71446650a7cfbd3cc7fdc93573ec1047b");
 $("#tradingTime").html("2018/11/6 18:00 UTC");
}

// 合约table
function contractTable () {

  // 接口请求的总条数
  $("#total").html("2")
}
