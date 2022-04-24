import React from 'react'
import {useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import {collection,getDocs,query,where,orderBy,limit,startAfter} from  'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Listingıtem from '../components/Listingıtem'

function Offers() {
    const [listings,setListings] =useState(null)
    const [loading,setLoading]=useState(true)
    const[lastFetchedListing,setLastFetchedListing] =useState(null)

    const params =useParams()

    useEffect( ()  =>{
        const fetchlistings=async ()=>{

            try {

                //getReference


                const listingRef=collection(db,'listings')

                //create a query


                const q=query(listingRef,where('offer','==',true),orderBy('timestamp','desc'),limit(10))

                //execute query

                const querySnap=await getDocs(q)

                let listings=[]


                querySnap.forEach((doc)=>{
                   return listings.push({
                       id:doc.id,
                       data:doc.data()
                   })

                })
                setListings(listings)
                setLoading(false)
                
            } catch (error) {
                toast.error('cannot get data')
                
            }
        }
        fetchlistings()

    },[])
  return (
    <div className='category'>
        <header>

            <p className='pageHeader'>Offers </p>
        </header>

        {loading ? ('loading' ) :listings&&listings.length>0? (
        <>
        <main>

            <ul className='categoryListings'>

                {listings.map((listing) => (

                   <Listingıtem listing={listing.data} id={listing.id} key={listing.id} />
                ))}

                </ul>
                </main>

                </>
        ):(

            <p>There are no current offers</p>

        )}

           
  
  

</div>

        )
}

export default Offers