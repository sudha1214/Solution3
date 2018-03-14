/**
 * Describes's function's current status.
 */
export interface IFunctionModel {
   /**
    * Unique ID.
    */
   id: string;

   /**
    * Name.
    */
   name: string;

   /**
    * Describes the function's purpose.
    */
   description: string;

   /**
    * 'HEALTHY' if the majority of recent executions of the function exited
    * normally. Else, 'ERROR'.
    */
   state: 'HEALTHY' | 'ERROR';

   /**
    * Total amount of memory allocation across all
    * instances of the function.
    */
   memoryUsage: number;

   /**
    * Current month total spend
    */
   billingUsage: number;

    /**
     * Function status
     */
   enabled: boolean;
}
