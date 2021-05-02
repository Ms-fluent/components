import {InjectionToken} from '@angular/core';

export class MsSuggestIntl {
  noResult: string;
  singleResult: string;
  multipleResult: string;
}

export const MS_SUGGEST_DEFAULT_INTL = new InjectionToken<MsSuggestIntl>('ms-suggest-default-intl', {
  providedIn: 'root',
  factory: () => ({
    noResult: 'Noting found',
    singleResult: 'Résultat(s) trouvés',
    multipleResult: 'Résultats trouvés'
  })
});
