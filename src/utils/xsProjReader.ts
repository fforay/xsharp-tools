import * as vscode from 'vscode';
import * as fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

export class xsProjReader {
  private values: Record<string, string>;

  constructor(xmlContent: string) {
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xmlContent);

    // Get the first PropertyGroup
    const propertyGroup = parsed?.Project?.PropertyGroup;

    if (!propertyGroup || typeof propertyGroup !== 'object') {
      this.values = {};
    } else {
      this.values = propertyGroup;
    }

  }

  public getAll(): Record<string, string> {
    return this.values;
  }

  public get(key: string): string | undefined {
    return this.values[key];
  }

  public getBool(key: string, defaultValue = false): boolean {
    const val = this.get(key);
    return val?.toLowerCase() === 'true' ? true : defaultValue;
  }

  public getInt(key: string, defaultValue = 0): number {
    const val = parseInt(this.get(key) ?? '', 10);
    return isNaN(val) ? defaultValue : val;
  }

  public getDouble(key: string, defaultValue = 0): number {
    const val = parseFloat(this.get(key) ?? '');
    return isNaN(val) ? defaultValue : val;
  }
}