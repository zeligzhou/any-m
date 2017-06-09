const tool = {
  objConverter:(obj, keygroup)=>{
    let ret = [];
    const keysOfObj = keygroup || Object.keys(obj);
    const lengthOfKeys = keysOfObj.length;
    const lengthOfRet = obj[keysOfObj[0]].length;
    for(let i=0;i<lengthOfRet;i++){
      let singleTon = {};
      for(let j=0;j<lengthOfKeys;j++){
        singleTon[keysOfObj[j]] = ((obj[keysOfObj[j]][i] === "--")?0:obj[keysOfObj[j]][i]) || 0;
      }
      ret.push(singleTon);
    }
    return ret;
  },
  objSumGroups:(obj,key)=>{
    let today = 999;
    let todayData = null;
    for (let j = 0; j < obj.length; j++) {
        obj[j][key] = 0;

        //for (let i = 0; i < groups.length; i++) {
          if(j > today){
            obj[j]['type'] = "forecast";
            obj[j][key] = obj[j]['forecast']*1.0;
          }else{
            obj[j]['type'] = "real";
            obj[j][key] = obj[j]['real']*1.0
          }
          if(obj[j]['week'] === "今天"){
            todayData = Object.assign({},obj[j]);
            todayData.type = "forecast";
            //todayData.total = 0;
            today = j;
          }
        //}
      }
      obj.push(todayData);
  }
}
export default tool
