const tool = {
  objConverter:(obj, keygroup)=>{
    let ret = [];
    const keysOfObj = keygroup || Object.keys(obj);
    const lengthOfKeys = keysOfObj.length;
    const lengthOfRet = obj[keysOfObj[0]].length;
    for(let i=0;i<lengthOfRet;i++){
      let singleTon = {};
      for(let j=0;j<lengthOfKeys;j++){
        singleTon[keysOfObj[j]] = obj[keysOfObj[j]][i] || 0;
      }
      ret.push(singleTon);
    }
    return ret;
  }
}
export default tool
