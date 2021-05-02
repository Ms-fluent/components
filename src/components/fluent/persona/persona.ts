import {ChangeDetectorRef, Directive, Input} from '@angular/core';
import {msColor} from '../../core';
import {MS_PERSONA_SIZES, MsPersonaSize, MsPersonaSizeDeclaration} from './persona-size';
import {MS_PERSONA_STATUS, MsPersonaStatusName, MsPersonaStatusDeclaration} from './persona-status-declaration';

@Directive()
export abstract class MsPersona {
  @Input()
  bgColor: msColor = 'sharedRed10';

  @Input()
  color: msColor = 'white';

  @Input()
  get size(): MsPersonaSize {
    return this._size;
  }

  set size(value: MsPersonaSize) {
    const declaration = MS_PERSONA_SIZES[value];
    if (!declaration) {
      throw new Error(`Unknown ${value} size.`)
    }
    this._sizeDeclaration = declaration;
    this._changeDetector.markForCheck();
  }

  private _size: MsPersonaSize;

  get sizeDeclaration(): MsPersonaSizeDeclaration {
    return this._sizeDeclaration;
  }

  private _sizeDeclaration: MsPersonaSizeDeclaration = MS_PERSONA_SIZES['size32'];


  @Input()
  get status(): MsPersonaStatusName {
    return this._status;
  }

  set status(value: MsPersonaStatusName) {
    const declaration = MS_PERSONA_STATUS[value];
    if (!declaration) {
      throw new Error(`Unknown ${value} status.`)
    }
    this._statusDeclaration = declaration;
    this._status = value;
    this._changeDetector.markForCheck();
  }

  private _status: MsPersonaStatusName;
  private _statusDeclaration: MsPersonaStatusDeclaration;

  get statusDeclaration(): MsPersonaStatusDeclaration {
    return this._statusDeclaration;
  }

  get showStatus(): boolean {
    return !!this.status && !!this.statusDeclaration;
  }

  get width(): number {
    return this._sizeDeclaration.width;
  }

  get statusWidth(): number {
    return this._sizeDeclaration.statusWidth;
  }

  constructor(protected _changeDetector: ChangeDetectorRef) {
  }
}
