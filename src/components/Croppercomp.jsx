import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "../contentcss.css";


function Croppercomp({
  viewportScreenshot,
  setCroppedImage,
  setIsDialogOpen,
  setViewportScreenshot,
  sethidechatbox
}) {
  const cropperRef = useRef(null);

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedCanvas = cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImageUrl = croppedCanvas.toDataURL("image/png");
        setCroppedImage(croppedImageUrl);
      }
    }
    sethidechatbox(false);
    setIsDialogOpen(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setViewportScreenshot(null);
    setCroppedImage(null);
    sethidechatbox(false);
  };

  return (
    <div
    className="revibe-cropper-modal"
    style={{ backdropFilter: "blur(2px)" }}
  >
    <div className="revibe-cropper-dialog">
      <h2 className="revibe-cropper-title">Select Image</h2>
      <p className="revibe-note"><strong>Note: </strong>Scroll to zoom and click outside the selection to Drag Image.</p>
      <Cropper
        ref={cropperRef}
        src={viewportScreenshot}
        style={{ height: "300px", width: "100%" }}
        movable={true}
        zoom={0}
        guides={true}
        viewMode={1}
        autoCropArea={1}
        responsive={true}
        checkOrientation={false}
      />
  
      <button
        onClick={handleCrop}
        className="revibe-cropper-ok-button"
      >
        Ok
      </button>
      <button
        onClick={closeDialog}
        className="revibe-cropper-close-button"
      >
        Close
      </button>
    </div>
  </div>
  );
}

export default Croppercomp;
