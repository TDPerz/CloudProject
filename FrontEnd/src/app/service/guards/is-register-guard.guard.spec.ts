import { TestBed } from '@angular/core/testing';

import { IsRegisterGuardGuard } from './is-register-guard.guard';

describe('IsRegisterGuardGuard', () => {
  let guard: IsRegisterGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsRegisterGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
