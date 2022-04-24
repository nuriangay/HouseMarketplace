import React from 'react'
import {useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
import {collection,getDocs,query,where,orderBy,limit,startAfter} from  'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Listingıtem from '../components/Listingıtem'

function Category() {
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


                const q=query(listingRef,where('type','==',params.categoryName),orderBy('timestamp','desc'),limit(10))

                //execute query

                const querySnap=await getDocs(q)
                const lastVisible=querySnap.docs[querySnap.docs.length-1]
                setLastFetchedListing(lastVisible)
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

    },[params.categoryName])

    //pagination load more

    const onfetchmorelistings=async ()=>{

        try {

            //getReference


            const listingRef=collection(db,'listings')

            //create a query


            const q=query(listingRef,where('type','==',params.categoryName),orderBy('timestamp','desc'),limit(10),startAfter(lastFetchedListing),)

            //execute query

            const querySnap=await getDocs(q)
            const lastVisible=querySnap.docs[querySnap.docs.length-1]
            setLastFetchedListing(lastVisible)
            let listings=[]


            querySnap.forEach((doc)=>{
               return listings.push({
                   id:doc.id,
                   data:doc.data()
               })

            })
            setListings((prevState) =>[...prevState,...listings])
            setLoading(false)
            
        } catch (error) {
            toast.error('cannot get data')
            
        }
    }
  return (
    <div className='category'>
        <header>

            <p className='pageHeader'>{params.categoryName==='rent' ?'Places for rent' : 'Places for sale'} </p>
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


                <br />
                <br />


                {lastFetchedListing&& (

                    <p className='loadMore' onClick={onfetchmorelistings}>Load more</p>
                )}



                </>
        ):(

            <p>No listings for {params.categoryName}</p>

        )}

           
  
  

</div>

        )
}

export default Category