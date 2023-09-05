# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
# SPDX-License-Identifier: Apache-2.0

from udq_utils.udq import SingleEntityReader, MultiEntityReader, IoTTwinMakerDataRow, IoTTwinMakerUdqResponse
from udq_utils.udq_models import IoTTwinMakerUDQEntityRequest, IoTTwinMakerUDQComponentTypeRequest, OrderBy, IoTTwinMakerReference, \
    EntityComponentPropertyRef
from datetime import datetime, timedelta
import json
import pandas as pd
import os

# for debugging
# pd.set_option('display.max_rows', 500)
# pd.set_option('display.max_columns', 500)
# pd.set_option('display.width', 1000)

# read the telemetry data interval
DATA_INTERVAL = 10
try:
    DATA_INTERVAL = int(os.environ['TELEMETRY_DATA_TIME_INTERVAL_SECONDS'])
except:
    pass # use default interval

# read the telemetry data sample into a pandas dataframe for serving queries
data = []

try:
   telemetryDataFileName = os.environ['TELEMETRY_DATA_FILE_NAME']
   if telemetryDataFileName is None or telemetryDataFileName.strip() == '':
       telemetryDataFileName = 'demoTelemetryData2.json'
   print(f"telemetryDataFileName: {telemetryDataFileName}")
   with open(telemetryDataFileName, 'r') as f:
       lines = f.readlines()
       for line in lines:
           data.append(json.loads(line.strip()))
except:
   with open('demoTelemetryData2.json', 'r') as f:
       lines = f.readlines()
       for line in lines:
           data.append(json.loads(line.strip()))

df = pd.DataFrame(data)

# sample data cleaning operations for the csv data

# re-mapping of entity names to entity_ids for CookieLine1 telemetry data
simulatorName_to_entityId = {
    "CheckIn-1": 'ed6ee472-c43e-402d-8d17-78ff2130f046',
    "CheckIn-2": 'e5b58a7d-a97e-498b-ac25-f4711bb25800',
    "CheckIn-3": '1ab8b859-c062-4955-b775-c7127c675fe1',
    "Security-1": '3823faed-3815-469e-ba43-d02c253fcdc6',
    "Security-2": '308154ec-4339-46f9-b1b8-5f2de98d1fb7',
    "Security-3": 'ca934781-394a-46fa-a68a-6c1267ec3d82',
    "Immigration-1": 'e1c17ea8-a68e-43eb-92e9-05979d7c74b8',
    "Immigration-2": '579ceee7-b30b-422e-a10b-8c33b4521317',
    "Immigration-3": 'e1ac9f3a-3703-4de2-903c-28c946b208ba',
    "GATE": 'b4049f6f-2224-4ef8-b3e5-5e9b9136d66b',
    "GATE2": '00f01643-9672-46be-bc33-94b83d8f0865',
    "ESCALATOR1": '5f6bae83-1954-420a-ab19-8162800fa529',
    "ESCALATOR2": '8573db7b-c03c-41f4-943e-f57addba9677',
    "SOLAR1": 'a6638173-8ffa-4653-b329-e1be7112d4dd',
    "KIOSKGROUP1": '644fdebf-5c23-4b10-a6f4-2c58fe110be3',
    "KIOSKGROUP2": '250cc029-aa7b-4810-924e-523c800e2e3c',
    "KIOSKGROUP3": '703d78f1-38d0-44b6-bafe-54551a9d6c07',
    "KIOSKGROUP4": '4cfa7561-a893-4220-b432-15495020222b',
    "AIRCRAFTARRIVAL": 'a31d3c52-b5fe-492f-9bec-5617646d6cc2',
    "DEBOARDING": 'd64414d1-bccd-49f8-9382-97c54ff3ea66',
    "FUELING": '4b85e473-e1fe-44f1-acce-a6d835bd45c0',
    "CATERING": '41ef2138-2d20-45c4-8a3b-3c329ae58e86', 
    "CLEANING": '977a540d-936f-4bfa-9a71-7a66d7f150ea',
    "BOARDING": 'd8e53a64-c202-40f6-aeb1-733ac9222cdd',
    "UNLOADING": '8958e6fc-97b9-4c6c-9f7d-0fe34f797375',
    "LOADING": 'feca186d-caeb-4c74-bfc8-8908320b4154',
    "READYTAKEOFF": 'f79de777-59ca-41d4-b99d-383c1da1f765'
}
def remap_ids(row):
    return simulatorName_to_entityId[row['Name']]

