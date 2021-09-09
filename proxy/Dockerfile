FROM python:3.7-slim

WORKDIR /proxy

COPY . .

ADD main.py /proxy
ADD  build /proxy

CMD ["python", "./main.py"]