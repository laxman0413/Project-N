const cloudinary=require('cloudinary').v2;
const multer=require('multer');
const {CloudinaryStorage}=require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:"dqaae7lih",
    api_key:"596499974752986",
    api_secret:"_wWU1_kSt-b6nE2RA8Plsf7HuK4"
})


const clstorage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'profilepic',
        public_id:(request,file)=>file.filename+"-"+Date.now()
    }
})

let multerObj=multer({storage:clstorage})

module.exports=multerObj;

