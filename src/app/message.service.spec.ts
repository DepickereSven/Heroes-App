import { MessageService } from './message.service';

describe('MessageService', () => {

  let messageService: MessageService;

  function create(): MessageService {
    return new MessageService();
  }

  describe('add()', () => {
    it('adding a new message: message()', () => {
      messageService = create();

      messageService.add('new message');
      expect(messageService.messages.length).toEqual(1);
    });
  });

  describe('clear()', () => {
    it('adding a a lot of new message and clearing', () => {
      messageService = create();

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

});
