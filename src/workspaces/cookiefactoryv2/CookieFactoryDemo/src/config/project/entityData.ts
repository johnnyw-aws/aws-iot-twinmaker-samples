// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
// SPDX-License-Identifier: Apache-2.0

import type { ValueOf } from 'type-fest';

import type { EntityData, Primitive } from '@/lib/types';

const ALARM_MESSAGE_PROPERTY_NAME = 'AlarmMessage';

const CHECKPOINT_PROPERTY = {
  DATA_PROPERTY_NAME_1: 'People',
  DATA_PROPERTY_NAME_2: 'Dwell-Time',
  ALARM_PROPERTY_NAME_1: 'AlarmState'
}

const GATES_PROPERTY = {
  DATA_PROPERTY_NAME_1: 'Date',
  DATA_PROPERTY_NAME_2: 'Departure_Delay',
  DATA_PROPERTY_NAME_3: 'Estimated_Departure',
  DATA_PROPERTY_NAME_4: 'Destination',
  DATA_PROPERTY_NAME_5: 'Flight-Num',
  DATA_PROPERTY_NAME_6: 'Origin',
  DATA_PROPERTY_NAME_7: 'Scheduled_Departure',
  DATA_PROPERTY_NAME_8: 'Boarded',
  DATA_PROPERTY_NAME_9: 'Pace_Boarding',
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
const TURNAROUND_PROPERTY = {
  DATA_PROPERTY_NAME_1: 'Completed',
  DATA_PROPERTY_NAME_2: 'Pace_Completion',
  ALARM_PROPERTY_NAME_1: 'State',
  ALARM_PROPERTY_NAME_2: 'StateMessage'
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
  KIOSKGROUP4: '4cfa7561-a893-4220-b432-15495020222b',
  AIRCRAFTARRIVAL: 'a31d3c52-b5fe-492f-9bec-5617646d6cc2',
  DEBOARDING: 'd64414d1-bccd-49f8-9382-97c54ff3ea66',
  FUELING: '4b85e473-e1fe-44f1-acce-a6d835bd45c0',
  CATERING: '41ef2138-2d20-45c4-8a3b-3c329ae58e86', 
  CLEANING: '977a540d-936f-4bfa-9a71-7a66d7f150ea',
  BOARDING: 'd8e53a64-c202-40f6-aeb1-733ac9222cdd',
  UNLOADING: '8958e6fc-97b9-4c6c-9f7d-0fe34f797375',
  LOADING: 'feca186d-caeb-4c74-bfc8-8908320b4154',
  READYTAKEOFF: 'f79de777-59ca-41d4-b99d-383c1da1f765'
}

export const COMPONENT_NAMES = {
  Equipment: 'CookieLineComponent',
  ProcessStep: 'ProcessStepComponent',
  Relationships: 'Relationships'
};

export const ENTITY_TYPES = {
  Equipment: 'Equipment',
  ProcessStep: 'Process step'
};

const PROCESS_ENTITY_DATA: EntityData[] = [
  // {
  //   entityId: 'BoxErecting_db7dc38e-5b9c-46d4-a5b7-cd83543b7e63',
  //   componentName: COMPONENT_NAMES.ProcessStep,
  //   name: 'Box Erecting',
  //   type: ENTITY_TYPES.ProcessStep
  // },
  // {
  //   entityId: 'BoxLabeling_a9c0a04e-4681-43d4-8b73-c6c1bbcaf54b',
  //   componentName: COMPONENT_NAMES.ProcessStep,
  //   name: 'Box Labeling',
  //   type: ENTITY_TYPES.ProcessStep
  // },
  // {
  //   entityId: 'BoxSealing_78b17695-bf5a-4a0c-a15a-93232ce4abd6',
  //   componentName: COMPONENT_NAMES.ProcessStep,
  //   name: 'Box Sealing',
  //   type: ENTITY_TYPES.ProcessStep
  // },
  // {
  //   entityId: 'Forming_fbec6977-75c2-4cf8-a470-e61d0a589bb5',
  //   componentName: COMPONENT_NAMES.ProcessStep,
  //   name: 'Forming',
  //   type: ENTITY_TYPES.ProcessStep
  // },
  // {
  //   entityId: 'Freezing_01f790f8-08e4-401f-b2a2-6bc395178680',
  //   componentName: COMPONENT_NAMES.ProcessStep,
  //   name: 'Freezing',
  //   type: ENTITY_TYPES.ProcessStep
  // },
  // {
  //   entityId: 'Packing_defd8ea2-5535-432e-8f4b-bb80f5b3ff25',
  //   componentName: COMPONENT_NAMES.ProcessStep,
  //   name: 'Packing',
  //   type: ENTITY_TYPES.ProcessStep
  // },
  // {
  //   entityId: 'PlasticLining_09b64040-422c-47b0-a585-29e00ac28397',
  //   componentName: COMPONENT_NAMES.ProcessStep,
  //   name: 'Plastic Lining',
  //   type: ENTITY_TYPES.ProcessStep
  // },
  // {
  //   entityId: 'Shipping_e118463f-6bf0-4079-8a26-5b610d9e56be',
  //   componentName: COMPONENT_NAMES.ProcessStep,
  //   name: 'Shipping',
  //   type: ENTITY_TYPES.ProcessStep
  // }
];

const EQUIPMENT_ENTITY_DATA: EntityData[] = [
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
    componentName: 'Gate1-New',
    properties: getPropertiesGates(),
    name: 'Gate1',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.GATE2,
    componentName: 'Gate2-new',
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
  },
  {
    entityId: ENTITY_IDs.AIRCRAFTARRIVAL,
    componentName: 'Aircraft-Arrival',
    properties: getPropertiesTurnAround(),
    name: 'Aircraft-Arrival',
    type: ENTITY_TYPES.Equipment,
    isRoot : true
  },
  {
    entityId: ENTITY_IDs.DEBOARDING,
    componentName: 'Deboarding',
    properties: getPropertiesTurnAround(),
    name: 'Deboarding',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.FUELING,
    componentName: 'Fueling',
    properties: getPropertiesTurnAround(),
    name: 'Fueling',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.CATERING,
    componentName: 'Catering',
    properties: getPropertiesTurnAround(),
    name: 'Catering',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.CLEANING,
    componentName: 'Cleaning',
    properties: getPropertiesTurnAround(),
    name: 'Cleaning',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.BOARDING,
    componentName: 'Boarding',
    properties: getPropertiesTurnAround(),
    name: 'Boarding',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.UNLOADING,
    componentName: 'Unloading',
    properties: getPropertiesTurnAround(),
    name: 'Unloading',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.LOADING,
    componentName: 'Loading',
    properties: getPropertiesTurnAround(),
    name: 'Loading',
    type: ENTITY_TYPES.Equipment
  },
  {
    entityId: ENTITY_IDs.READYTAKEOFF,
    componentName: 'ReadyTakeOff',
    properties: getPropertiesTurnAround(),
    name: 'ReadyTakeOff',
    type: ENTITY_TYPES.Equipment
  }
];

