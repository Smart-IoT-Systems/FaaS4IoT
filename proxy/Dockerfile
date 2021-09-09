FROM python:3.7-slim

WORKDIR /proxy

COPY . .

ADD template/main.py /proxy
ADD build /proxy
ADD libraries/Communication/serial_comm.py /proxy
ADD libraries/data_structure/CSV_to_NGSI.py /proxy
ADD libraries/data_transfer/mqtt_transfer.py /proxy

CMD ["python", "./main.py"]
