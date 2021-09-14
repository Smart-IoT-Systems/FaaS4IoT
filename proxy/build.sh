#!/bin/sh
START export PYTHONPATH=$PYTHONPATH:/proxy/libraries/Communication
START export PYTHONPATH=$PYTHONPATH:/proxy/libraries/data_structure
START export PYTHONPATH=$PYTHONPATH:/proxy/libraries/data_transfer
START docker build -t "proxy-faas4iot" .
