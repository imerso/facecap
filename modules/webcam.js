// ====================================================  == =  =
// Provador v1.0
// Written by Vander R. N. Dias, imersiva.com
// ===========================================================  == =  =

export { WebcamCapture };

class WebcamCapture
{
    constructor(video_control, video_width, video_height, ready_callback)
    {
        if (video_control)
        {
            // <video id="video" width="640" height="480" autoplay style="visibility:hidden"></video>
            this.video_control = video_control;
        }
        else
        {
            this.video_control = document.createElement('video');
        }

        this.video_control.width = this.video_width = video_width;
        this.video_control.height = this.video_height = video_height;

        this.Enumerate(ready_callback);
    }


    CreatePlayButton()
    {
        var xrDiv = document.createElement("div");
        xrDiv.style.cssText = "position:absolute; bottom:5vh; right:5vh; color:#FFFF00";
        var xrButton = document.createElement("button");
        var _this = this;
        xrButton.onclick = function() { this.style.visibility='hidden'; _this.video_control.play(); };
        xrButton.innerText = "PLAY";
        xrButton.style.cssText = "width:6vmax; height:4vmax; border:0; border-radius:2vmax; background:#404040; color:#80B080; -moz-opacity:0.7; opacity:0.7; filter:alpha(opacity=70); cursor:pointer";
        xrDiv.appendChild(xrButton);
        document.body.appendChild(xrDiv);
    }


    Start(audio_index, video_index)
    {
        // play webcam
        if (video_index >= this.video_devices.length)
        {
            console.log("There is no video_device " + video_index + " - cannot start webcam.");
            return;
        }
        //console.log("Starting video stream from " + video_index + ": " + this.video_devices[video_index].label);
        //let opt = {
        //    video: {
        //        width: { min: 640, ideal: this.video_width },
        //        height: { min: 480, ideal: this.video_height },
        //        aspectRatio: { ideal: 1.7777777778 },
        //        frameRate: { max: 30 },
        //        facingMode: "user",
        //        sourceId: this.video_devices[video_index].deviceId
        //    }
        //};
        let opt =
        {
            video:
            {
                maxWidth: this.video_width,
                maxHeight: this.video_height,
                facingMode: "user",
                sourceId: this.video_devices[video_index].deviceId,
            }
        };
        var _this = this;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        {
            navigator.mediaDevices.getUserMedia(opt).then(function(stream)
            {
                _this.stream = stream;
                _this.video_control.srcObject = stream;
                _this.video_control.play();

                //let settings = stream.getVideoTracks()[0].getSettings();
                //let str = JSON.stringify(settings, null, 4);
                //alert('settings ' + str);
            });
        }
        else alert("Cannot get mediaDevices");
    }


    Stop()
    {
        this.stream.getTracks().forEach(function(track)
        {
            track.stop();
        });
    }


    Enumerate(ready_callback)
    {
        //console.log("Enumerating...");

        this.audio_devices = [];
        this.video_devices = [];
        var _this = this;

        navigator.mediaDevices.enumerateDevices()
        .then(function(devices)
        {
            //console.log(devices.length + " devices found:");
            devices.forEach(function(device)
            {
                if (device.kind === 'audioinput')
                {
                    //console.log("[" + _this.audio_devices.length + "] audio: " + (device.label || 'microphone'));
                    _this.audio_devices.push(device);
                }
                else if (device.kind === 'videoinput')
                {
                    //console.log("[" + _this.video_devices.length + "] video: " + (device.label || 'camera'));
                    _this.video_devices.push(device);
                }
                else
                {
                    //console.log("(unknown) " + device.kind + ": [" + device.label + "]");
                }

                //console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
            });

            ready_callback();
        });

        //.catch(function(err)
        //{
        //    console.log("Erro: " + err.name + ": " + err.message);
        //});
    }
}

