FROM python:3.8-slim-buster

WORKDIR /standardizedProxy

ADD main.py /standardizedProxy
ADD FaaS4IoT/proxy/libraries/Communication /standardizedProxy
ADD FaaS4IoT/proxy/ libraries/data_transfer /standardizedProxy
ADD FaaS4IoT/proxy/libraries/data_structure /standardizedProxy

ADD requirements.txt  /standardizedProxy

RUN pip install -r requirements.txt

CMD ["python3", "./main.py"]
