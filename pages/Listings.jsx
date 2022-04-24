import React from 'react'
import {useState,useEffect} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {getDoc,doc} from 'firebase/firestore'
import {getAuth  } from 'firebase/auth'
import {db}  from '../firebase.config'
import shareIcon from '../assets/svg/shareIcon.svg'
import SwiperCore, {Navigation,Pagination,Scrollbar,A11y}
from 'swiper'
import {Swiper,SwiperSlide} from 'swiper/react'
import 'swiper/swiper-bundle.css'
 SwiperCore.use([Navigation,Pagination,Scrollbar,A11y])

function Listings() {
    const[listing,setListing]=useState(null)
    const[shareLinkCopied,setshareLinkCopied]=useState(false)
    const[loading,setLoading]=useState(true)
    const navigate=useNavigate()
    const params =useParams()
    const auth=getAuth()


    useEffect(()=>{


        const fetchListing=async ()=>{
            const docRef=doc(db,'listings',params.listingId)
            const docSnap=await getDoc(docRef)

            if(docSnap.exists()){

                console.log(docSnap.data())
                setLoading(false)
                setListing(docSnap.data())
            }
        }
        fetchListing()




    },[navigate,params.listingId])
  return (
    <main>
        <Swiper slidesPerView={1} pagination={{clickable:true}}>
      {  listing.imgUrls.map((url,index)=>(
          <SwiperSlide key={index}>
              <div style={{background:`url(${listing.imgUrls[index]})  center no-repeat`, backgroundSize:'cover'}} className='swiperSlideDiv'></div>
          </SwiperSlide>
      ))}


        </Swiper>
        
        <div className='shareIconDiv' onClick={()=>{
            navigator.clipboard.writeText(window.location.href)
            setshareLinkCopied(true)
            setTimeout(()=>{
                setshareLinkCopied(false)

            },2000)
        }}>
            <img src={shareIcon} alt="share" />

        
        </div>

        {shareLinkCopied&& <p className='LinkCopied'>Link Copied</p>}
        <div className='listingDetails'>
            {console.log(listing)}

            <p className='listingName'>{listing.name}-${listing.offer ?listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}</p>

            <p className='listingLocation'>{listing.location}</p>
            <p className='listingType'>For {listing.type==='rent'?'Rent':'Sale'}</p>
            {listing.offer&&(
                <p className='discountPrice'>${listing.regularPrice-listing.discountedPrice}discount</p>

            )}
            
            <ul className='listingDetailsList'>
                <li>
                    {listing.bedrooms>1? `${listing.bedrooms}Bedrooms`:'1 Bedroom'}

                </li>
                <li>
                    {listing.bathrooms>1? `${listing.bathrooms}Bedrooms`:'1 Bathroom'}

                </li>
                <li>
                    {listing.parking&&'Parking Spot'}
                </li>
                <li>
                    {listing.furnished&&'Furnished'}
                </li>


            </ul>

            


            {auth.currentUser?.uid !==listing.userRef&&(

                <Link to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`} className="primaryButton" >Contact</Link>
            )}
        </div>
        
        
        
        </main>
  )
}

export default Listings