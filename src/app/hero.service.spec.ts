import {MessageService} from './message.service';
import {HeroService} from './hero.service';
import {Observable, of, ReplaySubject} from 'rxjs';
import {Hero} from './hero';
import {async} from '@angular/core/testing';

jest.mock('@angular/common/http');

// 10 test

const heroesUrl = 'api/heroes';

const dummyHeroes = [
  {id: 11, name: 'Dr Nice'},
  {id: 12, name: 'Narco'},
  {id: 13, name: 'Bombasto'},
  {id: 14, name: 'Celeritas'},
  {id: 15, name: 'Magneta'},
  {id: 16, name: 'RubberMan'},
  {id: 17, name: 'Dynama'},
  {id: 18, name: 'Dr IQ'},
  {id: 19, name: 'Magma'},
  {id: 20, name: 'Tornado'}
];

describe('heroService', () => {

  // tslint:disable-next-line:prefer-const
  let messageService: MessageService;
  let heroService: HeroService;

  const httpClientMock = {
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
  } as any;

  beforeEach(() => {
    // heroService = new HeroService(httpClientMock, new MessageService());
  });

  // const deepEqual = (actual: any, expected: any): void => {
  //   expect(actual).toEqual(expected);
  // };

  function create(): HeroService {
    return new HeroService(httpClientMock, new MessageService());
  }

  function getCreate(hero: any): HeroService {
    updateGETProtocol(hero);
    return create();
  }

  function updateGETProtocol(hero: any): void {
    httpClientMock.get.mockImplementationOnce(() => of(hero));
  }

  describe('getHeroes()', () => {
    it('getting a list of heroes', async (() => {
      heroService = getCreate(dummyHeroes);

      heroService.getHeroes().subscribe((res) => {
        expect(res).toEqual(dummyHeroes);
        expect(httpClientMock.get).toHaveBeenCalledWith(heroesUrl);
      });
    }));
  });

  describe('getHero()', () => {
    it('get One specified hero', async (() => {
      const ID = 19;
      const hero: Hero = {id: ID, name: 'Magma'};
      heroService = getCreate(hero);

      heroService.getHero(ID).subscribe((res) => {
        expect(httpClientMock.get).toHaveBeenCalledWith(heroesUrl + `/${ID}`);
        expect(res).toEqual(hero);
      });

    }));
  });


  describe('searchHero()', () => {
    it('search a hero with a certain term', async (() => {
      const term = 'D';
      const dummySearchTermResult = dummyHeroes.filter((hero => hero.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1));
      heroService = getCreate(dummySearchTermResult);

      heroService.searchHeroes(term).subscribe((res) => {
        expect(httpClientMock.get).toHaveBeenCalledWith(heroesUrl + `/?name=${term}`);
        expect(res).toEqual(dummySearchTermResult);
      });

    }));
  });

  describe('updateHero()', () => {
    it('update the details of a hero', async (() => {
      const put$ = new ReplaySubject(1);
      httpClientMock.put = jest.fn().mockReturnValue(put$);
      heroService = create();

      const hero: Hero = {id: 20, name: 'UpdateNameHero'};

      heroService.updateHero(hero);

      updateGETProtocol(hero);
      heroService.getHero(20).subscribe((res) => {
        expect(res).toEqual(hero);
      });
    }));
  });

  describe('addHero()', () => {
    it('create an new hero', async (() => {
      const post$ = new ReplaySubject(1);
      httpClientMock.post = jest.fn().mockReturnValue(post$);
      heroService = create();

      const hero: Hero = {id: 21, name: 'InsertNewHero'};
      heroService.addHero(hero);

      updateGETProtocol(hero);
      heroService.getHero(21).subscribe((res) => {
        expect(res).toEqual(hero);
      });
    }));
  });

  describe('deleteHero()', () => {
    it('delete a hero', async (() => {
      const delete$ = new ReplaySubject(1);
      httpClientMock.delete = jest.fn().mockReturnValue(delete$);
      heroService = create();

      const hero: Hero = {id: 18, name: 'Dr IQ'};
      heroService.deleteHero(20);
      heroService.deleteHero(hero);


      updateGETProtocol(hero);
      heroService.getHero(20).subscribe((res) => {
        expect(res).toBeUndefined();
      });

      heroService.getHero(hero.id).subscribe((res) => {
        expect(res).toBeUndefined();
      });
    }));
  });

});
