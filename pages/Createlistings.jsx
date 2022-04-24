import React from 'react'
import {useState,useEffect,useRef} from 'react'
import {getAuth,onAuthStateChanged} from 'firebase/auth'
import {useNavigate} from 'react-router-dom'

import {addDoc,collection,serverTimestamp} from 'firebase/firestore'

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {db} from '../firebase.config'

import {v4 as uuidv4} from 'uuid'
import { toast } from 'react-toastify';

function Createlistings() {
    const [geoLocationEnabled,setgeoLocationEnabled]=useState(true)

    const [formData,setFormData]=useState({
        type:'rent',
        name:'emmpty',
        bedrooms:1,
        bathrooms:1,
        parking:false,
        furnished:false,
        address:'',
        offer:false,
        regularPrice:0,
        discountedPrice:0,
        images:{},
        latitude:0,
        longitude:0

    })

    const {type,name,bedrooms,bathrooms,parking,furnished,address,offer,regularPrice,discountedPrice,images,latitude,longitude}=formData


    const auth=getAuth()
        const navigate=useNavigate()
        const isMounted=useRef(true)
        useEffect(()=>{
            if(isMounted){
                onAuthStateChanged(auth,(user)=>{

                    if(user){
                        setFormData({...formData,userRef:user.uid})

                    }else{

                        navigate('/sign-in')


                    }

                })

            }
            return ()=>{
                isMounted.current=false
            }
           
        },[isMounted])

        const onSubmit= async(e)=>{
            e.preventDefault()

            
        const storeImage=async (image)=>{
            return new Promise((resolve,reject)=> {
                const storage=getStorage()
                const fileName=`${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef=ref(storage,'images/'+fileName)


                const uploadTask=uploadBytesResumable(storageRef,image)

                uploadTask.on('state_changed', 
  (snapshot) => {
  
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    reject(error)
  }, 
  () => {
   
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL)
    });
  }
);

            })
        }
        
        const imgUrls = await  Promise.all(
            [...images].map((image)=> storeImage(image))

        ).catch(()=>{
            toast.error('image not found')
            return 

        })
    

        



        const formDataCopy={
            ...formData,
            imgUrls,
            timestamp:serverTimestamp(),


        }
        delete formDataCopy.images
        !formDataCopy.offer &&delete formDataCopy.discountedPrice

        const docRef=await addDoc(collection(db,'listings'),formDataCopy)

        toast.success('listings added')

        navigate(`/category/${formDataCopy.type}/${docRef.id}`)

        }
        //store images





        
        
    



    
        const onMutate=(e)=>{
            let boolean=null

            if(e.target.value==='true'){
                boolean=true
            }
            
            if(e.target.value==='false'){
                boolean=false
            }

            //files
            if(e.target.files){
                setFormData((prevState)=>({
                    ...prevState,
                    images:e.target.files


                }))
            }
            //text boolean number

            if(!e.target.files){
                setFormData((prevState)=>({
                    ...prevState,
                    [e.target.id]:boolean?? e.target.value
                }))
            }

        }
    
  return (
    <div className='profile'>
        <header>

            <p className='pageheader'>Create a Listing</p>
        </header>

        <main>

            <form onSubmit={onSubmit}>
                <label className='formLabel' htmlFor="">Sell/Rent</label>
                <div className='formButtons'>
                    <button type='button' className={type==='sale' ? 'formButtonActive' :'formButton'} id='type'  value='sale' onClick={onMutate}>Sale</button>
                    <button type='button' className={type==='rent' ? 'formButtonActive' :'formButton'} id='type'  value='rent' onClick={onMutate}>Rent</button>
                    </div> 

                <label className='formLabel'>Name</label>
                <input type="text" className='formInputName' id='name' value={name} onChange={onMutate} maxLength='32' minLength='10' required/>

            <div className='formRooms flex'>
<div>

    <label htmlFor="" className='formLabel'>Bedrooms</label>
    <input className='formInputSmall' type="number" value={bedrooms} id="bedrooms" onChange={onMutate} min='1' max='50' required />
</div>
<div>
<label htmlFor="" className='formLabel'>Bathrooms</label>
    <input className='formInputSmall' type="number" value={bathrooms} id="bathrooms" onChange={onMutate} min='1' max='50' required />

</div>

            </div>
            <label className='formLabel' htmlFor="">Parking Spot</label>
                <div className='formButtons'>
                    <button type='button' className={parking ? 'formButtonActive' :'formButton'} id='parking'  value={true} onClick={onMutate} main='1' max='50'>Yes</button>
                    <button type='button' className={!parking && parking !==null ? 'formButtonActive':'formButton'} id='parking'  value={false} onClick={onMutate}>No</button>
                    </div> 
                    <label className='formLabel' htmlFor="">Furnished</label>
                <div className='formButtons'>
                    <button type='button' className={furnished ? 'formButtonActive' :'formButton'} id='furnished'  value={true} onClick={onMutate}>Yes</button>
                    <button type='button' className={!furnished&& furnished !==null ? 'formButtonActive':'formButton'} id='parking'  value={false} onClick={onMutate}>No</button>
                    </div>

                    <label htmlFor="" className='formLabel'>Address</label>

                    <textarea className='formInputAddress' type='text' id='address'value={address} onChange={onMutate} required />

                    {!geoLocationEnabled && (
                        <div className='formLatLng flex' >

                            <div>
                                <label htmlFor="" className='formLabel'>Latitude</label>
                                <input type="number" className='formInputSmall' id='latitude' value={latitude} onChange={onMutate} required />
                            </div>
                            <div>

                            
                                <label htmlFor="" className='formLabel'>Longitude</label>
                                <input type="number" className='formInputSmall' id='longitude' value={longitude} onChange={onMutate} required />
                            

                        </div>
                        </div>

                        
                    )}

<label className='formLabel' htmlFor="">Offer</label>
                <div className='formButtons'>
                    <button type='button' className={offer ? 'formButtonActive' :'formButton'} id='offer'  value={true} onClick={onMutate}>Yes</button>
                    <button type='button' className={!offer&& offer !==null ? 'formButtonActive':'formButton'} id='offer'  value={false} onClick={onMutate}>No</button>
                    </div>

                    <label htmlFor="" className='formLabel'>Regular Price</label>
                    <div className='formpriceDiv'>

                        <input type="text" className='formInputSmall' id="regularPrice" value={regularPrice} onChange={onMutate} max='750000' min='60' required/>

                        {type==='rent' && (

                            <p className='formPriceText'>$/Month</p>
                        )}
                    </div>

                    {offer &&(
                        <>
                         
                         <label htmlFor="" className='formLabel'>Discounted Price</label>
                         <input type="number" className='formInputSmall' id='discountedPrice' value={discountedPrice} onChange={onMutate} required />

                         </>
                    )}
                <label className='formLabel'>Images

                </label>
                
                < p className='imagesInfo'>The first image will be the cover (max 6).</p>

<input className='formInputFile' type="file"  id="images" onChange={onMutate} max='6' accept='.jpg,.png,.jpeg' multiple required />







                    <button className='primaryButton createListingButton' type='submit' >Create Listing</button>


                </form>


        </main>

    </div>
  )
}

export default Createlistings