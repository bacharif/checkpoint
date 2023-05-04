import { Db } from './db';

export class ChainTracker {
  private blocks: Map<number, string> = new Map<number, string>();
  private lastBlockNumber?: number;
  private maxBlockCount: number;
  private db: Db;

  constructor(maxBlockCount: number, db: Db) {
    this.maxBlockCount = maxBlockCount;
    this.db = db;
    this.initLastBlockNumber();
  }

  public addBlock(blockNumber: number, blockData: string): void {
    if (this.blocks.has(blockNumber)) {
      throw new Error(`Block with number ${blockNumber} already exists`);
    }
    this.blocks.set(blockNumber, blockData);
    this.lastBlockNumber = blockNumber;
    this.trimBlocks();
    this.updateLastBlockNumber();
  }

  public getLastBlock(): string | undefined {
    if (!this.lastBlockNumber) {
      return undefined;
    }
    return this.getBlock(this.lastBlockNumber);
  }

  public getBlockCount(): number {
    return this.blocks.size;
  }

  public invalidate(blockNumber: number): void {
    if (!this.blocks.has(blockNumber)) {
      return;
    }
    let currentBlockNumber = this.lastBlockNumber!;
    while (currentBlockNumber >= blockNumber) {
      this.blocks.delete(currentBlockNumber);
      currentBlockNumber--;
    }
    this.lastBlockNumber = currentBlockNumber;
    this.updateLastBlockNumber();
  }

  private getBlock(blockNumber: number): string | undefined {
    return this.blocks.get(blockNumber);
  }

  private initLastBlockNumber(): void {
    this.lastBlockNumber = this.db.getLastBlockNumber();
  }

  private updateLastBlockNumber(): void {
    if (!this.lastBlockNumber) {
      return;
    }
    this.db.setLastBlockNumber(this.lastBlockNumber);
  }

  private trimBlocks(): void {
    const excessBlockCount = this.getBlockCount() - this.maxBlockCount;
    if (excessBlockCount <= 0) {
      return;
    }
    let firstBlockNumber = this.lastBlockNumber! - excessBlockCount + 1;
    while (this.blocks.has(firstBlockNumber)) {
      this.blocks.delete(firstBlockNumber);
      firstBlockNumber++;
    }
  }
}
