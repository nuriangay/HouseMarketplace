import React from 'react'
import {getAuth,updateProfile} from 'firebase/auth'
import {useEffect,useState} from 'react'
import { updateDoc,doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Listingıtem from '../components/Listingıtem'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import {collection,getDocs,query, where,orderBy,deleteDoc} from 'firebase/firestore'



import {useNavigate,Link} from 'react-router-dom'



function Profile() {
  
  const auth=getAuth()
  const[listings,setListings]=useState(null)
  const [changeDetails,setChangeDetails]=useState(false)
  const[formData,setFormData]=useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email


  })
  const {name,email} =formData
  
  const navigate=useNavigate()


  useEffect(()=>{

    const  fetchUserListings=async()=>{

      const listingsRef=collection(db,'listings')
      const q=query(listingsRef,where('userRef', '==' ,auth.currentUser.uid),orderBy('timestamp','desc'))

      const querySnap=await getDocs(q)

      let listings=[]

      querySnap.forEach((doc)=>{
        return listings.push({id:doc.id,data:doc.data()
      })
      })
      setListings(listings)



      }
      
    fetchUserListings()

  },[auth.currentUser.uid])





  const onLogOut =() =>{
    auth.signOut()
    navigate('/')

  }
  const onSubmit  = async () =>{
    try {

      if(auth.currentUser.displayName!==name){
        //update name in  fb

        await updateProfile(auth.currentUser,{
          displayName:name,
        
        })
      
        //update in firestorecd

        const userRef =doc(db,'users',auth.currentUser.uid)
        await updateDoc(userRef,{
          name,
        
        })
      
      }
      
    } catch (error) {
      toast.error('Could not update details')
      
    }

  }
  const onChange=(e)=>{

    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value,
    }))


  }
  const onDelete= async(listingId)=>{
    if(window.confirm('are you sure you want to delete?')){


      await deleteDoc(doc(db,'listings',listingId))

      const updatedListings=listings.filter((listing)=>listing.id!==listingId)
      setListings(updatedListings)
      toast.success('success delete')
    }

  }

 
  return  <div className='profile'>

    <header className='profileHeader'>

      <p className='pageHeader'>My Profile</p>
      <button type='button' onClick={onLogOut} className='logOut'>LogOut</button>
    </header>
    <main>
      <div className='profileDetailsHeader'>
        <p className='profleDetailsText'>Personal Details</p>
        <p className='changePersonalDetails' onClick={()=>{
          changeDetails && onSubmit()
          setChangeDetails((prevState)=>!prevState)
        }}>

          {changeDetails? 'done' : 'change'}
        </p>
        
      </div>
      <div className='profileCard'>
        <form>
          <input type="text "  id='name' className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={name} onChange={onChange}/>
          <input type="text "  id='email' className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange}/>
        </form>


      </div>
      <Link to ='/create-listing' className='createListing'>

        <img src={homeIcon} alt="home" />
        <p>Sell or rent your home</p>
        <img src={arrowRight} alt="arrow" />
      </Link>


      {listings?.length>0 &&(

        <>
        <p className='listingtext'>Listings</p>

        <ul className='listingsList'>

          {listings.map((listing)=>(
            <Listingıtem key={listing.id} listing={listing.data} id={listing.id} onDelete={() =>onDelete(listing.id)}/>
          ))}
        </ul>
        
        </>
      )}
    </main>
  </div>
    
  
}

export default Profile