export const ENTITY_DATA: EntityData[] = [...EQUIPMENT_ENTITY_DATA, ...PROCESS_ENTITY_DATA];

export const IGNORED_ENTITY_IDS: string[] = [];

export function createEventMessage(entityData: EntityData, message: Primitive): { name: string; message: string } {
  let normalizedName = '';
  let normailzedMessage = '';

  switch (entityData.entityId) {
    case ENTITY_IDs.CHECKIN: {
      normalizedName = 'CheckIn-1 dwell time over 30 minutes'; // ask chris about getting entitdy data properties
      normailzedMessage = `Contact airline to open Check-in counter 4`;
      break;
    }
    case ENTITY_IDs.CHECKIN2: {
      normalizedName = 'CheckIn-2 line over 25 people';
      normailzedMessage = `Contact airline to open Check-in counter 4`;
      break;
    }
    case ENTITY_IDs.CHECKIN3: {
      normalizedName = 'Checkin-3 dwell time over 20 minutes';
      normailzedMessage = `Contact airline to open Check-in counter 4`;
      break;
    }
    case ENTITY_IDs.SECURITY: {
      normalizedName = 'Security-1 dwell time over 40 minutes';
      normailzedMessage = `Contact security team to open 2 extra lines`;
      break;
    }
    case ENTITY_IDs.SECURITY2: {
      normalizedName = 'Security-2 dwell time over 25 minutes';
      normailzedMessage = `Contact security team to increase staffing by 20%`;
      break;
    }
    case ENTITY_IDs.SECURITY3: {
      normalizedName = 'Security-3 line is over 30 people';
      normailzedMessage = `Contact security team to open line 4`;
      break;
    }
    case ENTITY_IDs.IMMIGRATION: {
      normalizedName = 'Immigration-1 dwell time over 40 minutes';
      normailzedMessage = `Contact immigration staff to increase staffing by 20%`;
      break;
    }
    case ENTITY_IDs.IMMIGRATION2: {
      normalizedName = 'Immigration-2 dwell time over 20 minutes';
      normailzedMessage = `Contact immigration staff to activate more kiosks`;
      break;
    }
    case ENTITY_IDs.IMMIGRATION3: {
      normalizedName = 'Immigration-3 line is over 50 people';
      normailzedMessage = `Contact immigration staff to open line 4 and 5`;
      break;
    }
    case ENTITY_IDs.GATE: {
      normalizedName = 'Flight delayed by 20 minutes';
      normailzedMessage = `Previous flight unboarding of bags was 25% slower than usual`;
      break;
    }
    case ENTITY_IDs.GATE2: {
      normalizedName = 'Flight delayed by 30 minutes';
      normailzedMessage = `Delay incurred from mechanical issue with finger`;
      break;
    }
    case ENTITY_IDs.ESCALATOR1: {
      normalizedName = 'Escalator 1 running slower by 14%';
      normailzedMessage = `Send maintenance team to increase speed of escalator`;
      break;
    }
    case ENTITY_IDs.ESCALATOR2: {
      normalizedName = 'Escalator 2 stopped moving';
      normailzedMessage = `Send maintenance team to fix`;
      break;
    }
    case ENTITY_IDs.SOLAR1: {
      normalizedName = 'Solar panels generating 20% under requirements';
      normailzedMessage = `Expect a larger electricity bill to compensate`;
      break;
    }
    case ENTITY_IDs.KIOSKGROUP1: {
      normalizedName = 'Kiosk-1 has lost connection';
      normailzedMessage = `Send tech team`;
      break;
    }
    case ENTITY_IDs.KIOSKGROUP2: {
      normalizedName = 'Kiosk-2 processing requests 26% slower than usual';
      normailzedMessage = `Restart remotely`;
      break;
    }
    case ENTITY_IDs.KIOSKGROUP3: {
      normalizedName = 'Kiosk-3 has lost connection';
      normailzedMessage = `Send tech team`;
      break;
    }
    case ENTITY_IDs.KIOSKGROUP4: {
      normalizedName = 'Kiosk-4 processing requests 26% slower than usual';
      normailzedMessage = `Restart remotely`;
      break;
    }
    case ENTITY_IDs.AIRCRAFTARRIVAL: {
      normalizedName = `${message}`;
      normailzedMessage = `Warning: SLA not met on ${entityData.name}`;
      break;
    }
    case ENTITY_IDs.UNLOADING: {
      normalizedName = `${message}`;
      normailzedMessage = `Warning: SLA not met on ${entityData.name}`;
      break;
    }
    case ENTITY_IDs.DEBOARDING: {
      normalizedName = `${message}`;
      normailzedMessage = `Warning: SLA not met on ${entityData.name}`;
      break;
    }
    case ENTITY_IDs.CLEANING: {
      normalizedName = `${message}`;
      normailzedMessage = `Warning: SLA not met on ${entityData.name}`;
    }
    case ENTITY_IDs.FUELING: {
      normalizedName = `${message}`;
      normailzedMessage = `Warning: SLA not met on ${entityData.name}`;
      break;
    }
    case ENTITY_IDs.CATERING: {
      normalizedName = `${message}`;
      normailzedMessage = `Warning: SLA not met on ${entityData.name}`;
      break;
    }
    case ENTITY_IDs.LOADING: {
      normalizedName = `${message}`;
      normailzedMessage = `Warning: SLA not met on ${entityData.name}`;
      break;
    }
    case ENTITY_IDs.BOARDING: {
      normalizedName = `${message}`;
      normailzedMessage = `Warning: SLA not met on ${entityData.name}`;
      break;
    }
    case ENTITY_IDs.READYTAKEOFF: {
      normalizedName = `${message}`;
      normailzedMessage = `Warning: SLA not met on ${entityData.name}`;
      break;
    }
  }
  

  return {
    name: normalizedName,
    message: normailzedMessage
  };
}

