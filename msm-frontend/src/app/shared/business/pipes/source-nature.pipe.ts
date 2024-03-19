import { Pipe, PipeTransform } from '@angular/core';

const SOURCE_NATURES: { [key: string]: string } = {
    'coffer': 'Coffre',
    'crate': 'Caisse',
    'bank': 'Banque',
    'poste': 'Poste',
    'consumption': 'Consommation',
};

@Pipe({
    name: 'mySourceNature'
})
export class SourceNaturePipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return SOURCE_NATURES[value];
    }
}