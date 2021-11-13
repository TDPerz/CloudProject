import { TestBed } from '@angular/core/testing';

import { GetRoleGuard } from './get-role.guard';

describe('GetRoleGuard', () => {
  let guard: GetRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GetRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
