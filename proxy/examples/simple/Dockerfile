FROM python:3.8-slim-buster

WORKDIR /simpleProxy

ADD main.py /simpleProxy
ADD libraries/communication /simpleProxy
ADD libraries/data_transfer /simpleProxy
ADD libraries/data_structure /simpleProxy

ADD requirements.txt  /simpleProxy

RUN pip install -r requirements.txt

CMD ["python3", "./main.py"]
