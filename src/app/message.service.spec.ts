import { getTestBed, TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';

describe('MessageService', () => {

  let injector: TestBed;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService],
    });

    injector = getTestBed();
    messageService = injector.get(MessageService);
  });

  it('adding a new message: message()', () => {
    messageService.add('new message');
    expect(messageService.messages.length).toEqual(1);
  });

  it('adding a a lot of new message and clearing', () => {
    const distance = 10;
    for (let index = 0; index < distance; index++) {
      messageService.add(`new message ${index}`);
    }
    expect(messageService.messages.length).toEqual(distance);
    expect(messageService.messages[2]).toEqual('new message 2');
    messageService.clear();
    expect(messageService.messages.length).toEqual(0);
  });

});
