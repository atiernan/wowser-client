import { DataReader } from '../utils/DataReader';

interface DBCRecord<T> {
  fromReader(dataReader: DataReader, strings: string[]): T; 
}

export default DBCRecord;