//import * as canvas from 'canvas';
const canvas = require("canvas")
//import * as faceapi from 'face-api.js';
const faceapi = require("face-api.js")
require('@tensorflow/tfjs-node');
const REFERENCE_IMAGE = './images/image1.jpg'
const QUERY_IMAGE = './images/image2.jpg'
const QUERY_IMAGE2 = './images/image3.jpg'
const YESSER1 = './images/CVYesser.jpg'
const NIGYESSER = "./images/niggaYesser.png"
const HEARTYESSER = "./images/heartYesser.jpg"
const YESSER3 = "./images/handYesser.jpg"
const YESSER4 = "./images/nowYesser2.jpg"
const YESSER5 = "./images/nowYesser3.jpg"
const YESSER6 = "./images/nowYesser.jpg"
const rock = "./images/theRock.jpg"
const fatrock = "./images/fatRock.jpg"
const GUN = "./images/angry.jpg"
const GUN2 = "./images/laHaine.jpg"
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
const run = async ()=>{
    const referenceImage = await canvas.loadImage(YESSER4)
    const queryImage = await canvas.loadImage(rock)
    const queryImage2 = await canvas.loadImage(YESSER5)
    console.log("starting");
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights')
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./weights')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights')
    console.log("intialized the net");

    //generate descriptorasdas
    const results = await faceapi
    .detectSingleFace(referenceImage)
    .withFaceLandmarks()
    .withFaceDescriptor()
    if (!results) {
        console.log("no face found");
        return ;
    }
    console.log("went through the reference");
    //generate matcher with that descriptor
    const faceMatcher = new faceapi.FaceMatcher(results)
    
    
    const singleResult = await faceapi
    .detectSingleFace(queryImage)
    .withFaceLandmarks()
    .withFaceDescriptor()
    
    console.log("went through the query");
    if (singleResult) {
        const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
        console.log(bestMatch)
      }else{
          console.log("no face found");
      }
    const resu2 = await faceapi
        .detectSingleFace(queryImage2)
        .withFaceLandmarks()
        .withFaceDescriptor()
    console.log("resu 2 :");
    if (resu2) {
        const bestMatch2 = faceMatcher.findBestMatch(resu2.descriptor)
        console.log(bestMatch2.toString())
    }
}
run()