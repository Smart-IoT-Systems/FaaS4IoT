FROM python:3.8-slim-buster

WORKDIR /simpleProxy

ADD main.py /simpleProxy
ADD FaaS4IoT/proxy/libraries/Communication /simpleProxy
ADD FaaS4IoT/proxy/ libraries/data_transfer /simpleProxy
ADD FaaS4IoT/proxy/libraries/data_structure /simpleProxy

ADD requirements.txt  /simpleProxy

RUN pip install -r requirements.txt

CMD ["python3", "./main.py"]
