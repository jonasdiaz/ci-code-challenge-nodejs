const {Worker, isMainThread, workerData, parentPort} = require('worker_threads')
const SHA256 = require('crypto-js/sha256')

if (isMainThread){
  module.exports = (data) => new Promise(async (resolve, reject) => {
    const worker = new Worker(__filename, {workerData: data})
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  })
}else{
  let hash = workerData;
  const difficulty = 5;
  let nonce = 0;

  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    nonce++
    hash = SHA256(hash + nonce).toString()
  }
  console.log(`Done mining hash: ${workerData}`)
  parentPort.postMessage(workerData);
  return hash
}