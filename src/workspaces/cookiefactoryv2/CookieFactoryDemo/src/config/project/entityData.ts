// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
// SPDX-License-Identifier: Apache-2.0

import type { ValueOf } from 'type-fest';

import type { EntityData } from '@/lib/types';

const CHECKPOINT_PROPERTY = {
  DATA_PROPERTY_NAME_1: 'People',
  DATA_PROPERTY_NAME_2: 'Dwell-Time',
  ALARM_PROPERTY_NAME_1: 'AlarmState'
}

const GATES_PROPERTY = {
  DATA_PROPERTY_NAME_1: 'Date',
  DATA_PROPERTY_NAME_2: 'Departure_Delay',
  DATA_PROPERTY_NAME_3: 'Departure_Time',
  DATA_PROPERTY_NAME_4: 'Destination',
  DATA_PROPERTY_NAME_5: 'Flight-Num',
  DATA_PROPERTY_NAME_6: 'Origin',
  DATA_PROPERTY_NAME_7: 'Scheduled_Departure',
  ALARM_PROPERTY_NAME_1: 'Flight_State'
}

const ESCALATOR_PROPERTY = {
  DATA_PROPERTY_NAME_1: 'FlowRate',
  DATA_PROPERTY_NAME_2: 'Vibration',
  ALARM_PROPERTY_NAME_1: 'AlarmState'
}

const SOLAR_PROPERTY = {
  DATA_PROPERTY_NAME_1: 'Power',
  DATA_PROPERTY_NAME_2: 'Temp',
  ALARM_PROPERTY_NAME_1: 'AlarmState'
}

const KIOSKS_PROPERTY = {
  DATA_PROPERTY_NAME_1: 'TotalActive',
  ALARM_PROPERTY_NAME_1: 'KioskState'
}

const ENTITY_IDs = {
  CHECKIN: 'ed6ee472-c43e-402d-8d17-78ff2130f046',
  CHECKIN2: 'e5b58a7d-a97e-498b-ac25-f4711bb25800',
  CHECKIN3: '1ab8b859-c062-4955-b775-c7127c675fe1',
  SECURITY: '3823faed-3815-469e-ba43-d02c253fcdc6',
  SECURITY2: '308154ec-4339-46f9-b1b8-5f2de98d1fb7',
  SECURITY3: 'ca934781-394a-46fa-a68a-6c1267ec3d82',
  IMMIGRATION: 'e1c17ea8-a68e-43eb-92e9-05979d7c74b8',
  IMMIGRATION2: '579ceee7-b30b-422e-a10b-8c33b4521317',
  IMMIGRATION3: 'e1ac9f3a-3703-4de2-903c-28c946b208ba',
  GATE: 'b4049f6f-2224-4ef8-b3e5-5e9b9136d66b',
  GATE2: '00f01643-9672-46be-bc33-94b83d8f0865',
  ESCALATOR1: '5f6bae83-1954-420a-ab19-8162800fa529',
  ESCALATOR2: '8573db7b-c03c-41f4-943e-f57addba9677',
  SOLAR1: 'a6638173-8ffa-4653-b329-e1be7112d4dd',
  KIOSKGROUP1: '644fdebf-5c23-4b10-a6f4-2c58fe110be3',
  KIOSKGROUP2: '250cc029-aa7b-4810-924e-523c800e2e3c',
  KIOSKGROUP3: '703d78f1-38d0-44b6-bafe-54551a9d6c07',
  KIOSKGROUP4: '4cfa7561-a893-4220-b432-15495020222b'
}

export const ALARM_PROPERTY_NAME = 'AlarmMessage';

export const COMPONENT_NAMES = {
  Equipment: 'CookieLineComponent',
  ProcessStep: 'ProcessStepComponent'
};

export const ENTITY_TYPES = {
  Equipment: 'Equipment',
  ProcessStep: 'Process step'
};

