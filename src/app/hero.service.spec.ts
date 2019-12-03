import { HttpClient } from '@angular/common/http';

import { MessageService } from './message.service';
import { HeroService } from './hero.service';
import {ReplaySubject} from 'rxjs';
import {Hero} from './hero';

jest.mock('@angular/common/http');

describe('heroService', () => {

  // tslint:disable-next-line:prefer-const
  let messageService: MessageService;
  let heroService: HeroService;
  let httpClientMock: HttpClient;

  const heroesUrl = 'api/heroes';

  const dummyHeroes = [
    { id: 11, name: 'Dr Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
  ];

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      put: jest.fn(),
      post: jest.fn(),
      delete: jest.fn()
    } as any;
  });

  function create(): HeroService {
    return new HeroService(httpClientMock, messageService);
  }

  function getCreate(): HeroService {
    const get$ = new ReplaySubject(1);
    httpClientMock.get = jest.fn().mockReturnValue(get$);
    return create();
  }

  it('getting a list of heroes', () => {
    heroService = getCreate();

    heroService.getHeroes().subscribe((res) => {
      expect(res).toEqual(dummyHeroes);
    });

    expect(httpClientMock.get).toHaveBeenCalledWith(heroesUrl);
  });

  it('get One specified hero', () => {
    heroService = getCreate();

    const ID = 19;
    heroService.getHero(ID).subscribe((res) => {
      expect(res).toEqual({ id: 19, name: 'Magma' });
    });

    expect(httpClientMock.get).toHaveBeenCalledWith(heroesUrl + `/${ID}`);
  });


  it('search a hero with a certain term', () => {
    heroService = getCreate();

    const term = 'D';
    const dummySearchTermResult = dummyHeroes.filter((hero => hero.name.indexOf(term)));
    heroService.searchHeroes(term).subscribe((res) => {
      expect(res).toEqual(dummySearchTermResult);
    });

    expect(httpClientMock.get).toHaveBeenCalledWith(heroesUrl + `/?name=${term}`);
  });


  it('update the details of a hero', () => {
    const put$ = new ReplaySubject(1);
    httpClientMock.put = jest.fn().mockReturnValue(put$);
    heroService = create();

    const hero: Hero = { id: 20, name: 'UpdateNameHero'};

    heroService.updateHero(hero);

    heroService = getCreate();
    heroService.getHero(20).subscribe((res) => {
      expect(res).toEqual(hero);
    });

  });


});
