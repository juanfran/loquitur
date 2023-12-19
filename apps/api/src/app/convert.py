# from pyannote.audio import Pipeline
# import whisper
import moviepy.editor as moviepy
import json
import sys

import whisperx
import gc

arguments = sys.argv

source = arguments[1]
audioId = arguments[2]
token = arguments[3]

# num_speakers = int(arguments[2])
uploads = "uploads/"
folder = uploads + audioId + "/"
audio = folder + audioId + ".wav"

# speakers = folder + audioId + "-speakers.json"
srt = folder + audioId + "-whisper.json"

# file to > wav
clip = moviepy.VideoFileClip(source)
clip.audio.write_audiofile(audio)

# Init whisper
device = "cuda"
audio_file = audio
batch_size = 16 # reduce if low on GPU mem
compute_type = "float16" # change to "int8" if low on GPU mem (may reduce accuracy)

# 1. Transcribe with original whisper (batched)
model = whisperx.load_model("large-v2", device, compute_type=compute_type)

audio = whisperx.load_audio(audio_file)
result = model.transcribe(audio, batch_size=batch_size)
# print(result["segments"]) # before alignment

# 2. Align whisper output
model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)
result = whisperx.align(result["segments"], model_a, metadata, audio, device, return_char_alignments=False)

# print(result["segments"]) # after alignment

# 3. Assign speaker labels
diarize_model = whisperx.DiarizationPipeline(use_auth_token=token, device=device)

diarize_segments = diarize_model(audio)
result = whisperx.assign_word_speakers(diarize_segments, result)

result_json_string = json.dumps(result["segments"], indent=2)

with open(srt, 'w') as outfile:
    outfile.write(result_json_string)
