import { Hero } from './hero';

describe('Hero', () => {

  let hero: Hero;

  it('should create a new Hero', () => {
    hero = {id: 1, name: 'superHero'};
    expect(hero.id).toEqual(1);
    expect(hero.name).toEqual('superHero');
  });

});
