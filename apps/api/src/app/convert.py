import moviepy.editor as moviepy
import json
import sys
import os
import whisperx
import gc
from PIL import Image

arguments = sys.argv

source = arguments[1]
audioId = arguments[2]
token = arguments[3]

# num_speakers = int(arguments[2])
uploads = "uploads/"
folder = uploads + audioId + "/"
audio = folder + audioId + ".wav"
video = folder + audioId + ".webm"
frame_path = folder + audioId + ".webp"

# speakers = folder + audioId + "-speakers.json"
srt = folder + audioId + "-whisper.json"

# file to > wav
clip = moviepy.VideoFileClip(source)
clip.write_videofile(video,fps=25)
clip.audio.write_audiofile(audio)

frame = clip.get_frame(int(clip.duration) / 2)
image = Image.fromarray(frame)

image_size = 150

scale = image_size / image.size[0]
height = int(image.size[1] * scale)
image = image.resize((image_size, height))
image.save(frame_path)

os.remove(source)

# Init whisper
device = "cuda"
audio_file = audio
batch_size = 16 # reduce if low on GPU mem
compute_type = "float16" # change to "int8" if low on GPU mem (may reduce accuracy)

# 1. Transcribe with original whisper (batched)
model = whisperx.load_model("large-v2", device, compute_type=compute_type)

audio = whisperx.load_audio(audio_file)
result = model.transcribe(audio, batch_size=batch_size)

# 2. Align whisper output
model_a, metadata = whisperx.load_align_model(language_code=result["language"], device=device)
result = whisperx.align(result["segments"], model_a, metadata, audio, device, return_char_alignments=False)

# 3. Assign speaker labels
diarize_model = whisperx.DiarizationPipeline(use_auth_token=token, device=device)

diarize_segments = diarize_model(audio)
result = whisperx.assign_word_speakers(diarize_segments, result)

result_json_string = json.dumps(result["segments"], indent=2)

with open(srt, 'w') as outfile:
    outfile.write(result_json_string)

# 4. Create metadata
speakers = set()

for whisper in result["segments"]:
    for word in whisper['words']:
        if 'speaker' in word:
            speakers.add(word['speaker'])

metadata_json = folder + "metadata.json"
metadata = {
  "duration": int(clip.duration),
  "speakers": list(speakers),
}
metadata_json_string = json.dumps(metadata, indent=2)

with open(metadata_json, 'w') as outfile:
  outfile.write(metadata_json_string)

