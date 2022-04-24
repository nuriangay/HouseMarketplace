import React from 'react'


import {useState,useEffect} from 'react'
import {useParams,useSearchParams} from 'react-router-dom'
import {doc,getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import { Link } from 'react-router-dom'

function Contact() {

    const [message,setMessage]=useState(null)
    const [landlord,setLandlord]=useState(null)
    const [searchParams,setSearchParams]=useSearchParams(null)


    const params=useParams()


    useEffect(()=>{


        const getLandlord =async ()=>{
            const docRef=doc(db,'users',params.landlordId)
            const docSnap=await getDoc(docRef)



            if(docSnap.exists())
            {
                setLandlord(docSnap.data())


            }else{
                toast.error('could not get data')
            }

        }
        getLandlord()


    },[params.landlordId])


    const onChange=e=>setMessage(e.target.value)

  return (
    <div className='pageContainer'>

        <header className='pageHeader'>Contact Landlord</header>

        {landlord!==null&&(
            <main>
                <div className='contactLandlord'>

                    <p className='landlordName'>Contact {landlord?.name}</p>


                    <form className='messageForm'>

                        <div className='messageDiv'>
                            <label htmlFor='message' className='messageLabel'>Message</label>

                            <textarea name='message' id='message' className='textarea' value={message} onChange={onChange}></textarea>
                        </div>

                    <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')} &body=${message}`}>

                        <button type='button' className='primaryButton'>Send Message</button>
                    </a>
 

                    </form>
                </div>

            </main>
        )}
    </div>
  )
}

export default Contact