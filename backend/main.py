import os
# CRITICAL: Prevent ONNX from allocating massive thread pools which cause silent SIGKILL Out of Memory crashes on 512MB free tiers.
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["RAYON_NUM_THREADS"] = "1"

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from rembg import remove, new_session
from io import BytesIO
from PIL import Image, ImageOps

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model_session = None

def get_session():
    global model_session
    if model_session is None:
        model_session = new_session("silueta")
    return model_session

@app.post("/remove-bg")
def remove_bg(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type.")
    
    try:
        # Load the image and correct its orientation (iPhone EXIF data)
        img = Image.open(file.file)
        img = ImageOps.exif_transpose(img)
        
        # OOM PREVENTER: Max dimension 2048px. 
        # A 12-Megapixel iPhone photo converts to a ~150MB raw tensor array in memory. 
        # When ONNX clones that tensor, it immediately exceeds the 512MB Render limit.
        # We only apply this limit if the code is running on Render's servers.
        max_size = 2048
        is_render = os.environ.get("RENDER") is not None
        if is_render and (img.width > max_size or img.height > max_size):
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
        # Convert back to bytes for rembg
        in_io = BytesIO()
        img.save(in_io, format="PNG")
        input_bytes = in_io.getvalue()
        
        session = get_session()
        
        # Premium Edge Configuration
        result_bytes = remove(
            input_bytes,
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10,
            post_process_mask=True
        )
        
        out_img = Image.open(BytesIO(result_bytes))
        out_io = BytesIO()
        out_img.save(out_io, format="WEBP", lossless=True)
        out_io.seek(0)
        
        return StreamingResponse(out_io, media_type="image/webp")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))