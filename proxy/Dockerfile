FROM python:3.7-slim

WORKDIR /proxy

ADD template/main.py /proxy
ADD ./libraries /proxy

ENV PYTHONPATH=$PYTHONPATH:~/proxy/libraries/Communication
ENV PYTHONPATH=$PYTHONPATH:~/proxy/libraries/data_structure
ENV PYTHONPATH=$PYTHONPATH:~/proxy/libraries/data_transfer

CMD ["python", "./main.py"]
