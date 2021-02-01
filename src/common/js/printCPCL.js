export function CreatCPCLPage(width, height, printNum, rotation = 0) {
  var strCmd = '! 0 200 200 ' + height + ' ' + printNum + '\n'
  strCmd += 'PAGE-WIDTH ' + width + '\n'
  if (rotation === 1) {
    strCmd += 'ZPROTATE90\n'
  } else if (rotation === 2) {
    strCmd += 'ZPROTATE180\n'
  } else if (rotation === 3) {
    strCmd += 'ZPROTATE270\n'
  } else {
    strCmd += 'ZPROTATE0\n'
  }
  return strCmd
}
export function addCPCLText(x, y, fontName, fontSize, rotation, content) {
    var strCmd = ''
    if (rotation === 1) {
        strCmd += 'T90 '
    }
    if (rotation === 2) {
        strCmd += 'T180 '
    }
    if (rotation === 3) {
        strCmd += 'T270 '
    } else {
        strCmd += 'T '
    }
    strCmd += fontName + ' ' + fontSize + ' ' + x + ' ' + y + ' ' + content + '\n'
    return strCmd
};
export function addCPCLBarCode(x, y, codeType, h, rotation, narrow, wide, content) {
    var strCmd = ''
    if (rotation === 0) { strCmd += 'B ' } else { strCmd += 'VB ' }
    strCmd += codeType + ' ' + narrow + ' ' + wide + ' ' + h + ' ' + x + ' ' + y + ' ' + content + '\n'
    return strCmd
};
export function addCPCLQRCode(x, y, level, ver, scale, content) {
    var strCmd = 'B QR ' + x + ' ' + y + ' M ' + ver + ' U ' + scale + '\n' + level + 'A,' + content + '\n'
    strCmd += 'ENDQR\n'
    return strCmd
};

export function addCPCLSETMAG(scaleX, scaleY) {
    var strCmd = 'SETMAG ' + scaleX + ' ' + scaleY + '\n'
    return strCmd
};

export function addCPCLLocation(set) {
    var strCmd = ''
    if (set === 1) {
        strCmd += 'RIGHT\n'
    } else if (set === 2) {
        strCmd += 'CENTER\n'
    } else {
        strCmd += 'LEFT\n'
    }
    return strCmd
};

export function addCPCLPrint() {
    var strCmd = 'PRINT\n'
    return strCmd
};
export default {
    CreatCPCLPage,
    addCPCLText,
    addCPCLBarCode,
    addCPCLQRCode,
    addCPCLSETMAG,
    addCPCLLocation,
    addCPCLPrint
}
