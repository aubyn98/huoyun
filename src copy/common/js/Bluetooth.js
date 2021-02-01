/**
 * 初始化蓝牙模块
 * @returns {Promise<boolean>} Promise-boolean
 */
function openBluetoothAdapter() {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.openBluetoothAdapter({
            success(e) {
                window.plus && window.plus.nativeUI.toast('蓝牙适配器打开成功!')
                resolve(true)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '蓝牙适配器打开失败!' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 获取本机蓝牙适配器状态
 * @returns {Promise<{discovering : boolean,available : boolean}>}
 *  discovering - Boolean类型，蓝牙适配器是否正在搜索设备； available - Boolean类型，蓝牙适配器是否可用
 */
function getBluetoothAdapterState() {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.getBluetoothAdapterState({
            success(e) {
                window.plus && window.plus.nativeUI.toast('获取本机蓝牙适配器状态成功!')
                resolve(e)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '获取本机蓝牙适配器状态失败!' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 关闭蓝牙模块
 * @returns {Promise<boolean>} Promise-boolean
 */
function closeBluetoothAdapter() {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.closeBluetoothAdapter({
            success(e) {
                window.plus && window.plus.nativeUI.toast('蓝牙适配器关闭成功!')
                resolve(true)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '蓝牙适配器关闭失败!' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 开始搜索附近的蓝牙设备
 * @returns {Promise<boolean>} Promise-boolean
 */
function startBluetoothDevicesDiscovery() {
    window.plus && window.plus.nativeUI.toast('开始搜索蓝牙设备!')
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.startBluetoothDevicesDiscovery({
            success(e) {
                window.plus && window.plus.nativeUI.toast('开始搜索成功!')
                resolve(true)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '开始搜索失败! ' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 停止搜索蓝牙设备
 * @returns {Promise<boolean>} Promise-boolean
 */
function stopBluetoothDevicesDiscovery() {
    window.plus && window.plus.nativeUI.toast('停止搜索蓝牙设备!')
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.stopBluetoothDevicesDiscovery({
            success(e) {
                window.plus && window.plus.nativeUI.toast('停止搜索成功!')
                resolve(true)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '停止搜索失败! ' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 获取已搜索到的蓝牙设备
 * @returns { Promise<Array< { name : string, deviceId : string, RSSI : number, advertisData : ArrayBuffer,advertisServiceUUIDs : Array<String>, localName : string, serviceData : JSON } > > }
 * { devices : [ { name : string, deviceId : string, RSSI : number, advertisData : ArrayBuffer,
 * advertisServiceUUIDs : Array<String>, localName : string, serviceData : JSON } ] }
 */
function getBluetoothDevices() {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.getBluetoothDevices({
            success(e) {
                window.plus && window.plus.nativeUI.toast('获取设备列表成功!')
                resolve(e.devices)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '获取设备列表失败!' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 连接低功耗蓝牙设备
 * @param {string} deviceId 设备ID
 * @returns {Promise<boolean>} Promise-boolean
 */
function createBLEConnection(deviceId) {
    return new Promise((resolve, reject) => {
        if (!deviceId) {
            window.plus && window.plus.nativeUI.toast('未选择设备!')
            return reject(new Error('未选择设备!'))
        }
        window.plus && window.plus.nativeUI.toast('连接设备: ' + deviceId)
        window.plus && window.plus.bluetooth.createBLEConnection({
            deviceId,
            success(e) {
                window.plus && window.plus.nativeUI.toast('连接成功!')
                resolve(true)
            },
            fail(e) {
                if (e.code === -1) {
                    window.plus && window.plus.nativeUI.toast('设备已连接！')
                } else {
                    window.plus && window.plus.nativeUI.toast('连接失败! ' + JSON.stringify(e, null, 4))
                }
                reject(e)
            }
        })
    })
}
/**
 * 断开与低功耗蓝牙设备的连接
 * @param {string} deviceId 设备ID
 * @returns {Promise<boolean>} Promise-boolean
 */
function closeBLEConnection(deviceId) {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.closeBLEConnection({
            deviceId,
            success() {
                window.plus && window.plus.nativeUI.toast('断开连接成功！')
                resolve(true)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '断开连接失败！' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 获取蓝牙设备的所有服务
 * @param {string} deviceId 设备ID
 * @returns {Promise< Array< { uuid : string, isPrimary : boolean } > >} [ { uuid : string, isPrimary : boolean } ]
 */
function getBLEDeviceServices(deviceId) {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.getBLEDeviceServices({
            deviceId,
            success(e) {
                resolve(e.services)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '获取蓝牙设备服务失败！' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 获取蓝牙设备指定服务中所有特征值
 * @param {string} deviceId  设备ID
 * @param {string} serviceId 服务ID
 * @returns {Promise< Array< { uuid : string, properties : { read : boolean, write : boolean, notify : boolean, indicate : boolean } } > >}
 * [ { uuid : string, properties : { read : boolean, write : boolean, notify : boolean, indicate : boolean } } ]
 */
function getBLEDeviceCharacteristics(deviceId, serviceId) {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.getBLEDeviceCharacteristics({
            deviceId,
            serviceId,
            success(e) {
                resolve(e.characteristics)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '获取蓝牙设备指定服务特征值失败！' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 获取蓝牙设备  设备ID 服务ID 特征ID
 * @param {string} deviceId  设备ID
 * @returns { Promise< { deviceId:string, serviceId:string, writeId:string, readId:string, error?:any } > }
 * deviceId 设备ID; serviceId 服务ID; writeId 写入服务特征ID；readId 读取服务特征ID； error 错误信息
 */
async function getAllId(deviceId) {
    try {
        const services = await getBLEDeviceServices(deviceId)
        let write = false
                let notify = false
                let indicate = false
                let finished = false
                let readId
                let writeId
                let serviceId
        for (const service of services) {
            const characteristics = await getBLEDeviceCharacteristics(
                deviceId,
                service.uuid
            )
            for (const characteristic of characteristics) {
                if (!notify) {
                    notify = characteristic.properties.notify
                    if (notify) readId = characteristic.uuid
                }
                if (!indicate) {
                    indicate = characteristic.properties.indicate
                    if (indicate) readId = characteristic.uuid
                }
                if (!write) {
                    write = characteristic.properties.write
                    writeId = characteristic.uuid
                }
                if ((notify || indicate) && write) {
                    serviceId = service.uuid
                    finished = true
                    break
                }
            }
            if (finished) {
                break
            }
        }
        return {
            deviceId,
            serviceId,
            writeId,
            readId
        }
    } catch (e) {
        window.plus && window.plus.nativeUI.toast(
            '获取蓝牙设备  设备ID 服务ID 特征ID 失败！' + JSON.stringify(e, null, 4)
        )
        return {
            error: e
        }
    }
}

/**
 * 根据uuid获取处于已连接的设备
 * @param {string} services  要获取设备的uuid列表
 * @returns { Promise< Array< { name : string, deviceId : string, RSSI : number, advertisData : ArrayBuffer, advertisServiceUUIDs : Array<String>, localName : string, serviceData : JSON } > > }
 * devices - Array<BluetoothDeviceInfo>，设备列表信息
 */
function getConnectedBluetoothDevices(services) {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.getConnectedBluetoothDevices({
            services,
            success(e) {
                resolve(e.devices)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '获取处于已连接的设备失败！' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 获取蓝牙设备的信号强度
 * @param {string} services  要获取设备的uuid列表
 * @returns { Promise<number> } RSSI - Number类型，蓝牙设备的信号强度。
 */
function getBLEDeviceRSSI(deviceId) {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.getBLEDeviceRSSI({
            deviceId,
            success(e) {
                resolve(e.RSSI)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '获取信号强度失败！' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 读取低功耗蓝牙设备指定特征值的二进制数据值
 * @param { { deviceId:string,serviceId:string,characteristicId:string } } options
 * deviceId         设备ID；
 * serviceId        服务ID；
 * characteristicId 特征ID；
 * @returns {Promise<ArrayBuffer>}      Promise-ArrayBuffer
 */
function readBLECharacteristicValue(options) {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.readBLECharacteristicValue({
            ...options,
            success(e) {
                resolve(e)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '读取低功耗蓝牙设备指定特征值失败！' + JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 向低功耗蓝牙设备指定特征值写入二进制数据
 * @param { { deviceId:string,serviceId:string,characteristicId:string,value:ArrayBuffer } } options
 * deviceId         设备ID；
 * serviceId        服务ID；
 * characteristicId 特征ID；
 * value       要写入的数据；
 * @returns {Promise<boolean>}      Promise-boolean
 */
function writeBLECharacteristicValue(options) {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.writeBLECharacteristicValue({
            ...options,
            success() {
                resolve(true)
            },
            fail(e) {
                window.plus && window.plus.nativeUI.toast(
                    '向低功耗蓝牙设备指定特征值写入二进制数据失败！' +
                    JSON.stringify(e, null, 4)
                )
                reject(e)
            }
        })
    })
}

/**
 * 向蓝牙设备发送数据
 * @param {ArrayBuffer} buffer   发送的数据
 * @param {string} deviceId      设备ID
 * @returns {Promise<boolean>}      Promise-boolean
 */
async function sendData(buffer, deviceId) {
    try {
        const {
            serviceId,
            writeId: characteristicId,
            error
        } = await getAllId(deviceId)
        if (error) {
            return false
        }
        const flag = await writeBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId,
            value: buffer
        })
        return flag
    } catch (e) {
        window.plus && window.plus.nativeUI.toast(
            '向蓝牙设备发送数据失败！' + JSON.stringify(e, null, 4)
        )
        return false
    }
}

/**
 * 递归分包向蓝牙设备发送数据
 * @param {{value:ArrayBuffer,chunkedLength:number,deviceId:string,success:()=>void}} options
 * deviceId 设备ID；
 * serviceId 设备服务ID
 * characteristicId 设备服务特征ID
 * value 要分包发送的数据；
 * chunkedLength 分包的数据长度；
 * success 发送成功的回调函数
 */
async function sendDataChunkedToDevice(options) {
    const { chunkedLength, value } = options
    const byteLength = value.byteLength
    if (byteLength > 0) {
        await writeBLECharacteristicValue({
            ...options,
            value: value.slice(0, byteLength > chunkedLength ? chunkedLength : byteLength)
        })
        if (byteLength > chunkedLength) {
            sendDataChunkedToDevice({
                ...options,
                value: value.slice(chunkedLength, byteLength)
            })
        } else {
            options.success && options.success()
        }
    }
}

/**
 * 监听搜索到新设备的事件
 * @param {(devices:Array<{name:string,deviceId:string,RSSI:number,advertisData:ArrayBuffer,advertisServiceUUIDs:Array<String>,localName:string,serviceData:JSON}>)=>void} callback
 */
function onBluetoothDeviceFound(callback) {
    window.plus && window.plus.bluetooth.onBluetoothDeviceFound(function(e) {
        callback(e.devices) // device.deviceId
    })
}

/**
 * 监听低功耗蓝牙设备连接状态变化事件
 * @param {(e:{deviceId : string,connected : boolean})=>void} callback
 * deviceId - String类型，蓝牙设备id； connected - Boolean类型，是否处于已连接状态
 */
function onBLEConnectionStateChange(callback) {
    window.plus && window.plus.bluetooth.onBLEConnectionStateChange(function(e) {
        callback(e) // device.deviceId
    })
}

/**
 * 监听蓝牙适配器状态变化事件
 * @param {(e:{discovering : boolean,available : boolean})=>void} callback
 *  discovering - Boolean类型，蓝牙适配器是否正在搜索设备； available - Boolean类型，蓝牙适配器是否可用
 */
function onBluetoothAdapterStateChange(callback) {
    window.plus && window.plus.bluetooth.onBluetoothAdapterStateChange(function(e) {
        callback(e) // device.deviceId
    })
}

/**
 * 监听低功耗蓝牙设备的特征值变化事件
 * @param {(e:{deviceId : string, serviceId : string, characteristicId : string,value : ArrayBuffer })=>void} callback
 * deviceId - String类型，蓝牙设备id； serviceId - String类型，蓝牙服务的uuid； characteristicId - String类型，蓝牙特征值的uuid； value - ArrayBuffer类型，特征值的最新值
 */
function onBLECharacteristicValueChange(callback) {
    window.plus && window.plus.bluetooth.onBLECharacteristicValueChange(function(e) {
        callback(e) // device.deviceId
    })
}

/**
 * 设置蓝牙最大传输单元
 * @param { { deviceId:string,mtu:number} } options
 * deviceId         设备ID；
 * mtu              最大传输单元(22,512) 区间内，单位为字节（bytes）
 * @returns {Promise<boolean>}      Promise-boolean
 */
function setBLEMTU(options) {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.setBLEMTU({
            ...options,
            success(e) {
                resolve(true)
            },
            fail(e) {
                reject(e)
            }
        })
    })
}

/**
 * 启用低功耗蓝牙设备特征值变化时的notify功能，订阅特征值
 * @param { { deviceId:string,serviceId:string,characteristicId:string,state:boolean } } options
 * deviceId         设备ID；
 * serviceId        服务ID；
 * characteristicId 特征ID；
 * state            是否启用 notify
 * @returns {Promise<boolean>}      Promise-boolean
 */
function notifyBLECharacteristicValueChange(options) {
    return new Promise((resolve, reject) => {
        window.plus && window.plus.bluetooth.notifyBLECharacteristicValueChange({
            ...options,
            success(e) {
                resolve(true)
            },
            fail(e) {
                reject(e)
            }
        })
    })
}
export default {
    openBluetoothAdapter,
    getBluetoothAdapterState,
    closeBluetoothAdapter,
    startBluetoothDevicesDiscovery,
    stopBluetoothDevicesDiscovery,
    getBluetoothDevices,
    createBLEConnection,
    closeBLEConnection,
    getBLEDeviceServices,
    getBLEDeviceCharacteristics,
    getAllId,
    getConnectedBluetoothDevices,
    getBLEDeviceRSSI,
    readBLECharacteristicValue,
    writeBLECharacteristicValue,
    sendData,
    sendDataChunkedToDevice,
    onBluetoothDeviceFound,
    onBLEConnectionStateChange,
    onBluetoothAdapterStateChange,
    onBLECharacteristicValueChange,
    setBLEMTU,
    notifyBLECharacteristicValueChange
}
