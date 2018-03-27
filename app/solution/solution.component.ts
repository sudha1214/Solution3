import { FunctionService } from './services/functionService';
import { IFunctionModel } from './functionModel';
import { ForexService } from './services/forexService';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';

const TEN_TERRABYTE = (10 * 1024 * 1024);
const TWENTY_TERRABYTE = 2 * TEN_TERRABYTE;

@Component({
   moduleId: __moduleName,
   selector: 'my-solution',
   templateUrl: 'solution.component.html',
   styleUrls: ['solution.css']
})

export class SolutionComponent implements OnInit {
   currencies = [
      {value: 'USD', display: 'US Dollar (USD)'},
      {value: 'EUR', display: 'Euro (EUR)'},
      {value: 'GBP', display: 'Pound Sterling (GBP)'}
   ];
   IDS: string[] = ['1', '2', '3', '4'];

   fnsStatus: Observable<IFunctionModel[]>;
   currencyType: string;
   usd_eur: number;
   usd_gbp: number;
   disableButton: boolean = false;
   clickedBtnId: string;
   errorMessage: string;
    enableFnsList = [];
    disableFnsList = [];

   constructor(public fnsStatusService: FunctionService, public forexService: ForexService) {
   }

   isAmberAlert(memory) {
      return memory >  TEN_TERRABYTE &&
         memory < TWENTY_TERRABYTE;
   }
   isRedAlert(memory) {
      return memory >= TWENTY_TERRABYTE;
   }

   ngOnInit() {
      this.currencyType = 'USD';
       this.fnsStatusService.getFunctionIdsBillingUsage$(this.IDS).subscribe(values => {
           this.disableFnsList = [];
           this.enableFnsList = [];
          values.forEach(v => {
              v.enabled ? this.enableFnsList.push(v) : this.disableFnsList.push(v);
          });
      });
   }

    /**
     * onclick, gets the selected currencyType.
     * @param newValue
     */
   onChange(newValue) {
       this.currencyType = newValue;
       this.errorMessage = '';
       if (newValue === 'USD') {
           return;
       }
      this.forexService.getForexRates$().subscribe(res => {
         this.usd_eur = 1.0 / res.rates.USD;
         this.usd_gbp = (res.rates.GBP) / res.rates.USD;
      }, error => {
          console.log(error);
          this.errorMessage = 'Defaulting to currency type USD, as HankerRank only supports HTTPs requests,' +
              ' not available with free subscription of fixer.io. Please run this app locally, ' +
              'to see the working example.';
          this.currencyType = 'USD';
      });
   }

   /**
     * Toggles the functionStatus from enable to disable.
     * Cannot be disable, if only one function is in enable state.
     * @param {string} id
     * @param {boolean} status
     */
    toggleFunctionStatus (id: string, status: boolean) {
      if (this.enableFnsList.length === 1 && status)  {
          this.errorMessage = 'Cannot disable, atleast one function should be in enabled state';
         return;
      }
      this.errorMessage = '';
      this.clickedBtnId = id;
      this.disableButton = true;

      this.fnsStatusService.getFunctionStatus(id, !status).subscribe(val => {
         return val;
      }, error => {
         console.log(error);
      }, () => {
         this.disableButton = false;
      });
    }
}

