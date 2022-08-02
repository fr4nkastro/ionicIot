import { TestBed } from '@angular/core/testing';

import { SArduinoService } from './s-arduino.service';

describe('SArduinoService', () => {
  let service: SArduinoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SArduinoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
