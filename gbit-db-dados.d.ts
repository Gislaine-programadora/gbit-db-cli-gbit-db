declare module "gbit-db-dados" {
  interface GbitDB {
    open(path: string): any;
    collection(name: string, schema?: Record<string, any>): any;
    [key: string]: any;
  }

  const gbit: GbitDB & { open(path: string): any };

  export function open(path: string): any;
  export function collection(name: string, schema?: Record<string, any>): any;

  export default gbit;
}