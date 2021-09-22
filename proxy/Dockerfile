FROM python:3.8-slim-buster

WORKDIR /proxy

ADD template/main.py /proxy
ADD libraries/Communication /proxy
ADD libraries/data_transfer /proxy
ADD libraries/data_structure /proxy

ADD requirements.txt  /proxy

RUN pip install -r requirements.txt

CMD ["python3", "./main.py"]
