# Loquitur

## Requirements

Python 3.10

[Conda](https://docs.conda.io/en/latest/)

https://github.com/m-bain/whisperX

Install

conda create --name loquitur python=3.10

# Installation

virtualenv loquitur

source loquitur/bin/activate

pip install torch==2.0.0 torchaudio==2.0.0 torchvision==2.0.0 moviepy==1.0.3 --extra-index-url https://download.pytorch.org/whl/cu118

pip install git+https://github.com/m-bain/whisperx.git

best follow whisper guide

cp .env.sample .env

and edit .env
