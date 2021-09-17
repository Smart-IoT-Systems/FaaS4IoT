FROM python:3.7-slim

WORKDIR /proxy

ADD template/main.py /proxy
ADD libraries/Communication /proxy
ADD libraries/data_transfer /proxy
ADD libraries/data_structure /proxy

ADD requirements.txt  /proxy

RUN pip install -r requirements.txt

ENV $env:PYTHONPATH += ";~/Desktop/FaaS4IoT/proxy/libraries/Communication"
ENV $env:PYTHONPATH += ";~/Desktop/FaaS4IoT/proxy/libraries/data_structure"
ENV $env:PYTHONPATH += ";~/Desktop/FaaS4IoT/proxy/libraries/data_transfer"

CMD ["python", "./main.py"]
