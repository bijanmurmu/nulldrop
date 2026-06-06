from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from rembg import remove, new_session
from io import BytesIO
from PIL import Image

app = FastAPI()

# Attempt to load the state-of-the-art Bria AI model (briarmbg1.4)
# This model provides commercially perfect edge detection and handles hair/fur natively better than older models.
# If unavailable in the current rembg version, fallback to the high-precision ISNet model.
try:
    model_session = new_session("briarmbg1.4")
except Exception:
    model_session = new_session("isnet-general-use")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-bg")
def remove_bg(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    try:
        input_image = file.file.read()
        
        # Premium Edge Detection Configuration:
        # - alpha_matting: True (allows semi-transparent edges for hair/fur)
        # - foreground_threshold: 240 (only the most confident pixels are solid foreground)
        # - background_threshold: 10 (highly strict background threshold to prevent haloing)
        # - erode_size: 10 (reduced from 15 to prevent aggressively eating into the subject's rigid edges)
        # - post_process_mask: True (removes noise and disconnected floating artifacts)
        result_bytes = remove(
            input_image,
            session=model_session,
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