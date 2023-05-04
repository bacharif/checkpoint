import { Db } from './db';
import { ChainTracker } from '../../../../src/providers/starknet/chainTracker';

describe('BlockChainTracker', () => {
  let db: Db;
  let tracker: ChainTracker;

  beforeEach(() => {
    db = new Db();
    tracker = new ChainTracker(3, db);
  });

  afterEach(() => {
    db.clear();
  });

  test('addBlock and getLastBlock', () => {
    tracker.addBlock(1, 'data1');
    expect(tracker.getLastBlock()).toBe('data1');
    tracker.addBlock(2, 'data2');
    expect(tracker.getLastBlock()).toBe('data2');
    tracker.addBlock(3, 'data3');
    expect(tracker.getLastBlock()).toBe('data3');
    tracker.addBlock(4, 'data4');
    expect(tracker.getLastBlock()).toBe('data4');
  });

  test('getBlockCount', () => {
    expect(tracker.getBlockCount()).toBe(0);
    tracker.addBlock(1, 'data1');
    expect(tracker.getBlockCount()).toBe(1);
    tracker.addBlock(2, 'data2');
    expect(tracker.getBlockCount()).toBe(2);
    tracker.addBlock(3, 'data3');
    expect(tracker.getBlockCount()).toBe(3);
    tracker.addBlock(4, 'data4');
    expect(tracker.getBlockCount()).toBe(3);
  });

  test('invalidate', () => {
    tracker.addBlock(1, 'data1');
    tracker.addBlock(2, 'data2');
    tracker.addBlock(3, 'data3');
    tracker.addBlock(4, 'data4');
    tracker.invalidate(3);
    expect(tracker.getLastBlock()).toBe('data2');
    expect(tracker.getBlockCount()).toBe(2);
  });

  test('addBlock throws error for existing block', () => {
    tracker.addBlock(1, 'data1');
    expect(() => {
      tracker.addBlock(1, 'data2');
    }).toThrowError('Block with number 1 already exists');
  });
});
