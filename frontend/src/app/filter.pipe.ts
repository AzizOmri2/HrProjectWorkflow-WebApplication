import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(
    items: any[],
    searchText: string = '',
    role: string = '',
    status: string | boolean = ''
  ): any[] {
    if (!items) return [];

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      const matchesText = !searchText || Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(searchText)
      );

      const matchesRole = !role || item.role === role;
      const matchesStatus = status === '' || item.active === (status === 'true' || status === true);

      return matchesText && matchesRole && matchesStatus;
    });
  }

}
