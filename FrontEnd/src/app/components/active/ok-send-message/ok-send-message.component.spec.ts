import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OkSendMessageComponent } from './ok-send-message.component';

describe('OkSendMessageComponent', () => {
  let component: OkSendMessageComponent;
  let fixture: ComponentFixture<OkSendMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OkSendMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OkSendMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
