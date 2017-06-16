const tool = {
  objConverter: (obj, keygroup) => {
    let ret = [];
    obj.datetime = [];
    const keysOfObj = keygroup || Object.keys(obj);
    const lengthOfKeys = keysOfObj.length;
    const lengthOfRet = obj[keysOfObj[0]].length;
    for (let i = 0; i < lengthOfRet; i++) {
      let singleTon = {};
      obj.datetime[i] = (new Date(obj.date[i]));
      for (let j = 0; j < lengthOfKeys; j++) {
        singleTon[keysOfObj[j]] = ((obj[keysOfObj[j]][i] === '--') ? '0.0' : obj[keysOfObj[j]][i]) || '0.0';
      }
      ret.push(singleTon);
    }
    return ret;
  },
  objSumGroups: (obj, key) => {
    let today = 999;
    let todayData = null;
    let isPreview = (new Date()) < (new Date(obj[0].date));
    if (isPreview) {
      today = 0;
    }
    for (let j = 0; j < obj.length; j++) {
      obj[j][key] = 0;
      if (obj[j].week === '今天') {
        todayData = Object.assign({}, obj[j]);
        todayData.type = 'real';
        today = j;
      }
      if (j >= today) {
        obj[j].type = 'forecast';
        obj[j][key] = obj[j].forecast * 1.0;
        if (obj[j].week !== '今天') {
          obj[j].real = undefined;
        }
      } else {
        obj[j].type = 'real';
        obj[j][key] = obj[j].real * 1.0;
        obj[j].forecast = undefined;
      }
    }
    return today;
  },
  domainHandle: (d) => {
    let max = d[1].toExponential(2);
    let maxScale = (max).split('e+');
    if (maxScale[0] < 2) {
      maxScale[0] = Math.ceil(maxScale[0] * 10);
      if (maxScale[0] % 3 !== 0) {
        maxScale[0] = 3 * Math.floor(maxScale[0] / 3) + 3;
      }
      maxScale[0] *= 0.1;
    } else {
      maxScale[0] = Math.ceil(maxScale[0]);
    }
    max = maxScale[0] * (Math.pow(10, maxScale[1]));
    return [0, max];
  },
  calTimeAxis: (n) => {
    let num = 'even';
    if (n < 8) {
      num = 'n';
    }
    if (n > 23) {
      if ((n) % 3 === 0) {
        num = '3n+1';
      } else {
        num = '4n+1';
      }
    }
    if (n > 50) {
      num = '5n';
    }
    if (n > 60) {
      num = '12n';
    }
    if (n > 100) {
      num = '16n';
    }
    if (n > 200) {
      num = '24n';
    }
    if (n > 300) {
      num = '50n';
    }
    return num;
  },
};
export default tool;
