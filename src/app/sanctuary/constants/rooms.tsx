import React from 'react';
import { Room } from '../types';
import { RoomIcon } from './icons';

export const ROOMS: Room[] = [
  { 
    id: 'ops', 
    name: 'Focus', 
    shortName: 'Focus',
    essence: 'Get things moving', 
    icon: <RoomIcon type="ops" color="currentColor" />,
  },
  { 
    id: 'library', 
    name: 'Library', 
    shortName: 'Library',
    essence: 'Discover wisdom', 
    icon: <RoomIcon type="library" color="currentColor" />,
  },
  { 
    id: 'studio', 
    name: 'Design Studio', 
    shortName: 'Studio',
    essence: 'Create beauty', 
    icon: <RoomIcon type="studio" color="currentColor" />,
  },
  { 
    id: 'zen', 
    name: 'Zen Garden', 
    shortName: 'Zen',
    essence: 'Embrace stillness', 
    icon: <RoomIcon type="zen" color="currentColor" />,
  },
  { 
    id: 'journal', 
    name: 'Journal Nook', 
    shortName: 'Journal',
    essence: 'Reflect deeply', 
    icon: <RoomIcon type="journal" color="currentColor" />,
  },
  { 
    id: 'rest', 
    name: 'Rest Chamber', 
    shortName: 'Rest',
    essence: 'Surrender to sleep', 
    icon: <RoomIcon type="rest" color="currentColor" />,
  },
];