df['entityId'] = df.apply(remap_ids, axis=1)

# re-map alarm status values to match IoT TwinMaker's com.amazon.iottwinmaker.alarm.basic component type
def remap_alarm_status(row):
    if row['Alarming']:
        return 'ACTIVE'
    else:
        return 'NORMAL'

df['alarm_status'] = df.apply(remap_alarm_status, axis=1)
df['AlarmMessage'] = df["Alarm Message"] # Note: no spaces allowed in property names


class RenderIoTTwinMakerDataRow(IoTTwinMakerDataRow):

    def __init__(self, dt, value, property_name, entity_id):
        self.dt = dt
        self.value = value
        self.property_name = property_name
        self.entity_id = entity_id
        pass

    def get_iottwinmaker_reference(self) -> IoTTwinMakerReference:
        # Note: this synthetic data generator is currently specific to CookieLine
        return IoTTwinMakerReference(ecp=EntityComponentPropertyRef(
            entity_id=self.entity_id,
            component_name='AirportDataComponent',
            property_name=self.property_name
        ))

    def get_iso8601_timestamp(self) -> str:
        return self.dt.strftime('%Y-%m-%dT%H:%M:%S.%fZ')

    def get_value(self):
        return self.value

class RenderValuesReader(SingleEntityReader, MultiEntityReader):
    def __init__(self):
        pass

    def entity_query(self, request: IoTTwinMakerUDQEntityRequest) -> IoTTwinMakerUdqResponse:
        return IoTTwinMakerUdqResponse(rows=self._get_data_rows(request))

    def component_type_query(self, request: IoTTwinMakerUDQComponentTypeRequest) -> IoTTwinMakerUdqResponse:
        # Note: this synthetic data generator currently only supports single-entity queries
        #       alarm data will not appear in scenes from GetAlarms query
        return IoTTwinMakerUdqResponse([], None)

    def _get_data_rows(self, request):
        start_dt = request.start_datetime
        end_dt = request.end_datetime
        max_rows = request.max_rows

        data_rows = []

        for selected_property in request.selected_properties:
            df2 = df.copy()
            df2.reset_index()

            '''e.g.
                00 = {dict: 1} {'Speed': 6}
                01 = {dict: 1} {'Speed': 10}
                02 = {dict: 1} {'Speed': 3}
            '''
            data_index = df2[df2['entityId'] == request.entity_id][[selected_property, 'Time']].set_index('Time').to_dict('records')

            # determine the relative start point in the data set to generate synthetic data for, as well as number of data points to return
            epoch_start_in_seconds = start_dt.timestamp()
            sample_time_range_length_in_seconds = (len(data_index) * (DATA_INTERVAL))
            start_interval_bin = epoch_start_in_seconds % sample_time_range_length_in_seconds
            start_interval_bin_in_index = int(start_interval_bin / (DATA_INTERVAL))
            number_of_datapoints = min(max_rows, int((end_dt.timestamp() - start_dt.timestamp()) / (DATA_INTERVAL)))

            # generate data response by repeatedly iterating over the data sample
            curr_dt = datetime.fromtimestamp(int(start_dt.timestamp() / (DATA_INTERVAL)) * (DATA_INTERVAL))
            curr_index = start_interval_bin_in_index
            for i in range(number_of_datapoints):
                dt = curr_dt
                value = data_index[curr_index][selected_property]

                data_rows.append(RenderIoTTwinMakerDataRow(dt, value, selected_property, request.entity_id))

                curr_dt = dt + timedelta(seconds=DATA_INTERVAL)
                curr_index = (curr_index + 1) % len(data_index)

        return data_rows

RENDER_READER = RenderValuesReader()

# Main Lambda invocation entry point
# noinspection PyUnusedLocal
def lambda_handler(event, context):
    print('Event: %s', event)
    result = RENDER_READER.process_query(event)
    print("result:")
    print(result)
    return result

