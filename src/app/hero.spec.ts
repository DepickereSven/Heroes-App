import { Hero } from './hero';

// 2 test

describe('Hero Class', () => {

  let hero: Hero;

  it('should create a new Hero', () => {
    hero = {id: 1, name: 'superHero'};
    expect(hero.id).toEqual(1);
    expect(hero.name).toEqual('superHero');
  });

});
