import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { checkRoleGuard } from "./check-role.guard";

describe("checkRoleGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => checkRoleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