function getPropertiesCheckPoints(): ValueOf<EntityData, 'properties'> {
  return [
    {
      propertyQueryInfo: {
        propertyName: CHECKPOINT_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm-state'
    },
    {
      propertyQueryInfo: {
        propertyName: CHECKPOINT_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm-message'
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
      type: 'alarm-state'
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm-message'
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'data'
    },
    // {
    //   propertyQueryInfo: {
    //     propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_2,
    //     refId: crypto.randomUUID()
    //   },
    //   type: 'data',
    //   unit: 'minutes'
    // },
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
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_8,
        refId: crypto.randomUUID()
      },
      type: 'data'
    },
    {
      propertyQueryInfo: {
        propertyName: GATES_PROPERTY.DATA_PROPERTY_NAME_9,
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
      type: 'alarm-state'
    },
    {
      propertyQueryInfo: {
        propertyName: ESCALATOR_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm-message'
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
      type: 'alarm-state'
    },
    {
      propertyQueryInfo: {
        propertyName: SOLAR_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm-message'
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
      type: 'alarm-state'
    },
    {
      propertyQueryInfo: {
        propertyName: KIOSKS_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm-message'
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

function getPropertiesTurnAround(): ValueOf<EntityData, 'properties'> {
  return [
    {
      propertyQueryInfo: {
        propertyName: TURNAROUND_PROPERTY.ALARM_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      type: 'alarm-state'
    },
    {
      propertyQueryInfo: {
        propertyName: TURNAROUND_PROPERTY.ALARM_PROPERTY_NAME_2,
        refId: crypto.randomUUID()
      },
      type: 'alarm-message'
    },
    {
      propertyQueryInfo: {
        propertyName: TURNAROUND_PROPERTY.DATA_PROPERTY_NAME_1,
        refId: crypto.randomUUID()
      },
      threshold: { upper: 100, lower: 0 },
      type: 'data',
      unit: '%'
    },
    {
      propertyQueryInfo: {
        propertyName: TURNAROUND_PROPERTY.DATA_PROPERTY_NAME_2,
        refId: crypto.randomUUID()
      },
      threshold: { upper: 100, lower: 0 },
      type: 'data',
      unit: '%'
    }
  ];
}

