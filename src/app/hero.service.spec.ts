import { HttpClient } from '@angular/common/http';

import { MessageService } from './message.service';
import { HeroService } from './hero.service';
import { ReplaySubject } from 'rxjs';
import { Hero } from './hero';

import { TestScheduler } from 'rxjs/testing';

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

  const deepEqual = (actual: any, expected: any): void => {
    expect(actual).toEqual(expected);
  };

  function create(): HeroService {
    return new HeroService(httpClientMock, messageService);
  }

  function getCreate(): HeroService {
    const get$ = new ReplaySubject(1);
    httpClientMock.get = jest.fn().mockReturnValue(get$);
    return create();
  }

  describe('getHeroes()', () => {
    it('getting a list of heroes', () => {
      heroService = getCreate();

      const scheduler = new TestScheduler(deepEqual);
      // scheduler.run(helpers => {
      //   const { expectObservable } = helpers;
      //   const expectMarble = '-a|';
      //   const expectValues = dummyHeroes;
      //   expectObservable(heroService.getHeroes()).toBe(expectMarble, expectValues);
      // });

      const marbles = {
        a: '-a',
      };

      const value = {
        a: dummyHeroes
      };

      scheduler.run(({ cold, expectObservable }) => {
        const output$ = heroService.getHeroes();
        expectObservable(output$).toBe(marbles.a, value);
      });

      // m.expect(heroService.getHeroes).toBeObservable(expect);
      // heroService.getHeroes().subscribe((res) => {
      //   expect(res).toEqual(dummyHeroes);
      // });

      expect(httpClientMock.get).toHaveBeenCalledWith(heroesUrl);
    });
  });

  describe('getHero()', () => {
    it('get One specified hero', () => {
      heroService = getCreate();

      const ID = 19;
      heroService.getHero(ID).subscribe((res) => {
        expect(res).toEqual({ id: 19, name: 'Magma' });
      });

      expect(httpClientMock.get).toHaveBeenCalledWith(heroesUrl + `/${ID}`);
    });
  });


  describe('searchHero()', () => {
    it('search a hero with a certain term', () => {
      heroService = getCreate();

      const term = 'D';
      const dummySearchTermResult = dummyHeroes.filter((hero => hero.name.indexOf(term)));
      heroService.searchHeroes(term).subscribe((res) => {
        expect(res).toEqual(dummySearchTermResult);
      });

      expect(httpClientMock.get).toHaveBeenCalledWith(heroesUrl + `/?name=${term}`);
    });
  });

  describe('updateHero()', () => {
    it('update the details of a hero', () => {
      const put$ = new ReplaySubject(1);
      httpClientMock.put = jest.fn().mockReturnValue(put$);
      heroService = create();

      const hero: Hero = { id: 20, name: 'UpdateNameHero' };

      heroService.updateHero(hero);

      const get$ = new ReplaySubject(1);
      httpClientMock.get = jest.fn().mockReturnValue(get$);

      heroService.getHero(20).subscribe((res) => {
        expect(res).toEqual(hero);
      });
    });
  });

  describe('addHero()', () => {
    it('create an new hero', () => {
      const post$ = new ReplaySubject(1);
      httpClientMock.post = jest.fn().mockReturnValue(post$);
      heroService = create();

      const hero: Hero = { id: 21, name: 'InsertNewHero' };
      heroService.addHero(hero);

      const get$ = new ReplaySubject(1);
      httpClientMock.get = jest.fn().mockReturnValue(get$);

      heroService.getHero(21).subscribe((res) => {
        expect(res).toEqual(hero);
      });
    });
  });

  describe('deleteHero()', () => {
    it('delete a hero', () => {
      const delete$ = new ReplaySubject(1);
      httpClientMock.delete = jest.fn().mockReturnValue(delete$);
      heroService = create();

      const hero: Hero = { id: 18, name: 'Dr IQ' };
      heroService.deleteHero(20);
      heroService.deleteHero(hero);


      const get$ = new ReplaySubject(1);
      httpClientMock.get = jest.fn().mockReturnValue(get$);

      heroService.getHero(20).subscribe((res) => {
        console.log(res);
        expect(res).toEqual(null);
      });

      heroService.getHero(hero.id).subscribe((res) => {
        console.log(res);
      });
    });
  });

});
