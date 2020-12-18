const InputDataDecoder = require("ethereum-input-data-decoder");
const decoder = new InputDataDecoder(`${__dirname}/abi.json`);

const data = require("./data.json")[1];
const result = decoder.decodeData(data);
// console.log(data);

block_info = result.inputs[0][0];
// console.log(block_info);
txIndexs = block_info[6];
block_size = block_info[2];
block_data = block_info[3].substr(2);
block_data_bf = Buffer.from(block_data, "hex");
// console.log(block_data_bf.length);
for (let i = 0; i < block_size; i++) {
  //   console.log(txId);
  //   tx_data = Buffer.alloc(64);
  const size1 = 29;
  const size2 = 39;
  tx_offset_1 = 98 + i * size1;
  tx_offset_2 = 98 + block_size * size1 + i * size2;

  //   console.log(tx_offset_1);
  //   console.log(tx_offset_2);
  tx_data_1 = block_data_bf.slice(tx_offset_1, tx_offset_1 + 29);
  tx_data_2 = block_data_bf.slice(tx_offset_2, tx_offset_2 + 39);
  tx_data = Buffer.concat([tx_data_1, tx_data_2]);

  //   console.log(tx_data_2.toString("hex"));
  //   console.log(tx_data.length);
  //   console.log(i);
  type = tx_data.readUInt8(0);
  if (type == 3) {
    // console.log(tx_data_1.toString("hex"));
    // console.log(tx_data.toString("hex"));
    transfer = {};
    offset = 1;
    transfer_type = tx_data.readUInt8(offset);
    offset += 1;
    transfer.accountFromID = tx_data.readUInt32BE(offset);
    // console.log(parseInt(tx_data.toString('hex').slice(offset * 2, offset * 2 + 8), 16));
    offset += 4;
    transfer.accountToID = tx_data.readUInt32BE(offset);
    offset += 4;
    transfer.tokenID = tx_data.readUInt16BE(offset);
    offset += 2;
    // 我这里直接把3 bytes转成int了，实际应该转成float
    transfer.amount = tx_data.readUIntBE(offset, 3);
    offset += 3;
    transfer.feeTokenID = tx_data.readUInt16BE(offset);
    offset += 2;
    transfer.fee = tx_data.readUInt16BE(offset);
    offset += 2;
    transfer.storageID = tx_data.readUInt32BE(offset);
    offset += 4;
    transfer.to = "0x" + tx_data.slice(offset, offset + 20).toString("hex");
    offset += 20;
    transfer.from = "0x" + tx_data.slice(offset, offset + 20).toString("hex");
    offset += 20;

    // console.log(offset);
    console.log(i);
    console.log(transfer);
  }
}

function reverse(s) {
  return s.split("").reverse().join("");
}
// tokenID对应的币种文档在：https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/deployment_mainnet_v3.6.md 最下面