# contains sample test event from a previous UDQ Lambda execution
# used for local testing, not executed by Lambda when deployed
if __name__ == '__main__':
    test_workspace_id = "__FILL_IN__"
    test_event = {'workspaceId': test_workspace_id, 'selectedProperties': ['Resources'], 'startDateTime': 1679465064, 'startTime': '2023-03-22T06:04:24Z', 'endDateTime': 1679551464, 'endTime': '2023-03-23T06:04:24Z', 'properties': {'AlarmMessage': {'definition': {'dataType': {'type': 'STRING'}, 'isTimeSeries': True, 'isRequiredInEntity': False, 'isExternalId': False, 'isStoredExternally': True, 'isImported': False, 'isFinal': False, 'isInherited': False, 'requiredInEntity': False, 'imported': False, 'externalId': False, 'storedExternally': True, 'timeSeries': True, 'inherited': False, 'final': False}}, 'Speed': {'definition': {'dataType': {'type': 'DOUBLE'}, 'isTimeSeries': True, 'isRequiredInEntity': False, 'isExternalId': False, 'isStoredExternally': True, 'isImported': False, 'isFinal': False, 'isInherited': False, 'requiredInEntity': False, 'imported': False, 'externalId': False, 'storedExternally': True, 'timeSeries': True, 'inherited': False, 'final': False}}, 'Temperature': {'definition': {'dataType': {'type': 'DOUBLE'}, 'isTimeSeries': True, 'isRequiredInEntity': False, 'isExternalId': False, 'isStoredExternally': True, 'isImported': False, 'isFinal': False, 'isInherited': False, 'requiredInEntity': False, 'imported': False, 'externalId': False, 'storedExternally': True, 'timeSeries': True, 'inherited': False, 'final': False}}, 'alarm_status': {'definition': {'dataType': {'type': 'STRING', 'allowedValues': [{'stringValue': 'ACTIVE'}, {'stringValue': 'SNOOZE_DISABLED'}, {'stringValue': 'ACKNOWLEDGED'}, {'stringValue': 'NORMAL'}]}, 'isTimeSeries': True, 'isRequiredInEntity': False, 'isExternalId': False, 'isStoredExternally': True, 'isImported': False, 'isFinal': False, 'isInherited': True, 'requiredInEntity': False, 'imported': False, 'externalId': False, 'storedExternally': True, 'timeSeries': True, 'inherited': True, 'final': False}}, 'Resources': {'definition': {'dataType': {'type': 'MAP', 'nestedType': {'type': 'DOUBLE'}}, 'isTimeSeries': True, 'isRequiredInEntity': False, 'isExternalId': False, 'isStoredExternally': True, 'isImported': False, 'isFinal': False, 'isInherited': False, 'requiredInEntity': False, 'imported': False, 'externalId': False, 'storedExternally': True, 'timeSeries': True, 'inherited': False, 'final': False}}, 'telemetryAssetId': {'definition': {'dataType': {'type': 'STRING'}, 'isTimeSeries': False, 'isRequiredInEntity': True, 'isExternalId': True, 'isStoredExternally': False, 'isImported': False, 'isFinal': False, 'isInherited': True, 'requiredInEntity': True, 'imported': False, 'externalId': True, 'storedExternally': False, 'timeSeries': False, 'inherited': True, 'final': False}, 'value': {'stringValue': 'PLASTIC_LINER_23df2a72-30d6-4f8f-bc15-95a8e945b4fa'}}, 'telemetryAssetType': {'definition': {'dataType': {'type': 'STRING'}, 'isTimeSeries': False, 'isRequiredInEntity': True, 'isExternalId': False, 'isStoredExternally': False, 'isImported': False, 'isFinal': False, 'isInherited': True, 'defaultValue': {'stringValue': 'CookieLine'}, 'requiredInEntity': True, 'imported': False, 'externalId': False, 'storedExternally': False, 'timeSeries': False, 'inherited': True, 'final': False}, 'value': {'stringValue': 'CookieLine'}}, 'alarm_key': {'definition': {'dataType': {'type': 'STRING'}, 'isTimeSeries': False, 'isRequiredInEntity': True, 'isExternalId': True, 'isStoredExternally': False, 'isImported': False, 'isFinal': False, 'isInherited': True, 'requiredInEntity': True, 'imported': False, 'externalId': True, 'storedExternally': False, 'timeSeries': False, 'inherited': True, 'final': False}, 'value': {'stringValue': 'PLASTIC_LINER_23df2a72-30d6-4f8f-bc15-95a8e945b4fa'}}}, 'entityId': 'PLASTIC_LINER_a77e76bc-53f3-420d-8b2f-76103c810fac', 'componentName': 'CookieLineComponent', 'maxResults': 100, 'orderByTime': 'ASCENDING'}
    lambda_handler(test_event, None)