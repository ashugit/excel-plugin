import { RowObservable } from './row-observable';
import { Store } from './store';
export class Data{
    
   constructor(store){
       this.data = {};
       this.rowObservables = {}
       this.store = store;
   }

   /**
    * 
    */
   isStored(){
        if(this.store) return true;
        return false;
   }
   /**
    * 
    * @param {*} index 
    * @returns proxied row
    */
   getNthRow(index){
        new RowObservable().getData(stored);
   }
    /**
    * 
    * @param {*} index 
    * @returns proxied row
    */
   getNthNewRow(index){

   }

   /**
    * 
    * @param {*} index 
    * @returns proxied row
    */
   getNthRowFromStore(index){

   }

   /**
    * 
    * @param {*} index 
    * @param {*} proxied row 
    */
   setNthRow(index, row){

   }
   
   

   
}


