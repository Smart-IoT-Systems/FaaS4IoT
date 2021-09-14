FROM python:3.7-slim

WORKDIR /proxy

COPY . .

RUN chmod 777 /build.sh
RUN bash "./build.sh"

CMD ["python", "./main.py"]
