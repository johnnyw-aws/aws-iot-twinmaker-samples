# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
# SPDX-License-Identifier: Apache-2.0

from udq_utils.udq import SingleEntityReader, MultiEntityReader, IoTTwinMakerDataRow, IoTTwinMakerUdqResponse
from udq_utils.udq_models import IoTTwinMakerUDQEntityRequest, IoTTwinMakerUDQComponentTypeRequest, OrderBy, IoTTwinMakerReference, \
    EntityComponentPropertyRef
from datetime import datetime, timedelta
import json
import pandas as pd

# for debugging
# pd.set_option('display.max_rows', 500)
# pd.set_option('display.max_columns', 500)
# pd.set_option('display.width', 1000)

# read the telemetry data sample into a pandas dataframe for serving queries
data = []
with open('telemetryData.json', 'r') as f:
    lines = f.readlines()
    for line in lines:
        data.append(json.loads(line.strip()))

df = pd.DataFrame(data)

# mapping of entity names to entity_ids for CookieLine1 telemetry data
simulatorName_to_entityId = {
    "plasticLiner": "PLASTIC_LINER_23df2a72-30d6-4f8f-bc15-95a8e945b4fa",
    "boxErector": "BOX_ERECTOR_c750322d-bd83-4a17-8b9c-acfa62ed6d64",
    "labelingBelt": "LABELING_BELT_a507db85-2d94-48d7-b7e0-a205c1b5b509",
    "freezingTunnel": "FREEZER_TUNNEL_c726a21e-8fd4-4210-b71e-0ef9acc59d97",
    "boxSealer": "BOX_SEALER_91bceabc-ef3f-4783-a080-10fa25557ff8",
    "cookieFormer": "COOKIE_FORMER_e87acad2-1852-4f98-891f-c8f9a3eb7dd4",
    "conveyorRight": "CONVEYOR_RIGHT_TURN_54972194-9394-4158-a122-138a7e4a6654",
    "verticalConveyor": "VERTICAL_CONVEYOR_a10ee21c-c859-4d73-b0bb-396daaf02335",
    "conveyorLeft": "CONVEYOR_LEFT_TURN_d2e72da9-3333-4a24-9e23-0dd64a829c94",
}
def remap_ids(row):
    return simulatorName_to_entityId[row['Name']]

