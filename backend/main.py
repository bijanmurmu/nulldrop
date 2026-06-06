from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from rembg import remove, new_session
from io import BytesIO
from PIL import Image
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# LAZY LOADING: We don't initialize the model globally anymore.
# Initializing globally causes Render's 60-second port scan to timeout because 
# downloading the AI weights blocks the server from starting.
model_session = None

def get_session():
    global model_session
    if model_session is None:
        try:
            # Try to load Bria AI (State of the art)
            model_session = new_session("briarmbg1.4")
        except Exception:
            # Render Free Tier only has 512MB RAM. 'isnet' (179MB) causes an Out-Of-Memory SIGKILL.
            # 'silueta' is a highly-optimized 43MB model that retains fantastic edge precision
            # while easily fitting inside strict cloud memory constraints.
            model_session = new_session("silueta")
    return model_session

@app.post("/remove-bg")
def remove_bg(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    try:
        input_image = file.file.read()
        
        session = get_session()
        
        # Premium Edge Detection Configuration
        result_bytes = remove(
            input_image,
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10,
            post_process_mask=True
        )
        
        # Optimize size without losing quality using Lossless WEBP
        img = Image.open(BytesIO(result_bytes))
        out_io = BytesIO()
        img.save(out_io, format="WEBP", lossless=True)
        out_io.seek(0)
        
        return StreamingResponse(out_io, media_type="image/webp")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")