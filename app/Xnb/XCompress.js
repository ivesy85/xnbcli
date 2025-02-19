'use strict';
const ref = require('ref-napi');
const ffi = require('ffi-napi');
const Struct = require('ref-struct-napi');
const path = require('path');

const intPtr = ref.refType('int');
const bytePtr = ref.refType('byte');

const XMEMCODEC_TYPE = {
    XMEMCODEC_DEFAULT: 0,
    XMEMCODEC_LZX: 1
};

const XMEMCODEC_PARAMETERS_LZX = Struct([
    ['int', 'Flags'],
    ['int', 'WindowSize'],
    ['int', 'CompressionPartitionSize']
]);

const XMEMCODEC_PARAMETERS_LZXPtr = ref.refType(XMEMCODEC_PARAMETERS_LZX);

class XCompress {
    constructor(dllFilename = 'xcompress32.dll') {
        this.dllPath = path.join(__dirname, dllFilename);
        this.xcompress = new ffi.Library(this.dllPath, {
            'XMemCompress': ['int', ['int', bytePtr, intPtr, bytePtr, 'int']],
            'XMemCreateCompressionContext': ['int', ['int', XMEMCODEC_PARAMETERS_LZXPtr, 'int', intPtr]],
            'XMemDestroyCompressionContext': ['void', ['int']],
            'XMemDecompress': ['int', ['int', bytePtr, intPtr, bytePtr, 'int']],
            'XMemCreateDecompressionContext': ['int', ['int', XMEMCODEC_PARAMETERS_LZXPtr, 'int', intPtr]],
            'XMemDestroyDecompressionContext': ['void', ['int']]
        });

        this.codecParams = new XMEMCODEC_PARAMETERS_LZX({
            Flags: 0,
            WindowSize: 64 * 1024,
            CompressionPartitionSize: 256 * 1024
        });
    }

    decompress(compressedBuffer, decompressedBuffer) {
        const decompressionContextRef = Buffer.alloc(4);
        decompressionContextRef.type = ref.types.int;

        this.xcompress.XMemCreateDecompressionContext(
            XMEMCODEC_TYPE.XMEMCODEC_LZX,
            this.codecParams.ref(),
            0,
            decompressionContextRef
        );

        const decompressedSizeRef = Buffer.alloc(4);
        decompressedSizeRef.type = ref.types.int;
        decompressedSizeRef.writeInt32LE(decompressedBuffer.length, 0);

        this.xcompress.XMemDecompress(
            decompressionContextRef.readInt32LE(0),
            decompressedBuffer,
            decompressedSizeRef,
            compressedBuffer,
            compressedBuffer.length
        );

        this.xcompress.XMemDestroyDecompressionContext(decompressionContextRef.readInt32LE(0));
    }

    compress(decompressedBuffer) {
        const compressionContextRef = Buffer.alloc(4);
        compressionContextRef.type = ref.types.int;

        this.xcompress.XMemCreateCompressionContext(
            XMEMCODEC_TYPE.XMEMCODEC_LZX,
            this.codecParams.ref(),
            0,
            compressionContextRef
        );

        const compressedSizeRef = Buffer.alloc(4);
        compressedSizeRef.type = ref.types.int;
        compressedSizeRef.writeInt32LE(decompressedBuffer.length * 2, 0);

        const compressedBuffer = Buffer.alloc(compressedSizeRef.readInt32LE(0));
        compressedBuffer.type = ref.types.byte;

        this.xcompress.XMemCompress(
            compressionContextRef.readInt32LE(0),
            compressedBuffer,
            compressedSizeRef,
            decompressedBuffer,
            decompressedBuffer.length
        );

        this.xcompress.XMemDestroyCompressionContext(compressionContextRef.readInt32LE(0));

        return compressedBuffer.slice(0, compressedSizeRef.readInt32LE(0));
    }
}

module.exports = XCompress;
