import { DataReader } from '../utils/DataReader';
import DBCRecord from './DBCRecord';
import { VirtualFileSystem } from './fs/VirtualFileSystem';

class DBC<T> {
  records: T[];
  strings: string[];

  constructor() {
    this.records = [];
    this.strings = [];
  }

  static async loadFile<RecordType>(fs: VirtualFileSystem, path: string, type: DBCRecord<RecordType>): Promise<DBC<RecordType>> {
    const response = await fs.fetch(path);
    return DBC.loadFromArray(type, response);
  }

  static loadFromArray<RecordType>(type: DBCRecord<RecordType>, data: ArrayBuffer): DBC<RecordType> {
    const reader = new DataReader(data);
    return this.load(type, reader);
  }

  static load<RecordType>(type: DBCRecord<RecordType>, reader: DataReader): DBC<RecordType> {
    const result = new DBC<RecordType>();

    if (reader.readAscii(4) !== 'WDBC') {
      throw new Error('Failed to load DBC file, missing magic string');
    }
    const recordCount = reader.readUint32();
    const _fieldCount = reader.readUint32();
    const _recordSize = reader.readUint32();
    const stringBlockSize = reader.readUint32();

    for (let i = 0; i < recordCount; i++) {
      result.records.push(type.fromReader(reader, result.strings));
    }

    const start = reader.pos;
    while (reader.pos < start + stringBlockSize && reader.pos < reader.length) {
      const index = reader.pos - start;
      result.strings[index] = reader.readNullTerminatedString();
    }

    return result;
  }
}

export default DBC;