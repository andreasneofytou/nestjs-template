import { JwtRefreshGuard } from '@app/guards/jwt-refresh.guard';

describe('JwtRefreshGuard', () => {
  it('should be defined', () => {
    expect(new JwtRefreshGuard()).toBeDefined();
  });
});
