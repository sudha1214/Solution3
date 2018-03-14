import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pretty formats a memory value given in MegaBytes to the corresponding value in the
 * 'most appropriate' memory unit. Returns a string with two decimal places and the
 * unit appended.
 */
@Pipe({ name: 'vmwMemoryFormat' })
export class MemoryFormatPipe implements PipeTransform {

   /**
    * Units for measuring storage, in magnitude order.
    */
   private _STORAGE_SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

   transform(mbs: string): string {
      const bytes = parseFloat(mbs) * 1024 * 1024;
      return this._formatBytes(bytes, 2);
   }

   /**
    * Pretty formats the given size to a string in the closest size unit.
    *
    * Note, lifted from: http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    *
    * @param bytes
    *    Number of bytes to format.
    *
    * @param decimals
    *    Max number of decimals to display.
    *
    * @returns {string}
    *    Pretty formatted size string.
    */
   private _formatBytes(bytes, decimals) {
      if (bytes === 0) {
         return '0 Bytes';
      }
      const k = 1024;
      const i = this._nearestStorageUnitIndex(bytes);
      return (bytes / Math.pow(k, i)).toFixed(decimals) + ' ' + this._STORAGE_SIZES[i];
   }

   /**
    * Returns an index from STORAGE_SIZES for the storage unit most closely matching
    * the given number of bytes.
    *
    * @param bytes
    *    The bytes to find the storage unit index for.
    *
    * @returns {any}
    *    Index from STORAGE_SIZES
    */
   private _nearestStorageUnitIndex(bytes: number): number {
      if (bytes === 0) {
         return 0;
      }
      const k = 1024;
      return Math.floor(Math.log(bytes) / Math.log(k));
   }

}