df['entityId'] = df.apply(remap_ids, axis=1)

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
            component_name='CookieLineComponent',
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
            sample_time_range_length_in_seconds = (len(data_index) * (60*5))
            start_5s_bin = epoch_start_in_seconds % sample_time_range_length_in_seconds
            start_5s_bin_in_index = int(start_5s_bin / (60*5))
            number_of_datapoints = int((end_dt.timestamp() - start_dt.timestamp()) / (60*5))

            # generate data response by repeatedly iterating over the data sample
            curr_dt = datetime.fromtimestamp(int(start_dt.timestamp() / (60*5)) * (60*5))
            curr_index = start_5s_bin_in_index
            for i in range(number_of_datapoints):
                dt = curr_dt
                value = data_index[curr_index][selected_property]

                data_rows.append(RenderIoTTwinMakerDataRow(dt, value, selected_property, request.entity_id))

                curr_dt = dt + timedelta(minutes=5)
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
    test_event = {'workspaceId': test_workspace_id, 'selectedProperties': ['Resources'], 'startDateTime': 1679465064, 'startTime': '2023-03-22T06:04:24Z', 'endDateTime': 1679551464, 'endTime': '2023-03-23T06:04:24Z', 'properties': {'AlarmMessage': {'definition': {'dataType': {'type': 'STRING'}, 'isTimeSeries': True, 'isRequiredInEntity': False, 'isExternalId': False, 'isStoredExternally': True, 'isImported': False, 'isFinal': False, 'isInherited': False, 'requiredInEntity': False, 'imported': False, 'externalId': False, 'storedExternally': True, 'timeSeries': True, 'inherited': False, 'final': False}}, 'Speed': {'definition': {'dataType': {'type': 'DOUBLE'}, 'isTimeSeries': True, 'isRequiredInEntity': False, 'isExternalId': False, 'isStoredExternally': True, 'isImported': False, 'isFinal': False, 'isInherited': False, 'requiredInEntity': False, 'imported': False, 'externalId': False, 'storedExternally': True, 'timeSeries': True, 'inherited': False, 'final': False}}, 'Temperature': {'definition': {'dataType': {'type': 'DOUBLE'}, 'isTimeSeries': True, 'isRequiredInEntity': False, 'isExternalId': False, 'isStoredExternally': True, 'isImported': False, 'isFinal': False, 'isInherited': False, 'requiredInEntity': False, 'imported': False, 'externalId': False, 'storedExternally': True, 'timeSeries': True, 'inherited': False, 'final': False}}, 'alarm_status': {'definition': {'dataType': {'type': 'STRING', 'allowedValues': [{'stringValue': 'ACTIVE'}, {'stringValue': 'SNOOZE_DISABLED'}, {'stringValue': 'ACKNOWLEDGED'}, {'stringValue': 'NORMAL'}]}, 'isTimeSeries': True, 'isRequiredInEntity': False, 'isExternalId': False, 'isStoredExternally': True, 'isImported': False, 'isFinal': False, 'isInherited': True, 'requiredInEntity': False, 'imported': False, 'externalId': False, 'storedExternally': True, 'timeSeries': True, 'inherited': True, 'final': False}}, 'Resources': {'definition': {'dataType': {'type': 'MAP', 'nestedType': {'type': 'DOUBLE'}}, 'isTimeSeries': True, 'isRequiredInEntity': False, 'isExternalId': False, 'isStoredExternally': True, 'isImported': False, 'isFinal': False, 'isInherited': False, 'requiredInEntity': False, 'imported': False, 'externalId': False, 'storedExternally': True, 'timeSeries': True, 'inherited': False, 'final': False}}, 'telemetryAssetId': {'definition': {'dataType': {'type': 'STRING'}, 'isTimeSeries': False, 'isRequiredInEntity': True, 'isExternalId': True, 'isStoredExternally': False, 'isImported': False, 'isFinal': False, 'isInherited': True, 'requiredInEntity': True, 'imported': False, 'externalId': True, 'storedExternally': False, 'timeSeries': False, 'inherited': True, 'final': False}, 'value': {'stringValue': 'PLASTIC_LINER_23df2a72-30d6-4f8f-bc15-95a8e945b4fa'}}, 'telemetryAssetType': {'definition': {'dataType': {'type': 'STRING'}, 'isTimeSeries': False, 'isRequiredInEntity': True, 'isExternalId': False, 'isStoredExternally': False, 'isImported': False, 'isFinal': False, 'isInherited': True, 'defaultValue': {'stringValue': 'CookieLine'}, 'requiredInEntity': True, 'imported': False, 'externalId': False, 'storedExternally': False, 'timeSeries': False, 'inherited': True, 'final': False}, 'value': {'stringValue': 'CookieLine'}}, 'alarm_key': {'definition': {'dataType': {'type': 'STRING'}, 'isTimeSeries': False, 'isRequiredInEntity': True, 'isExternalId': True, 'isStoredExternally': False, 'isImported': False, 'isFinal': False, 'isInherited': True, 'requiredInEntity': True, 'imported': False, 'externalId': True, 'storedExternally': False, 'timeSeries': False, 'inherited': True, 'final': False}, 'value': {'stringValue': 'PLASTIC_LINER_23df2a72-30d6-4f8f-bc15-95a8e945b4fa'}}}, 'entityId': 'PLASTIC_LINER_23df2a72-30d6-4f8f-bc15-95a8e945b4fa', 'componentName': 'CookieLineComponent', 'maxResults': 100, 'orderByTime': 'ASCENDING'}
    lambda_handler(test_event, None)