const supported = (() => {
  if (typeof self === 'undefined') {
    return false;
  }
  // ToDo: Remove this check once Permissions Policy integration
  // has happened, tracked in
  // https://github.com/WICG/file-system-access/issues/245.
  if ('top' in self && self !== top) {
    try {
      // This will succeed on same-origin iframes,
      // but fail on cross-origin iframes.
      top.location + '';
    } catch {
      return false;
    }
  } else if ('showOpenFilePicker' in self) {
    return 'showOpenFilePicker';
  }
  return false;
})();

function ADown(excelBlob: Blob, name: string, accept: string, cb:any ) {
    try {
       const filename: string = name + accept;
        if ("msSaveOrOpenBlob" in window.navigator) {
            window.navigator.msSaveOrOpenBlob(excelBlob, filename);
        } else {
            const oA = document.createElement("a");
            oA.href = URL.createObjectURL(excelBlob);
            oA.download = filename;
            oA.addEventListener('click', () => {
              // `setTimeout()` due to
              // https://github.com/LLK/scratch-gui/issues/1783#issuecomment-426286393
              setTimeout(() => URL.revokeObjectURL(oA.href), 30 * 1000);
            });
            oA.click();
        }
        if(cb) cb(null, "下载成功");
    } catch(e) {
        cb(e);
    }
}

function saveFilePicker(excelBlob: Blob, name: string, accept: string, description: string = 'file', cb:any ) {
  const opts = {
    suggestedName: name,
    types: [{
      description,
      accept: {[excelBlob.type]: [accept]},
    }],
  };
  window['showSaveFilePicker'](opts)
    .then((handle: any) => handle.createWritable())
    .then((writable: any) => {
      writable.write(excelBlob)
        .then(() => {
            console.log('[writable.write finish]');
            writable.close().then(() => {
              console.log('[writable.close finish]');
              if(cb) cb(null, "下载成功");
            }).catch((e:any) => {
              if (cb) cb(e)
            })
        }).catch((e:any) => {
          if (cb) cb(e)
        });
    }).catch((e:any) => {
      if (cb) cb(e)
    })
}

export default function saveFile(excelBlob: Blob, name: string, accept: string, cb:any = () => {}) {
  if (supported) {
    saveFilePicker(excelBlob, name, accept, 'file', cb)
  } else {
    ADown(excelBlob, name, accept,  cb)
  }
}