export const ENTITY_DATA: EntityData[] = [
  {
    entityId: ENTITY_IDs.CHECKIN,
    componentName: 'CheckIn-1',
    properties: getPropertiesCheckPoints(),
    name: 'CheckIn-1',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.CHECKIN2,
    componentName: 'CheckIn-2',
    properties: getPropertiesCheckPoints(),
    name: 'CheckIn-2',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.CHECKIN3,
    componentName: 'CheckIn-3',
    properties: getPropertiesCheckPoints(),
    name: 'CheckIn-3',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.SECURITY,
    componentName: 'Security-1',
    properties: getPropertiesCheckPoints(),
    name: 'Security-1',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.SECURITY2,
    componentName: 'Security-2',
    properties: getPropertiesCheckPoints(),
    name: 'Security-2',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.SECURITY3,
    componentName: 'Security-3',
    properties: getPropertiesCheckPoints(),
    name: 'Security-3',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.IMMIGRATION,
    componentName: 'Immigration-1',
    properties: getPropertiesCheckPoints(),
    name: 'Immigration-1',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.IMMIGRATION2,
    componentName: 'Immigration-2',
    properties: getPropertiesCheckPoints(),
    name: 'Immigration-2',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.IMMIGRATION3,
    componentName: 'Immigration-3',
    properties: getPropertiesCheckPoints(),
    name: 'Immigration-3',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.GATE,
    componentName: 'Gate1',
    properties: getPropertiesGates(),
    name: 'Gate1',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.GATE2,
    componentName: 'Gate2',
    properties: getPropertiesGates(),
    name: 'Gate2',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.ESCALATOR1,
    componentName: 'Escalator1',
    properties: getPropertiesEscalator(),
    name: 'Escalator1',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.ESCALATOR2,
    componentName: 'Escalator2',
    properties: getPropertiesEscalator(),
    name: 'Escalator2',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.SOLAR1,
    componentName: 'SolarPanels1',
    properties: getPropertiesSolar(),
    name: 'SolarPanels1',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.KIOSKGROUP1,
    componentName: 'KioskGroup1',
    properties: getPropertiesKiosks(),
    name: 'KioskGroup1',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.KIOSKGROUP2,
    componentName: 'KioskGroup2',
    properties: getPropertiesKiosks(),
    name: 'KioskGroup2',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.KIOSKGROUP3,
    componentName: 'KioskGroup3',
    properties: getPropertiesKiosks(),
    name: 'KioskGroup3',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.KIOSKGROUP4,
    componentName: 'KioskGroup4',
    properties: getPropertiesKiosks(),
    name: 'KioskGroup4',
    type: ENTITY_TYPES.Equipment
  }
];

export const IGNORED_ENTITY_IDS: string[] = [];

function getPropertiesCheckPoints(): ValueOf<EntityData, 'properties'> {
  return [
    {
      propertyQueryInfo: {
        propertyName: CHECKPOINT_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm'
    },
    {
      propertyQueryInfo: {
        propertyName: CHECKPOINT_PROPERTY.DATA_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      threshold: { upper: 30, lower: 10 },
      type: 'data',
      unit: '#'
    },
    {
      propertyQueryInfo: {
        propertyName: CHECKPOINT_PROPERTY.DATA_PROPERTY_NAME_2,
        refId: crypto.randomUUID()
      },
      threshold: { upper: 45, lower: 15 },
      type: 'data',
      unit: 'minutes'
    }
  ];
}

function getPropertiesGates(): ValueOf<EntityData, 'properties'> {
  return [
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm'
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'data'
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_2,
        refId: crypto.randomUUID()
      },
      type: 'data',
      unit: 'minutes'
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_3,
        refId: crypto.randomUUID()
      },
      type: 'data'
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_4,
        refId: crypto.randomUUID()
      },
      type: 'data'
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_5,
        refId: crypto.randomUUID()
      },
      type: 'data'
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_6,
        refId: crypto.randomUUID()
      },
      type: 'data'
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_7,
        refId: crypto.randomUUID()
      },
      type: 'data'
    }
  ];
}

function getPropertiesEscalator(): ValueOf<EntityData, 'properties'> {
  return [
    {
      propertyQueryInfo: {
        propertyName: ESCALATOR_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm'
    },
    {
      propertyQueryInfo: {
        propertyName: ESCALATOR_PROPERTY.DATA_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      threshold: { upper: 6000, lower: 3000 },
      type: 'data',
      unit: 'RPM'
    },
    {
      propertyQueryInfo: {
        propertyName: ESCALATOR_PROPERTY.DATA_PROPERTY_NAME_2,
        refId: crypto.randomUUID()
      },
      threshold: { upper: 80, lower: 60 },
      type: 'data',
      unit: 'HZ'
    }
  ];
}


function getPropertiesSolar(): ValueOf<EntityData, 'properties'> {
  return [
    {
      propertyQueryInfo: {
        propertyName: SOLAR_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm'
    },
    {
      propertyQueryInfo: {
        propertyName: SOLAR_PROPERTY.DATA_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      threshold: { upper: 60, lower: 80 },
      type: 'data',
      unit: 'W'
    },
    {
      propertyQueryInfo: {
        propertyName: SOLAR_PROPERTY.DATA_PROPERTY_NAME_2,
        refId: crypto.randomUUID()
      },
      threshold: { upper: 15, lower: 20 },
      type: 'data',
      unit: 'C'
    }
  ];
}

function getPropertiesKiosks(): ValueOf<EntityData, 'properties'> {
  return [
    {
      propertyQueryInfo: {
        propertyName: KIOSKS_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm'
    },
    {
      propertyQueryInfo: {
        propertyName: KIOSKS_PROPERTY.DATA_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      threshold: { upper: 20, lower: 5 },
      type: 'data',
      unit: '#'
    }
  ];
}
