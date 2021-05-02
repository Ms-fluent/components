import {msColor} from '../../core';

export type MsPersonaStatusName = 'online' | 'away' | 'busy' | 'blocked' | 'noDisturb'

export class MsPersonaStatusDeclaration {
  name: MsPersonaStatusName;
  icon?: string;
  bgColor: msColor;
  color?: msColor;
}


export const MS_PERSONA_STATUS: { [key: string]: MsPersonaStatusDeclaration } = {
  'online': {
    name: 'online',
    bgColor: 'sharedYellowGreen10',
    color: 'white',
    icon: 'SkypeCheck'
  },
  'away': {
    name: 'away',
    bgColor: 'sharedOrange10',
    color: 'sharedOrange10',
    icon: 'AwayStatus'
  },
  'busy': {
    name: 'busy',
    bgColor: 'sharedRed10',
  },
  'blocked': {
    name: 'blocked',
    bgColor: 'sharedRed20',
    color: 'white',
  },
  'noDisturb': {
    name: 'noDisturb',
    bgColor: 'sharedRed20',
    color: 'white',
    icon: 'StatusCircleBlock2',
  },
};
