FROM python:3.8-slim-buster

WORKDIR /standardizedProxy

ADD main.py /standardizedProxy
ADD libraries/communication /standardizedProxy
ADD libraries/data_transfer /standardizedProxy
ADD libraries/data_structure /standardizedProxy

ADD requirements.txt  /standardizedProxy

RUN pip install -r requirements.txt

CMD ["python3", "./main.py"]
