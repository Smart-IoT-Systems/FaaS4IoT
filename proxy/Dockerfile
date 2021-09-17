FROM python:3.7-slim

WORKDIR /proxy

ADD template/main.py /proxy
ADD ./libraries /proxy
ADD requirements.txt  /proxy

RUN pip install -r requirements.txt

ENV PYTHONPATH=$PYTHONPATH:~/Desktop/FaaS4IoT/proxy/libraries/Communication
ENV PYTHONPATH=$PYTHONPATH:~/Desktop/FaaS4IoT/proxy/libraries/data_structure
ENV PYTHONPATH=$PYTHONPATH:~/Desktop/FaaS4IoT/proxy/libraries/data_transfer

CMD ["python", "./main.py"]
