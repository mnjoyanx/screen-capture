// const videoSelector = document.getElementById('video')
// const startSelector = document.getElementById('start')
// const stopSelector = document.getElementById('stop')
// const downloadSelector = document.getElementById('download')

// const options = {
//     video: {
//         cursor: "always"
//     },
//     audio: false
// }


// startSelector.addEventListener('click', () => {
//     startCapture()
// })

// stopSelector.addEventListener('click', () => {
//     stopCapture()
// })

// async function startCapture() {
//     try {
//         video.srcObject = await navigator.mediaDevices.getDisplayMedia(options)
//     } catch (err) {
//         console.error(err)
//     }
// }

// async function stopCapture() {
//     const tracks = await video.srcObject.getTracks()
//     if (tracks) {
//         tracks.forEach(track => {
//             track.stop()
//         });
//         video.srcObject = null
//     }
        
// }


// downloadSelector.addEventListener('click', () => {
//     download('jjj')
// })





/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const stop = document.querySelector('button#stop');
const recordScreen = document.querySelector('button#screen')
const recordButton = document.querySelector('button#record');
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');


recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Record') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Record';
    playButton.disabled = false;
    downloadButton.disabled = false;
  }
});


playButton.addEventListener('click', () => {
  const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});

// Download
downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.mp4';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}


function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
}

async function init(constraints, type) {
    try {
        let stream 
        if (type == 'camera') {
             stream = await navigator.mediaDevices.getUserMedia(constraints); 
        }  else if (type == 'screen') {
             stream = await navigator.mediaDevices.getDisplayMedia(constraints);    
      }
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
  }
}

document.querySelector('button#start').addEventListener('click', async () => {
  const constraints = {
    audio: true,
    video: {
      width: 580, height: 420
    }
  };
    
    const type = 'camera'
  await init(constraints, type);
});


recordScreen.addEventListener('click', async () => {
    const constraints = {
    audio: true,
    video: {
      width: 580, height: 420
    }
    };
    const type = 'screen'
  await init(constraints, type);
})



// stop.addEventListener('click', async () => {
// const tracks = await recordedVideo.srcObject.getTracks()
//     if (tracks) {
//         tracks.forEach(track => {
//             track.stop()
//         });
//         recordedVideo.srcObject = null
//     }
// })