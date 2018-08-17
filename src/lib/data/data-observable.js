const DATA_OBSERVER_HANDLER = {
    /**
     * 
     */
    get: function(data, index) {
        // Already found
        if(data[key]) return data.getNthRow(index);
        //Check in store
        if(data.isStored()){
            let stored = data.getNthRowFromStore(index);
            if(stored) return stored;
            else return data.getNthNewRow(index);
        }else{
            return data.getNthNewRow(index);
        }
    },
    set: function(data, index, row) {
        data[index] = data.setNthRow(index, row);
    }

};


export class DataObservable{
    
   constructor(){
       this.data = null;
   }

   getData(stored = null){
        if(!this.data) {
            this.data = new Proxy(new Data(stored), DataObservable.DATA_OBSERVER_HANDLER);
        }
        
    }
}


