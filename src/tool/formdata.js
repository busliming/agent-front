
export default (data) => {
  var fd = new FormData();
  for(var i in data){
    fd.append(i,data[i])
  }
  return fd;
}