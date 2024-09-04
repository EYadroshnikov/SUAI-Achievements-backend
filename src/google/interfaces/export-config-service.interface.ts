export interface IExportConfigService {
  fieldOrder: string[];
  fieldTypes: {};
  headers: {};
  translations: {};

  getFieldOrder(): string[];

  translateField(key: string, value: any): any;
}
