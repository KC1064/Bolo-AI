import torch
import numpy as np
from scipy.io.wavfile import write as write_wav

# Store the original torch.load function
_original_torch_load = torch.load


# Create a wrapper that forces weights_only=False
def _patched_torch_load(
    f, map_location=None, pickle_module=None, weights_only=None, **kwargs
):
    return _original_torch_load(
        f,
        map_location=map_location,
        pickle_module=pickle_module,
        weights_only=False,
        **kwargs
    )


# Apply the monkey patch
torch.load = _patched_torch_load

# Now import Bark (this must be done after the patch)
from bark import SAMPLE_RATE, generate_audio, preload_models

print("-------------------Loading models-------------------")
# download and load all models
preload_models()

print("-------------------Models loaded successfully!-------------------")

# generate audio from text
text_prompt = """
     Hi, I'm Kironmay Mishra, a Final Year B.Tech student specializing in Computer Science. With a strong foundation in both frontend and backend development, I am passionate about building scalable and user-friendly web applications.
On the frontend, I specialize in React.js, Next.js, TypeScript, Material UI (MUI), Shadcn UI, and animation libraries like GSAP and Framer Motion to create dynamic and engaging user interfaces. On the backend, I have hands-on experience with Node.js, Express.js, and FastAPI, enabling me to work across the full stack.
I have actively worked on several projects and continuously explore modern web technologies to improve performance, user experience, and maintainability. I’m currently seeking opportunities to work as a Frontend Developer, where I can contribute to innovative products and grow alongside a talented team.
In academics, I scored 91 percentage in Class 12, with core subjects including Physics, Chemistry, Mathematics, and Computer Science, reflecting my strong analytical and logical thinking skills.
"""

print("-------------------Generating audio-------------------")
audio_array = generate_audio(text_prompt)

# save audio to disk
write_wav("intro.wav", SAMPLE_RATE, audio_array)

print("-------------------Audio generated successfully and saved as 'bark_generation.wav'-------------------")

# Restore original torch.load (optional, good practice)
torch.load = _original_torch_load

