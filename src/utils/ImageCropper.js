import React, { useState } from "react";
import Cropper from "react-easy-crop";

function ImageCropper(props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(4 / 3);

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const onAspectRatioChange = (event) => {
        setAspectRatio(event.target.value);
    };
    // Handle Cancel Button Click
    const onCropCancel = () => {
        props.cancelCropImage();
    };

    // Function to convert Data URL to Blob
    function dataURLtoBlob(dataUrl) {
    const parts = dataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
    }

    // Generating Cropped Image When Done Button Clicked
    const onCropDone = (imgCroppedArea) => {
        const canvasEle = document.createElement("canvas");
        canvasEle.width = imgCroppedArea.width;
        canvasEle.height = imgCroppedArea.height;

        const context = canvasEle.getContext("2d");

        let imageObj1 = new Image();
        imageObj1.src = props.image;
        imageObj1.onload = function () {
            context.drawImage(
                imageObj1,
                imgCroppedArea.x,
                imgCroppedArea.y,
                imgCroppedArea.width,
                imgCroppedArea.height,
                0,
                0,
                imgCroppedArea.width,
                imgCroppedArea.height
            );
            const dataURL = canvasEle.toDataURL("image/jpeg");
            // Convert Data URL to Blob
            const blob = dataURLtoBlob(dataURL);

            // Create a File from Blob
            const imageFile = new File([blob], 'image.png', { type: 'image/png' });
            props.cropImage({data_url: dataURL, file: imageFile});
        };
    };

    return (
        <div className="cropper">
            <div>
                <Cropper
                    image={props.image}
                    aspect={aspectRatio}
                    crop={crop}
                    zoom={zoom}
                    cropShape='rect'
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    style={{
                        containerStyle: {
                          width: "100%",
                          height: "80%",
                        },
                      }}
                />
            </div>

            <div>
                <div className="aspect-ratios" onChange={onAspectRatioChange}>
                    <div className="radio">
                        <input id="radio-1" value={1 / 1} name="ratio" type="radio"/>
                        <label for="radio-1" className="radio-label">1:1</label>
                    </div>
                    <div className="radio">
                        <input id="radio-2" value={5 / 4} name="ratio" type="radio"/>
                        <label for="radio-2" className="radio-label">5:4</label>
                    </div>
                    <div className="radio">
                        <input id="radio-3" value={4 / 3} name="ratio" type="radio"/>
                        <label for="radio-3" className="radio-label">4:3</label>
                    </div>
                    <div className="radio">
                        <input id="radio-4" value={3 / 2} name="ratio" type="radio"/>
                        <label for="radio-4" className="radio-label">3:2</label>
                    </div>
                    <div className="radio">
                        <input id="radio-5" value={5 / 3} name="ratio" type="radio"/>
                        <label for="radio-5" className="radio-label">5:3</label>
                    </div>
                    <div className="radio">
                        <input id="radio-6" value={16 / 9} name="ratio" type="radio"/>
                        <label for="radio-6" className="radio-label">16:9</label>
                    </div>
                    <div className="radio">
                        <input id="radio-7" value={3 / 1} name="ratio" type="radio"/>
                        <label for="radio-7" className="radio-label">3:1</label>
                    </div>
                </div>
                <div className="action-btns">
                <button className="btn" onClick={onCropCancel}>
                    Cancel
                </button>
                <button className="btn" onClick={() => { onCropDone(croppedArea);}}>Done</button>
                </div>
            </div>
        </div>
    );
}

export default ImageCropper;