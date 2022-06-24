import { GoogleGuard } from '@app/guards/google.guard';

describe('GoogleGuard', () => {
  it('should be defined', () => {
    expect(new GoogleGuard()).toBeDefined();
  });
});
