FROM python:3.7-slim

WORKDIR /proxy

COPY . .

ADD template/main.py /proxy
ADD build.sh /proxy
RUN chmod +x ./build.sh
RUN sh build.sh
CMD ["python", "./main.py"]
