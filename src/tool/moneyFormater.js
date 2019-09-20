function format(money){
  let _money = Number.parseFloat(money);
  if((!Number.isFinite(_money))&&Number.isNaN(_money)){ //是否为合法的数字
    // console.log('money not Finite or parse money isNaN:')
    // console.log(money)
    return money
  }
  
  if(_money<10000){
    return _money.toFixed(2)
  }else{
    let _moneyW = _money/10000;
    return _moneyW.toFixed(2) + '万'
  }
}

export {
  format as moneyFormater
}